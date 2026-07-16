import os
import signal
import threading
import time
from dataclasses import dataclass
from typing import Optional

from flask import Flask, Response, jsonify

# ====================== KONFIGURASI ======================
RTSP_URL = os.getenv(
    "RTSP_URL",
    "rtsp://BUBOCAM:bubo1234@192.168.50.62/stream1",
)
MODEL_PATH = os.getenv("MODEL_PATH", "best2_openvino_model")
CONF_THRESHOLD = float(os.getenv("CONF_THRESHOLD", "0.4"))
IMG_SIZE = int(os.getenv("IMG_SIZE", "320"))
DISPLAY_WIDTH = os.getenv("DISPLAY_WIDTH")
DISPLAY_WIDTH = int(DISPLAY_WIDTH) if DISPLAY_WIDTH else None
STREAM_TIMEOUT = float(os.getenv("STREAM_TIMEOUT", "10.0"))
JPEG_QUALITY = int(os.getenv("JPEG_QUALITY", "60"))
ENABLE_YOLO = os.getenv("ENABLE_YOLO", "1") == "1"

# Memaksa TCP agar stream RTSP stabil dan tidak glitch.
os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp"

app = Flask(__name__)

@dataclass
class StreamStats:
    status: str = "stopped"
    device: str = "unknown"
    fps: float = 0.0
    detections: int = 0
    last_error: Optional[str] = None
    last_frame_at: Optional[float] = None
    started_at: Optional[float] = None
    frame_width: Optional[int] = None
    frame_height: Optional[int] = None
    model_path: str = MODEL_PATH
    rtsp_url: str = RTSP_URL
    conf_threshold: float = CONF_THRESHOLD
    img_size: int = IMG_SIZE
    inference_enabled: bool = ENABLE_YOLO

    def as_dict(self):
        now = time.time()
        return {
            "status": self.status,
            "device": self.device,
            "fps": round(self.fps, 1),
            "detections": self.detections,
            "last_error": self.last_error,
            "last_frame_at": self.last_frame_at,
            "seconds_since_frame": (
                round(now - self.last_frame_at, 1) if self.last_frame_at else None
            ),
            "uptime_seconds": round(now - self.started_at, 1) if self.started_at else 0,
            "frame_width": self.frame_width,
            "frame_height": self.frame_height,
            "model_path": self.model_path,
            "rtsp_url": self.rtsp_url,
            "conf_threshold": self.conf_threshold,
            "img_size": self.img_size,
            "inference_enabled": self.inference_enabled,
        }

