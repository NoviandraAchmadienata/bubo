# Contoh Integrasi app_mqtt.py ke app.py

## Snippet: Tambahkan di bagian atas `app.py`

```python
import os
import requests
import cv2
import time
import json
from functools import wraps
from flask import Flask, Response, jsonify, render_template, request, redirect, session, url_for
from bubo_db import init_db, get_db_connection

# ====== MQTT IMPORT ======
try:
    from app_mqtt import start_mqtt_client, stop_mqtt_client, mqtt_client_instance
    MQTT_AVAILABLE = True
except ImportError:
    MQTT_AVAILABLE = False
    print("⚠️  MQTT module not found. Install: pip install paho-mqtt")

app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.getenv("FLASK_SECRET_KEY") or os.urandom(32),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.getenv("SESSION_COOKIE_SECURE", "0") == "1",
)

# ====== MQTT CLIENT INITIALIZATION ======
@app.before_first_request
def initialize_mqtt():
    """Initialize MQTT client when Flask starts"""
    if not MQTT_AVAILABLE:
        app.logger.warning("MQTT module not available")
        return
    
    try:
        start_mqtt_client()
        app.logger.info("✓ MQTT Client initialized successfully")
        app.config['MQTT_INITIALIZED'] = True
    except Exception as e:
        app.logger.error(f"✗ MQTT Client initialization failed: {e}")
        app.config['MQTT_INITIALIZED'] = False

@app.teardown_appcontext
def cleanup_mqtt(exception=None):
    """Clean up MQTT client when Flask shuts down"""
    if app.config.get('MQTT_INITIALIZED'):
        try:
            stop_mqtt_client()
            app.logger.info("✓ MQTT Client stopped")
        except Exception as e:
            app.logger.error(f"✗ Error stopping MQTT Client: {e}")

# ====== MQTT API ENDPOINTS ======

@app.route("/api/mqtt/status", methods=["GET"])
def get_mqtt_status():
    """Check MQTT broker connection status"""
    if not MQTT_AVAILABLE:
        return jsonify({
            "status": "unavailable",
            "message": "MQTT module not installed"
        }), 503
    
    try:
        is_connected = mqtt_client_instance is not None and mqtt_client_instance.is_connected()
        return jsonify({
            "status": "connected" if is_connected else "disconnected",
            "broker": os.getenv("MQTT_BROKER", "127.0.0.1"),
            "port": os.getenv("MQTT_PORT", 1883),
            "timestamp": datetime.now().isoformat()
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/workers/realtime", methods=["GET"])
def get_workers_realtime():
    """Get all workers with real-time MQTT status and location"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT DISTINCT ON (w.id)
                w.id,
                w.worker_code,
                w.name,
                w.job_role,
                w.device_status,
                w.firmware_version,
                w.last_seen_at,
                l.position_x,
                l.position_y,
                l.estimated_error,
                l.measured_at as location_time,
                CASE 
                    WHEN w.last_seen_at > NOW() - INTERVAL '5 minutes' THEN 'active'
                    WHEN w.last_seen_at > NOW() - INTERVAL '1 hour' THEN 'idle'
                    ELSE 'offline'
                END as realtime_status
            FROM workers w
            LEFT JOIN location_readings l ON w.id = l.worker_id
            WHERE w.is_active = TRUE
            ORDER BY w.id, l.measured_at DESC
        """)
        
        workers = []
        for row in cursor.fetchall():
            workers.append({
                'id': row[0],
                'worker_code': row[1],
                'name': row[2],
                'job_role': row[3],
                'device_status': row[4],
                'firmware_version': row[5],
                'last_seen_at': row[6].isoformat() if row[6] else None,
                'position_x': float(row[7]) if row[7] else None,
                'position_y': float(row[8]) if row[8] else None,
                'error': float(row[9]) if row[9] else None,
                'location_time': row[10].isoformat() if row[10] else None,
                'realtime_status': row[11]
            })
        
        cursor.close()
        conn.close()
        
        return jsonify({
            "total": len(workers),
            "workers": workers,
            "timestamp": datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/worker/<worker_code>/send-command", methods=["POST"])
def send_worker_command(worker_code):
    """Send MQTT command to device"""
    if not MQTT_AVAILABLE or not mqtt_client_instance or not mqtt_client_instance.is_connected():
        return jsonify({"error": "MQTT broker not connected"}), 503
    
    try:
        data = request.get_json()
        action = data.get("action")
        
        if not action:
            return jsonify({"error": "Action parameter required"}), 400
        
        # Build command payload
        command = {"action": action}
        
        if action == "buzzer":
            command["duration"] = data.get("duration", 500)
        elif action == "led":
            command["state"] = data.get("state", "on")
        elif action == "reset":
            pass  # No extra parameters needed
        else:
            return jsonify({"error": "Unknown action"}), 400
        
        # Publish to device
        topic = f"bubo/worker/{worker_code}/command"
        payload = json.dumps(command)
        
        result = mqtt_client_instance.client.publish(topic, payload)
        
        if result.rc == 0:
            # Log command in database
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO logs (worker_id, event_type, description, created_at)
                SELECT id, 'COMMAND_SENT', %s, NOW()
                FROM workers WHERE worker_code = %s
            """, (f"Command: {action}", worker_code))
            conn.commit()
            cursor.close()
            conn.close()
            
            return jsonify({
                "success": True,
                "message": f"Command '{action}' sent to {worker_code}",
                "topic": topic,
                "payload": command
            }), 200
        else:
            return jsonify({"error": f"Publish failed with code {result.rc}"}), 500
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/worker/<worker_code>/location/history", methods=["GET"])
def get_worker_location_history(worker_code):
    """Get location history for a worker with time range"""
    try:
        limit = request.args.get("limit", 100, type=int)
        hours = request.args.get("hours", 24, type=int)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
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
            AND l.measured_at > NOW() - INTERVAL '%s hours'
            ORDER BY l.measured_at DESC
            LIMIT %s
        """, (worker_code, hours, limit))
        
        locations = []
        for row in cursor.fetchall():
            locations.append({
                'id': row[0],
                'x': float(row[1]),
                'y': float(row[2]),
                'error': float(row[3]) if row[3] else None,
                'algorithm': row[4],
                'timestamp': row[5].isoformat(),
                'worker_code': row[6],
                'worker_name': row[7]
            })
        
        cursor.close()
        conn.close()
        
        return jsonify({
            "worker_code": worker_code,
            "total": len(locations),
            "locations": locations
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/dashboard/live-stats", methods=["GET"])
def get_dashboard_live_stats():
    """Get dashboard statistics updated from MQTT"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Worker statistics
        cursor.execute("""
            SELECT
                COUNT(*) as total_workers,
                SUM(CASE WHEN device_status = 'online' THEN 1 ELSE 0 END) as online,
                SUM(CASE WHEN device_status = 'offline' THEN 1 ELSE 0 END) as offline,
                SUM(CASE WHEN device_status = 'maintenance' THEN 1 ELSE 0 END) as maintenance
            FROM workers WHERE is_active = TRUE
        """)
        worker_stats = cursor.fetchone()
        
        # Recent activity
        cursor.execute("""
            SELECT event_type, COUNT(*) as count
            FROM logs
            WHERE created_at > NOW() - INTERVAL '1 hour'
            GROUP BY event_type
            ORDER BY count DESC
            LIMIT 5
        """)
        activities = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # MQTT Status
        mqtt_status = "connected" if (MQTT_AVAILABLE and mqtt_client_instance and mqtt_client_instance.is_connected()) else "disconnected"
        
        return jsonify({
            "timestamp": datetime.now().isoformat(),
            "workers": {
                "total": worker_stats[0] if worker_stats else 0,
                "online": worker_stats[1] if worker_stats else 0,
                "offline": worker_stats[2] if worker_stats else 0,
                "maintenance": worker_stats[3] if worker_stats else 0
            },
            "mqtt": {
                "status": mqtt_status,
                "broker": os.getenv("MQTT_BROKER")
            },
            "recent_activities": [
                {"event": row[0], "count": row[1]} for row in activities
            ]
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ====== HELPER FUNCTION ======
from datetime import datetime

def time_ago(dt):
    """Convert datetime to 'time ago' string"""
    if not dt:
        return "Never"
    
    now = datetime.now(dt.tzinfo) if dt.tzinfo else datetime.now()
    diff = now - dt
    
    if diff.days > 0:
        return f"{diff.days}d ago"
    elif diff.seconds > 3600:
        return f"{diff.seconds // 3600}h ago"
    elif diff.seconds > 60:
        return f"{diff.seconds // 60}m ago"
    else:
        return "Now"

# ====== EKSISTING ROUTES (tetap tidak berubah) ======
# ... rest of your existing routes ...
```

