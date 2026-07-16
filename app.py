import os
import requests
from flask import Flask, Response, jsonify, render_template

app = Flask(__name__)

# ====================== KONFIGURASI PROXY ======================
AI_SERVER_URL = "http://127.0.0.1:5002"

def get_ai_status():
    try:
        response = requests.get(f"{AI_SERVER_URL}/api/status", timeout=2.0)
        if response.status_code == 200:
            return response.json()
    except requests.exceptions.RequestException:
        pass 
    
    return {
        "status": "offline",
        "device": "unknown",
        "fps": 0.0,
        "detections": 0,
        "last_error": "Koneksi ke AI Streamer (Port 5002) terputus.",
        "inference_enabled": True
    }

# ==========================================
# 1. ROUTE HALAMAN WEBSITE
# ==========================================
@app.route("/")
def dashboard():
    return render_template("dashboard.html", config=get_ai_status())

@app.route("/cctv")
def cctv_page():
    return render_template("cctv.html", config=get_ai_status())

@app.route("/lokasi")
def location_page():
    return render_template("lokasi.html", config=get_ai_status())

@app.route("/pekerja")
def worker_page():
    return render_template("pekerja.html", config=get_ai_status())

# ==========================================
# 2. PROXY STREAM & SNAPSHOT
# ==========================================
@app.route("/video_feed")
def video_feed():
    try:
        req = requests.get(f"{AI_SERVER_URL}/video_feed", stream=True, timeout=5.0)
        
        def stream_generator():
            try:
                for chunk in req.iter_content(chunk_size=8192):
                    if chunk:
                        yield chunk
            finally:
                # Menutup koneksi paksa saat tab browser ditutup
                req.close()

        return Response(
            stream_generator(), 
            mimetype="multipart/x-mixed-replace; boundary=frame",
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )
    except requests.exceptions.RequestException:
        return "AI Streamer (Port 5002) tidak dapat diakses atau sedang mati.", 503

@app.route("/api/snapshot")
def api_snapshot():
    try:
        # Menarik 1 frame saja untuk polling Cloudflare
        req = requests.get(f"{AI_SERVER_URL}/api/snapshot", timeout=2.0)
        if req.status_code == 200:
            return Response(req.content, mimetype="image/jpeg")
        return "", 404
    except requests.exceptions.RequestException:
        return "", 503

# ==========================================
# 3. PROXY API STATUS & KONTROL
# ==========================================
@app.route("/api/status")
def api_status():
    return jsonify(get_ai_status())

@app.route("/api/start", methods=["POST"])
def api_start():
    try:
        res = requests.post(f"{AI_SERVER_URL}/api/start", timeout=5.0)
        return jsonify(res.json()), res.status_code
    except requests.exceptions.RequestException:
        return jsonify(get_ai_status()), 503

@app.route("/api/stop", methods=["POST"])
def api_stop():
    try:
        res = requests.post(f"{AI_SERVER_URL}/api/stop", timeout=5.0)
        return jsonify(res.json()), res.status_code
    except requests.exceptions.RequestException:
        return jsonify(get_ai_status()), 503

@app.route("/health")
def health():
    status = get_ai_status()
    http_status = 200 if status["status"] in {"running", "starting", "connecting"} else 503
    return jsonify(status), http_status

if __name__ == "__main__":
    host = os.getenv("FLASK_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    
    print("=========================================================")
    print(f"Web Dashboard Utama berjalan di Port {port}")
    print(f"Mengambil stream video AI dari: {AI_SERVER_URL}")
    print("=========================================================")
    
    app.run(host=host, port=port, threaded=True, debug=debug, use_reloader=False)