class DetectionService:
    def __init__(self):
        self.lock = threading.Lock()
        self.frame_ready = threading.Condition(self.lock)
        self.stats = StreamStats()
        self.latest_jpeg: Optional[bytes] = None
        self.running = False
        self.worker: Optional[threading.Thread] = None
        self.model: Optional[object] = None

    def start(self):
        with self.lock:
            if self.running:
                return

            self.running = True
            self.stats.status = "starting"
            self.stats.started_at = time.time()
            self.stats.last_error = None
            self.worker = threading.Thread(target=self._run, daemon=True)
            self.worker.start()

    def stop(self):
        with self.lock:
            self.running = False
            self.stats.status = "stopped"
            self.frame_ready.notify_all()

        if self.worker and self.worker.is_alive():
            self.worker.join(timeout=2.0)

    def snapshot(self):
        with self.lock:
            return self.stats.as_dict()

    def get_latest_jpeg(self):
        with self.lock:
            return self.latest_jpeg

    def wait_for_frame(self, last_frame: Optional[bytes], timeout=2.0):
        with self.frame_ready:
            self.frame_ready.wait_for(
                lambda: self.latest_jpeg is not None and self.latest_jpeg is not last_frame,
                timeout=timeout,
            )
            return self.latest_jpeg

    def _load_model(self):
        if self.model is not None:
            return

        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Folder Model OpenVINO tidak ditemukan: {MODEL_PATH}.")

        from ultralytics import YOLO
        print(f"[INFO] Memuat AI dengan mesin OpenVINO dari: {MODEL_PATH} ...")
        model = YOLO(MODEL_PATH, task='detect')
        self.model = model
        self.stats.device = "openvino-cpu"

    def _open_capture(self, cv2):
        capture = cv2.VideoCapture(RTSP_URL, cv2.CAP_FFMPEG)
        capture.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        if not capture.isOpened():
            capture.release()
            raise RuntimeError("Tidak dapat membuka stream RTSP.")
        return capture

    def _set_error(self, message):
        with self.lock:
            self.stats.status = "error"
            self.stats.last_error = message
            self.frame_ready.notify_all()

    def _publish(self, jpeg, frame_shape, fps, detections):
        height, width = frame_shape[:2]
        with self.lock:
            self.latest_jpeg = jpeg
            self.stats.status = "running"
            self.stats.fps = fps
            self.stats.detections = detections
            self.stats.last_error = None
            self.stats.last_frame_at = time.time()
            self.stats.frame_width = width
            self.stats.frame_height = height
            self.frame_ready.notify_all()

    def _run(self):
        capture = None
        fps = 0.0
        prev_time = time.time()

        # Variabel thread-safe untuk menguras buffer kamera secara real-time
        latest_raw_frame = None
        frame_lock = threading.Lock()

        def camera_grabber_loop():
            """Thread khusus pembaca kamera untuk mengosongkan buffer internal OpenCV"""
            nonlocal capture, latest_raw_frame
            while self.running:
                if capture is not None and capture.isOpened():
                    ret, f = capture.read()
                    if ret and f is not None:
                        with frame_lock:
                            latest_raw_frame = f
                time.sleep(0.001)

        try:
            import cv2

            if ENABLE_YOLO:
                self._load_model()
            else:
                self.stats.device = "opencv-rtsp"

            # Inisialisasi thread penguras kamera
            grabber_thread = threading.Thread(target=camera_grabber_loop, daemon=True)

            while self.running:
                if capture is None or not capture.isOpened():
                    with self.lock:
                        self.stats.status = "connecting"
                    try:
                        capture = self._open_capture(cv2)
                        if not grabber_thread.is_alive():
                            grabber_thread = threading.Thread(target=camera_grabber_loop, daemon=True)
                            grabber_thread.start()
                    except Exception as exc:
                        self._set_error(str(exc))
                        time.sleep(3.0)
                        continue

                # Ambil frame yang paling fresh dari sub-thread (Bypass Antrean Buffer)
                with frame_lock:
                    frame = latest_raw_frame
                    latest_raw_frame = None  # Reset setelah diambil

                if frame is None:
                    time.sleep(0.005)
                    continue

                if ENABLE_YOLO:
                    results = self.model.predict(
                        frame,
                        conf=CONF_THRESHOLD,
                        imgsz=IMG_SIZE,
                        verbose=False,
                        iou=0.45,
                    )
                    annotated_frame = results[0].plot()
                    detections = len(results[0].boxes) if results and results[0].boxes else 0
                else:
                    annotated_frame = frame
                    detections = 0

                now = time.time()
                instant_fps = 1.0 / max(now - prev_time, 1e-6)
                fps = 0.9 * fps + 0.1 * instant_fps if fps else instant_fps
                prev_time = now

                cv2.putText(
                    annotated_frame,
                    f"STRIX GUARD OPENVINO LIVE | FPS: {fps:.1f}",
                    (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.8,
                    (0, 140, 255),
                    2,
                )

                if DISPLAY_WIDTH:
                    height, width = annotated_frame.shape[:2]
                    scale = DISPLAY_WIDTH / width
                    annotated_frame = cv2.resize(
                        annotated_frame, (DISPLAY_WIDTH, int(height * scale))
                    )

                ok, buffer = cv2.imencode(
                    ".jpg",
                    annotated_frame,
                    [int(cv2.IMWRITE_JPEG_QUALITY), JPEG_QUALITY],
                )
                if ok:
                    self._publish(buffer.tobytes(), annotated_frame.shape, fps, detections)
                
                time.sleep(0.001)

        except Exception as exc:
            self._set_error(str(exc))
        finally:
            if capture is not None:
                capture.release()
            with self.lock:
                if self.stats.status != "stopped":
                    self.stats.status = "stopped"
                self.running = False
                self.frame_ready.notify_all()


detector = DetectionService()

# ==========================================
# ENDPOINT INTERNAL
# ==========================================

@app.route("/video_feed")
def video_feed():
    detector.start()

    def generate():
        last_frame = None
        consecutive_failures = 0
        
        while True:
            frame = detector.wait_for_frame(last_frame, timeout=1.5)
            
            if frame is None:
                consecutive_failures += 1
                if consecutive_failures > 3:
                    print("⚠️ Stream timeout terdeteksi. Membebaskan thread.")
                    break
                time.sleep(0.1)
                continue
            
            consecutive_failures = 0
            last_frame = frame
            
            try:
                yield (
                    b"--frame\r\n"
                    b"Content-Type: image/jpeg\r\n"
                    b"Cache-Control: no-cache\r\n"
                    b"Connection: close\r\n\r\n" + frame + b"\r\n"
                )
            except (GeneratorExit, ConnectionResetError):
                break

    return Response(
        generate(), 
        mimetype="multipart/x-mixed-replace; boundary=frame",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    )

@app.route("/api/snapshot")
def api_snapshot():
    # Bangunkan AI jika belum menyala
    detector.start()
    
    # Mengambil 1 frame paling baru untuk kebutuhan polling Cloudflare
    jpeg = detector.get_latest_jpeg()
    if jpeg:
        return Response(jpeg, mimetype="image/jpeg")
    return "Tidak ada gambar", 404

@app.route("/api/status")
def api_status():
    return jsonify(detector.snapshot())

@app.route("/api/start", methods=["POST"])
def api_start():
    detector.start()
    return jsonify(detector.snapshot())

@app.route("/api/stop", methods=["POST"])
def api_stop():
    detector.stop()
    return jsonify(detector.snapshot())

@app.route("/health")
def health():
    status = detector.snapshot()
    http_status = 200 if status["status"] in {"running", "starting", "connecting"} else 503
    return jsonify(status), http_status

def shutdown_handler(signum, frame):
    detector.stop()
    raise SystemExit(0)

signal.signal(signal.SIGINT, shutdown_handler)
signal.signal(signal.SIGTERM, shutdown_handler)

if __name__ == "__main__":
    print("=========================================================")
    print("Mesin AI (OpenVINO Threaded Grabber) Berjalan di Background")
    print("Port: 5002 | Menunggu perintah dari Web Dashboard (app.py)")
    print("=========================================================")
    app.run(host="127.0.0.1", port=5002, threaded=True, debug=False, use_reloader=False)
