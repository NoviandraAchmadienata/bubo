import os
import requests
import cv2
import time
from functools import wraps
from flask import Flask, Response, jsonify, render_template, request, redirect, session, url_for
from bubo_db import init_db, get_db_connection

app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.getenv("FLASK_SECRET_KEY") or os.urandom(32),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.getenv("SESSION_COOKIE_SECURE", "0") == "1",
)


def login_required(view):
    """Redirect anonymous browser requests, and return 401 for API calls."""
    @wraps(view)
    def wrapped(*args, **kwargs):
        if session.get("user_id"):
            return view(*args, **kwargs)
        if request.path.startswith("/api/"):
            return jsonify({"error": "Autentikasi diperlukan."}), 401
        return redirect(url_for("login_page", next=request.full_path))
    return wrapped


@app.after_request
def prevent_authenticated_page_caching(response):
    """Avoid Cloudflare or browser serving a cached page from another session."""
    if request.endpoint != "static":
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

# ====================== KONFIGURASI PROXY & STREAM ======================
AI_SERVER_URL = "http://127.0.0.1:5002"
RTSP_URL = os.getenv("RTSP_URL", "rtsp://BUBOCAM:bubo1234@192.168.50.62/stream1")

os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp"

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

def get_all_workers():
    conn = get_db_connection()
    workers = conn.execute("SELECT * FROM workers").fetchall()
    conn.close()
    result = []
    for w in workers:
        d = dict(w)
        d['id'] = d['uid']
        d['zone'] = 'Area Proyek'
        d['rssi'] = {
            'AP1': d['ap1_rssi'],
            'AP2': d['ap2_rssi'],
            'AP3': d['ap3_rssi'],
            'AP4': d['ap4_rssi']
        }
        result.append(d)
    return result

def get_all_logs():
    conn = get_db_connection()
    logs = conn.execute("SELECT * FROM logs").fetchall()
    conn.close()
    return [dict(l) for l in logs]

def get_all_videos():
    conn = get_db_connection()
    videos = conn.execute("SELECT * FROM videos").fetchall()
    conn.close()
    return [dict(v) for v in videos]

def get_all_users():
    conn = get_db_connection()
    users = conn.execute("SELECT * FROM users").fetchall()
    conn.close()
    return [dict(u) for u in users]

@app.route("/")
@login_required
def dashboard():
    workers = get_all_workers()
    stats = {
        "total_pekerja": len(workers),
        "pekerja_aktif": len([w for w in workers if w['status'] == 'ok']),
        "peringatan": len([w for w in workers if w['status'] == 'warning']),
        "bahaya": len([w for w in workers if w['status'] == 'danger'])
    }
    return render_template("dashboard.html", config=get_ai_status(), workers=workers, stats=stats)

@app.route("/cctv")
@login_required
def cctv_page():
    return render_template("cctv.html", config=get_ai_status())


@app.route("/cctv/tersimpan")
@login_required
def cctv_saved_page():
    return render_template("tersimpan.html", config=get_ai_status(), videos=get_all_videos())

@app.route("/lokasi")
@login_required
def lokasi_page():
    workers = get_all_workers()
    return render_template("lokasi.html", config=get_ai_status(), workers=workers)

@app.route("/pekerja")
@login_required
def pekerja_page():
    workers = get_all_workers()
    return render_template("pekerja.html", config=get_ai_status(), workers=workers)

@app.route("/laporan")
@login_required
def laporan_page():
    workers = get_all_workers()
    logs = get_all_logs()
    videos = get_all_videos()
    stats = {
        "total_laporan": len(logs),
        "pelanggaran_apd": len([l for l in logs if l['violation'].startswith('APD') or l['violation'].startswith('Safety') or l['violation'].startswith('Tidak Memakai')]),
        "rekaman": len(videos),
        "pekerja_aktif": len(workers)
    }
    return render_template("laporan.html", config=get_ai_status(), logs=logs, videos=videos, stats=stats)

@app.route("/login", methods=["GET", "POST"])
def login_page():
    if session.get("user_id"):
        return redirect(url_for("dashboard"))
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        
        if not username or not password:
            return render_template("login.html", error="Semua kolom harus diisi.")
            
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, role, status FROM users WHERE username = ? AND password = ?", (username, password))
        user = cursor.fetchone()
        conn.close()
        
        if user:
            if user['status'].lower() != 'aktif':
                return render_template("login.html", error="Akun Anda sedang nonaktif.")
            session.clear()
            session["user_id"] = user["id"]
            session["user_name"] = user["name"]
            session["user_role"] = user["role"]
            conn = get_db_connection()
            conn.execute("UPDATE users SET last_login = datetime('now', 'localtime') WHERE id = ?", (user["id"],))
            conn.commit()
            conn.close()
            next_url = request.args.get("next")
            if next_url and next_url.startswith("/") and not next_url.startswith("//"):
                return redirect(next_url)
            return redirect(url_for("dashboard"))
        else:
            return render_template("login.html", error="Username atau kata sandi salah!")
            
    return render_template("login.html")