---

## 📝 Integration Checklist

- [ ] Import `app_mqtt` di bagian atas
- [ ] Add `@app.before_first_request` hook
- [ ] Add `@app.teardown_appcontext` hook
- [ ] Add `/api/mqtt/status` endpoint
- [ ] Add `/api/workers/realtime` endpoint
- [ ] Add `/api/worker/<id>/send-command` endpoint
- [ ] Add `/api/worker/<id>/location/history` endpoint
- [ ] Add `/api/dashboard/live-stats` endpoint
- [ ] Install `paho-mqtt`: `pip install paho-mqtt`
- [ ] Update `.env` dengan MQTT config
- [ ] Test endpoints dengan curl atau Postman
- [ ] Verifikasi MQTT messages masuk database

---

## 🧪 Testing dengan curl

```bash
# 1. Check MQTT status
curl http://localhost:5000/api/mqtt/status

# 2. Get real-time workers
curl http://localhost:5000/api/workers/realtime

# 3. Send buzzer command
curl -X POST http://localhost:5000/api/worker/W001/send-command \
  -H "Content-Type: application/json" \
  -d '{"action":"buzzer","duration":1000}'

# 4. Get location history
curl "http://localhost:5000/api/worker/W001/location/history?limit=50&hours=24"

# 5. Get live stats
curl http://localhost:5000/api/dashboard/live-stats
```

---

## 🎯 Troubleshooting Integration

**Error: "module 'flask' has no attribute 'before_first_request'"**
```python
# Flask 2.3+ gunakan:
@app.before_request
def initialize_mqtt():
    if not hasattr(app, 'mqtt_started'):
        # ... mqtt setup ...
        app.mqtt_started = True
```

**Error: "Cannot import name 'mqtt_client_instance'"**
```bash
# Pastikan app_mqtt.py ada di root folder
# Verify: ls -la app_mqtt.py
# Reinstall paho: pip install paho-mqtt --force-reinstall
```

---

**Ready to integrate!**
