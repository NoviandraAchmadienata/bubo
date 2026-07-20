# Integrasi MQTT ke Flask App

## 📝 Modifikasi `app.py`

Tambahkan kode berikut di bagian atas file `app.py`:

```python
import os
import requests
import cv2
import time
from functools import wraps
from flask import Flask, Response, jsonify, render_template, request, redirect, session, url_for
from bubo_db import init_db, get_db_connection
from app_mqtt import start_mqtt_client, stop_mqtt_client  # ADD THIS LINE

app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.getenv("FLASK_SECRET_KEY") or os.urandom(32),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.getenv("SESSION_COOKIE_SECURE", "0") == "1",
)

# ====== MQTT INITIALIZATION ======
@app.before_first_request  # Atau gunakan app context jika Flask 2.3+
def initialize_mqtt():
    """Initialize MQTT client on app startup"""
    try:
        start_mqtt_client()
        app.logger.info("✓ MQTT Client initialized successfully")
    except Exception as e:
        app.logger.error(f"✗ MQTT Client initialization failed: {e}")

@app.teardown_appcontext
def cleanup_mqtt(exception):
    """Cleanup MQTT client on app shutdown"""
    try:
        stop_mqtt_client()
        app.logger.info("✓ MQTT Client stopped")
    except Exception as e:
        app.logger.error(f"✗ Error stopping MQTT Client: {e}")
```

---

## 🔌 API Endpoints untuk Frontend (React)

Tambahkan endpoint-endpoint berikut ke `app.py`:

```python
# ==========================================
# MQTT & DEVICE STATUS API
# ==========================================

@app.route("/api/workers/status", methods=["GET"])
@login_required
def get_workers_status():
    """Get all workers with real-time MQTT status"""
    try:
        conn = get_db_connection()
        workers = conn.execute("""
            SELECT 
                id,
                worker_code,
                name,
                job_role,
                armband_code,
                device_status,
                firmware_version,
                last_seen_at,
                is_active
            FROM workers
            WHERE is_active = TRUE
            ORDER BY name
        """).fetchall()
        conn.close()
        
        result = []
        for w in workers:
            d = dict(w)
            d['id'] = d['id']
            d['last_seen_ago'] = calculate_time_ago(d['last_seen_at'])
            result.append(d)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/worker/<worker_code>/location", methods=["GET"])
@login_required
def get_worker_location(worker_code):
    """Get latest location for a worker"""
    try:
        limit = request.args.get("limit", 100, type=int)
        conn = get_db_connection()
        
        locations = conn.execute("""
            SELECT 
                l.id,
                l.position_x,
                l.position_y,
                l.estimated_error,
                l.algorithm,
                l.measured_at,
                w.worker_code,
                w.name
            FROM location_readings l
            JOIN workers w ON l.worker_id = w.id
            WHERE w.worker_code = %s
            ORDER BY l.measured_at DESC
            LIMIT %s
        """, (worker_code, limit)).fetchall()
        
        conn.close()
        
        return jsonify([dict(loc) for loc in locations]), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/worker/<worker_code>/latest-location", methods=["GET"])
@login_required
def get_worker_latest_location(worker_code):
    """Get latest single location (for real-time map)"""
    try:
        conn = get_db_connection()
        
        location = conn.execute("""
            SELECT 
                l.position_x,
                l.position_y,
                l.estimated_error,
                l.algorithm,
                l.measured_at,
                w.worker_code,
                w.name,
                w.device_status
            FROM location_readings l
            JOIN workers w ON l.worker_id = w.id
            WHERE w.worker_code = %s
            ORDER BY l.measured_at DESC
            LIMIT 1
        """, (worker_code,)).fetchone()
        
        conn.close()
        
        if location:
            return jsonify(dict(location)), 200
        else:
            return jsonify({"error": "No location data found"}), 404
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/workers/map-view", methods=["GET"])
@login_required
def get_workers_map_view():
    """Get all workers with their latest locations for map view"""
    try:
        conn = get_db_connection()
        
        workers = conn.execute("""
            SELECT DISTINCT ON (w.id)
                w.id,
                w.worker_code,
                w.name,
                w.device_status,
                l.position_x,
                l.position_y,
                l.measured_at,
                w.last_seen_at
            FROM workers w
            LEFT JOIN location_readings l ON w.id = l.worker_id
            WHERE w.is_active = TRUE
            ORDER BY w.id, l.measured_at DESC
        """).fetchall()
        
        conn.close()
        
        result = []
        for w in workers:
            d = dict(w)
            d['last_seen_ago'] = calculate_time_ago(d['last_seen_at'])
            result.append(d)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/worker/<worker_code>/send-command", methods=["POST"])
@login_required
def send_worker_command(worker_code):
    """Send command to ESP32 device via MQTT"""
    try:
        from app_mqtt import mqtt_client_instance
        
        data = request.get_json()
        action = data.get("action")
        
        if not action:
            return jsonify({"error": "Action required"}), 400
        
        if not mqtt_client_instance or not mqtt_client_instance.is_connected():
            return jsonify({"error": "MQTT broker not connected"}), 503
        
        # Build command payload
        command = {
            "action": action
        }
        
        if action == "buzzer":
            command["duration"] = data.get("duration", 500)
        elif action == "led":
            command["state"] = data.get("state", "on")
        
        # Publish to device
        topic = f"bubo/worker/{worker_code}/command"
        payload = json.dumps(command)
        
        result = mqtt_client_instance.client.publish(topic, payload)
        
        if result.rc == 0:
            return jsonify({"success": True, "message": f"Command sent to {worker_code}"}), 200
        else:
            return jsonify({"error": f"Publish failed with code {result.rc}"}), 500
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/dashboard/summary", methods=["GET"])
@login_required
def get_dashboard_summary():
    """Get summary data for dashboard"""
    try:
        conn = get_db_connection()
        
        # Worker stats
        worker_stats = conn.execute("""
            SELECT
                COUNT(*) as total_workers,
                SUM(CASE WHEN device_status = 'online' THEN 1 ELSE 0 END) as online_workers,
                SUM(CASE WHEN device_status = 'offline' THEN 1 ELSE 0 END) as offline_workers,
                SUM(CASE WHEN device_status = 'maintenance' THEN 1 ELSE 0 END) as maintenance_workers
            FROM workers
            WHERE is_active = TRUE
        """).fetchone()
        
        # Recent activities
        recent_logs = conn.execute("""
            SELECT event_type, COUNT(*) as count
            FROM logs
            WHERE created_at > NOW() - INTERVAL '1 hour'
            GROUP BY event_type
            ORDER BY count DESC
        """).fetchall()
        
        conn.close()
        
        return jsonify({
            "worker_stats": dict(worker_stats) if worker_stats else {},
            "recent_activities": [dict(log) for log in recent_logs]
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/device/<worker_code>/restart", methods=["POST"])
@login_required
def restart_device(worker_code):
    """Send restart command to ESP32"""
    try:
        from app_mqtt import mqtt_client_instance
        
        if not mqtt_client_instance or not mqtt_client_instance.is_connected():
            return jsonify({"error": "MQTT broker not connected"}), 503
        
        command = {"action": "reset"}
        topic = f"bubo/worker/{worker_code}/command"
        payload = json.dumps(command)
        
        result = mqtt_client_instance.client.publish(topic, payload)
        
        if result.rc == 0:
            return jsonify({"success": True, "message": f"Restart command sent to {worker_code}"}), 200
        else:
            return jsonify({"error": f"Publish failed"}), 500
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==========================================
# HELPER FUNCTIONS
# ==========================================

def calculate_time_ago(timestamp):
    """Convert timestamp to 'time ago' format"""
    if not timestamp:
        return "Never"
    
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    if timestamp.tzinfo is None:
        timestamp = timestamp.replace(tzinfo=timezone.utc)
    
    diff = now - timestamp
    
    if diff.days > 0:
        return f"{diff.days}d ago"
    elif diff.seconds > 3600:
        return f"{diff.seconds // 3600}h ago"
    elif diff.seconds > 60:
        return f"{diff.seconds // 60}m ago"
    else:
        return "Now"
```