@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return redirect(url_for("login_page"))

@app.route("/users")
@login_required
def users_page():
    users_list = get_all_users()
    stats = {
        "total": len(users_list),
        "admin": len([u for u in users_list if u['role'] == 'Admin']),
        "aktif": len([u for u in users_list if u['status'] == 'Aktif'])
    }
    return render_template("users.html", config=get_ai_status(), users=users_list, stats=stats)

# ==========================================
# 2. RTSP STREAMING
# ==========================================
def generate_frames():
    cap = cv2.VideoCapture(RTSP_URL)
    # Jika gagal buka RTSP, coba re-open.
    while True:
        if not cap.isOpened():
            print("Mencoba menyambungkan kembali ke RTSP...")
            cap.open(RTSP_URL)
            time.sleep(2)
            continue
            
        success, frame = cap.read()
        if not success:
            print("Gagal membaca frame, mencoba ulang...")
            time.sleep(1)
            cap.release()
            continue
            
        # Optional: resize to reduce bandwidth
        # frame = cv2.resize(frame, (640, 360))
            
        ret, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 70])
        if not ret:
            continue
            
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route("/api/snapshot")
@login_required
def api_snapshot():
    # Coba ambil snapshot dari AI Streamer (yang memiliki deteksi YOLO)
    try:
        res = requests.get(f"{AI_SERVER_URL}/api/snapshot", timeout=2.0)
        if res.status_code == 200:
            return Response(res.content, mimetype="image/jpeg")
    except requests.exceptions.RequestException:
        pass

    # Fallback ke raw RTSP stream jika AI Streamer mati
    cap = cv2.VideoCapture(RTSP_URL)
    if cap.isOpened():
        success, frame = cap.read()
        cap.release()
        if success:
            ret, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
            if ret:
                return Response(buffer.tobytes(), mimetype="image/jpeg")
    return "", 404

@app.route("/video_feed")
@login_required
def video_feed():
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    )

# ==========================================
# 3. PROXY API STATUS & KONTROL
# ==========================================
@app.route("/api/users", methods=["GET", "POST"])
@login_required
def api_users():
    conn = get_db_connection()
    if request.method == "POST":
        data = request.json
        conn.execute('INSERT INTO users (name, username, password, role, department, status) VALUES (?, ?, ?, ?, ?, ?)',
                     (data['name'], data['username'], data['password'], 'Operator', data['department'], data['status']))
        conn.commit()
        conn.close()
        return jsonify({"success": True}), 201
    
    users = conn.execute('SELECT * FROM users').fetchall()
    conn.close()
    return jsonify([dict(u) for u in users])

@app.route("/api/users/<int:user_id>", methods=["PUT", "DELETE"])
@login_required
def api_user_detail(user_id):
    conn = get_db_connection()
    if request.method == "DELETE":
        conn.execute('DELETE FROM users WHERE id = ?', (user_id,))
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    
    if request.method == "PUT":
        data = request.json
        conn.execute('UPDATE users SET name = ?, username = ?, department = ?, status = ? WHERE id = ?',
                     (data['name'], data['username'], data['department'], data['status'], user_id))
        conn.commit()
        conn.close()
        return jsonify({"success": True})

# ==========================================
# 4. PROXY API STATUS & KONTROL
# ==========================================
@app.route("/api/status")
@login_required
def api_status():
    return jsonify(get_ai_status())

@app.route("/api/start", methods=["POST"])
@login_required
def api_start():
    try:
        res = requests.post(f"{AI_SERVER_URL}/api/start", timeout=5.0)
        return jsonify(res.json()), res.status_code
    except requests.exceptions.RequestException:
        return jsonify(get_ai_status()), 503

@app.route("/api/stop", methods=["POST"])
@login_required
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
    init_db()  # Initialize database
    
    host = os.getenv("FLASK_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    
    print("=========================================================")
    print(f"Web Dashboard Utama berjalan di Port {port}")
    print(f"Mengambil stream video AI dari: {AI_SERVER_URL}")
    print("=========================================================")
    
    app.run(host=host, port=port, threaded=True, debug=debug, use_reloader=False)