---

## 🎨 React Component Examples

### Contoh: Real-time Worker Status

```jsx
// WorkersStatus.jsx
import React, { useEffect, useState } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

export default function WorkersStatus() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetchWorkers();
    
    // Poll every 5 seconds
    const interval = setInterval(fetchWorkers, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await fetch('/api/workers/status');
      const data = await response.json();
      setWorkers(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch workers:', error);
    }
  };

  const sendCommand = async (workerCode, action) => {
    try {
      const response = await fetch(`/api/worker/${workerCode}/send-command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      const data = await response.json();
      alert(data.message || data.error);
    } catch (error) {
      console.error('Command failed:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Workers Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map((worker) => (
          <div 
            key={worker.id} 
            className={`p-4 border rounded-lg ${
              worker.device_status === 'online' 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">{worker.name}</h3>
              {worker.device_status === 'online' ? (
                <Wifi className="text-green-600" size={20} />
              ) : (
                <WifiOff className="text-red-600" size={20} />
              )}
            </div>
            
            <p className="text-sm text-gray-600">Code: {worker.worker_code}</p>
            <p className="text-sm text-gray-600">Status: {worker.device_status}</p>
            <p className="text-sm text-gray-600">Last seen: {worker.last_seen_ago}</p>
            <p className="text-sm text-gray-600">FW: {worker.firmware_version}</p>
            
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => sendCommand(worker.worker_code, 'buzzer')}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Buzzer
              </button>
              <button
                onClick={() => sendCommand(worker.worker_code, 'led')}
                className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                LED
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔄 WebSocket (Real-time Updates - Optional)

Jika ingin real-time updates tanpa polling, gunakan WebSocket:

```python
# Tambahkan ke requirements.txt
flask-socketio
python-socketio

# Di app.py
from flask_socketio import SocketIO, emit, join_room

socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('response', {'data': 'Connected'})

# Emit worker status updates ketika MQTT message diterima
# di app_mqtt.py, tambahkan callback ke handle_status_message:
def handle_status_message(data):
    # ... existing code ...
    # Emit ke connected clients
    socketio.emit('worker_status_update', data, broadcast=True)
```

---

**Dokumentasi lengkap tersedia di**: `MQTT_ESP32_INTEGRATION_GUIDE.md`
