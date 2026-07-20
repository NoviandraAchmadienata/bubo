# Panduan Integrasi ESP32 → MQTT Mosquitto → Database

## 📋 Ringkasan Alur Sistem

```
ESP32 (MQTT Publisher)
    ↓ [WiFi + MQTT]
Mosquitto Broker (Port 1883)
    ↓ [Subscribe Topics]
Python MQTT Client (app_mqtt.py)
    ↓ [Process & Validate]
PostgreSQL Database
    ↓ [Store Data]
Flask API (app.py)
    ↓ [REST API]
React Dashboard (Frontend)
```

## 🎯 Fase 1: Setup Mosquitto Broker

### 1.1 Instalasi Mosquitto di PC/Server

**Windows:**
```bash
# Download dan install dari: https://mosquitto.org/download/
# Atau gunakan WSL/Docker:
docker run -it -p 1883:1883 -p 9001:9001 eclipse-mosquitto
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install mosquitto mosquitto-clients
sudo systemctl start mosquitto
sudo systemctl enable mosquitto
```

### 1.2 Konfigurasi Mosquitto

Edit file `mosquitto.conf`:

```conf
# /etc/mosquitto/conf.d/default.conf (Linux)
# C:\Program Files\mosquitto\mosquitto.conf (Windows)

# Port default
listener 1883
protocol mqtt

# WebSocket (untuk koneksi dari browser jika diperlukan)
listener 9001
protocol websockets

# Disable authentication untuk development (ENABLE untuk production)
allow_anonymous true

# Persistent messages
persistence true
persistence_location /var/lib/mosquitto/

# Log
log_dest file /var/log/mosquitto/mosquitto.log
log_dest stdout

# Max connections
max_connections -1
```

### 1.3 Testing Mosquitto

```bash
# Terminal 1: Subscribe ke topic
mosquitto_sub -h 127.0.0.1 -t "bubo/worker/+/location" -v

# Terminal 2: Publish test message
mosquitto_pub -h 127.0.0.1 -t "bubo/worker/W001/location" -m '{"x":10.5,"y:20.3}'
```

---

## 🛠️ Fase 2: ESP32 Firmware

### 2.1 Setup Arduino IDE untuk ESP32

1. Install board ESP32: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
2. Install libraries:
   - `PubSubClient` by Nick O'Leary
   - `ArduinoJSON` by Benoit Blanchon
   - WiFi (built-in)

### 2.2 Kode ESP32 (esp32_mqtt_client.ino)

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Adafruit_ADXL345.h>  // Untuk akselerometer (opsional)

// ====== WIFI CONFIGURATION ======
const char* ssid = "YOUR_SSID";
const char* wifi_password = "YOUR_WIFI_PASSWORD";

// ====== MQTT CONFIGURATION ======
const char* mqtt_server = "192.168.X.X";  // IP PC/Server Anda
const int mqtt_port = 1883;
const char* mqtt_username = "";  // Kosong jika allow_anonymous = true
const char* mqtt_password = "";

// ====== DEVICE CONFIGURATION ======
const char* WORKER_ID = "W001";
const char* ARMBAND_CODE = "AB001";
String ESP32_MAC;
String FIRMWARE_VERSION = "1.0.0";

// ====== TOPIC DEFINITIONS ======
const char* TOPIC_STATUS = "bubo/worker/status";
const char* TOPIC_LOCATION = "bubo/worker/location";
const char* TOPIC_COMMAND = "bubo/worker/command";
const char* TOPIC_HEARTBEAT = "bubo/worker/heartbeat";

// ====== GLOBALS ======
WiFiClient espClient;
PubSubClient client(espClient);
unsigned long last_reconnect = 0;
unsigned long last_publish = 0;
const unsigned long PUBLISH_INTERVAL = 5000;  // Publish setiap 5 detik

// ====== ADXL345 (Accelerometer) ======
Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);

// ====== SETUP ======
void setup() {
  Serial.begin(115200);
  delay(500);
  
  Serial.println("\n\n========== BUBO ESP32 MQTT CLIENT ==========");
  Serial.print("Firmware Version: ");
  Serial.println(FIRMWARE_VERSION);
  
  // Get MAC Address
  ESP32_MAC = WiFi.macAddress();
  Serial.print("ESP32 MAC Address: ");
  Serial.println(ESP32_MAC);
  
  // Initialize sensors
  if (!accel.begin()) {
    Serial.println("[ERROR] ADXL345 tidak terdeteksi!");
  }
  
  // Connect WiFi
  setup_wifi();
  
  // Setup MQTT
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  
  Serial.println("Setup selesai!");
}

// ====== WIFI CONNECTION ======
void setup_wifi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, wifi_password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi Connection Failed!");
  }
}

// ====== MQTT CALLBACK ======
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.println(topic);
  
  char message[length + 1];
  memcpy(message, payload, length);
  message[length] = '\0';
  
  Serial.print("Payload: ");
  Serial.println(message);
  
  // Parse JSON command
  DynamicJsonDocument doc(256);
  DeserializationError error = deserializeJson(doc, message);
  
  if (error) {
    Serial.print("JSON parse error: ");
    Serial.println(error.c_str());
    return;
  }
  
  // Handle commands
  if (strncmp(topic, TOPIC_COMMAND, strlen(TOPIC_COMMAND)) == 0) {
    if (doc.containsKey("action")) {
      String action = doc["action"];
      
      if (action == "buzzer") {
        int duration = doc.containsKey("duration") ? doc["duration"] : 500;
        activate_buzzer(duration);
        Serial.println("Buzzer activated!");
      }
      else if (action == "led") {
        String state = doc["state"];
        // Control LED logic here
        Serial.print("LED state: ");
        Serial.println(state);
      }
    }
  }
}

// ====== RECONNECT MQTT ======
boolean reconnect() {
  if (client.connect(WORKER_ID)) {
    Serial.println("MQTT Connected!");
    
    // Publish online status
    publish_status("online");
    
    // Subscribe to command topic
    char subscribe_topic[100];
    sprintf(subscribe_topic, "bubo/worker/%s/command", WORKER_ID);
    client.subscribe(subscribe_topic);
    
    return true;
  } else {
    Serial.print("MQTT Connection Failed, rc=");
    Serial.println(client.state());
    return false;
  }
}

// ====== PUBLISH STATUS ======
void publish_status(const char* status) {
  DynamicJsonDocument doc(256);
  doc["worker_id"] = WORKER_ID;
  doc["armband_code"] = ARMBAND_CODE;
  doc["esp32_mac"] = ESP32_MAC;
  doc["firmware_version"] = FIRMWARE_VERSION;
  doc["status"] = status;
  doc["timestamp"] = millis();
  doc["rssi"] = WiFi.RSSI();  // Signal strength
  
  char buffer[256];
  serializeJson(doc, buffer);
  
  char topic[100];
  sprintf(topic, "%s/%s", TOPIC_STATUS, WORKER_ID);
  client.publish(topic, buffer);
  
  Serial.print("Published status: ");
  Serial.println(buffer);
}

// ====== PUBLISH LOCATION ======
void publish_location(float x, float y, float accuracy) {
  DynamicJsonDocument doc(512);
  doc["worker_id"] = WORKER_ID;
  doc["armband_code"] = ARMBAND_CODE;
  doc["position_x"] = x;
  doc["position_y"] = y;
  doc["estimated_error"] = accuracy;
  doc["timestamp"] = millis();
  doc["algorithm"] = "wifi_triangulation";
  doc["model_version"] = "1.0";
  
  char buffer[512];
  serializeJson(doc, buffer);
  
  char topic[100];
  sprintf(topic, "%s/%s", TOPIC_LOCATION, WORKER_ID);
  client.publish(topic, buffer);
  
  Serial.print("Published location: ");
  Serial.println(buffer);
}

// ====== PUBLISH SENSOR DATA ======
void publish_sensor_data() {
  sensors_event_t event;
  accel.getEvent(&event);
  
  DynamicJsonDocument doc(256);
  doc["worker_id"] = WORKER_ID;
  doc["accel_x"] = event.acceleration.x;
  doc["accel_y"] = event.acceleration.y;
  doc["accel_z"] = event.acceleration.z;
  doc["timestamp"] = millis();
  
  char buffer[256];
  serializeJson(doc, buffer);
  
  client.publish("bubo/worker/sensor", buffer);
}

// ====== BUZZER CONTROL ======
void activate_buzzer(int duration) {
  // Implement buzzer control logic
  // digitalWrite(BUZZER_PIN, HIGH);
  // delay(duration);
  // digitalWrite(BUZZER_PIN, LOW);
}

// ====== MAIN LOOP ======
void loop() {
  // Reconnect MQTT if needed
  if (!client.connected()) {
    unsigned long now = millis();
    if (now - last_reconnect > 5000) {
      last_reconnect = now;
      if (reconnect()) {
        last_reconnect = 0;
      }
    }
  } else {
    client.loop();
  }
  
  // WiFi reconnection check
  if (WiFi.status() != WL_CONNECTED) {
    setup_wifi();
  }
  
  // Publish data periodically
  unsigned long now = millis();
  if (now - last_publish > PUBLISH_INTERVAL) {
    last_publish = now;
    
    // Simulate location data (replace dengan WiFi triangulation logic)
    float random_x = random(0, 100) + random(0, 100) / 100.0;
    float random_y = random(0, 100) + random(0, 100) / 100.0;
    publish_location(random_x, random_y, 2.5);
    
    // Publish sensor data
    publish_sensor_data();
    
    // Heartbeat
    client.publish("bubo/worker/heartbeat", WORKER_ID);
  }
  
  delay(100);
}
```

---

## 🐍 Fase 3: Backend Python (MQTT Subscriber)

### 3.1 Update requirements.txt

```
flask
paho-mqtt
opencv-python
torch
ultralytics
openvino
psycopg2-binary
python-dotenv
```

### 3.2 Buat file `app_mqtt.py`

```python
import os
import json
import time
import threading
import logging
import psycopg2
from datetime import datetime, timedelta
from paho.mqtt import client as mqtt_client
from dotenv import load_dotenv

load_dotenv()

# ====== LOGGING ======
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("MQTT_Client")

# ====== CONFIG ======
MQTT_BROKER = os.getenv("MQTT_BROKER", "127.0.0.1")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))
MQTT_USERNAME = os.getenv("MQTT_USERNAME", "")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD", "")
MQTT_CLIENT_ID = "bubo-python-client"

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 5432))
DB_NAME = os.getenv("DB_NAME", "bubo")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

# Topics
TOPIC_STATUS = "bubo/worker/status"
TOPIC_LOCATION = "bubo/worker/location"
TOPIC_SENSOR = "bubo/worker/sensor"
TOPIC_HEARTBEAT = "bubo/worker/heartbeat"

# ====== DATABASE CONNECTION ======
def get_mqtt_db_connection():
    """Get database connection for MQTT handler"""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        return conn
    except psycopg2.Error as e:
        logger.error(f"Database connection failed: {e}")
        return None

# ====== MQTT CALLBACKS ======
def on_connect(client, userdata, flags, rc):
    """Callback when client connects to broker"""
    if rc == 0:
        logger.info("✓ Connected to MQTT Broker")
        # Subscribe to all topics
        client.subscribe(f"{TOPIC_STATUS}/#")
        client.subscribe(f"{TOPIC_LOCATION}/#")
        client.subscribe(f"{TOPIC_SENSOR}/#")
        client.subscribe(f"{TOPIC_HEARTBEAT}")
    else:
        logger.error(f"✗ Connection failed with code {rc}")

def on_disconnect(client, userdata, rc):
    """Callback when client disconnects"""
    if rc != 0:
        logger.warning(f"Unexpected disconnection. Code: {rc}")
    else:
        logger.info("Disconnected from MQTT Broker")

def on_message(client, userdata, msg):
    """Callback when message is received"""
    try:
        payload = json.loads(msg.payload.decode('utf-8'))
        logger.info(f"Message from {msg.topic}: {payload}")
        
        # Route message to appropriate handler
        if "status" in msg.topic:
            handle_status_message(payload)
        elif "location" in msg.topic:
            handle_location_message(payload)
        elif "sensor" in msg.topic:
            handle_sensor_message(payload)
        elif "heartbeat" in msg.topic:
            handle_heartbeat_message(payload.decode('utf-8') if isinstance(payload, bytes) else payload)
            
    except json.JSONDecodeError:
        logger.error(f"Invalid JSON payload: {msg.payload}")
    except Exception as e:
        logger.error(f"Error processing message: {e}")

# ====== MESSAGE HANDLERS ======
def handle_status_message(data):
    """Handle device status updates"""
    conn = get_mqtt_db_connection()
    if not conn:
        return
    
    try:
        worker_id = data.get('worker_id')
        esp32_mac = data.get('esp32_mac')
        status = data.get('status')
        firmware_version = data.get('firmware_version')
        rssi = data.get('rssi', 0)
        
        cur = conn.cursor()
        
        # Update worker record
        cur.execute("""
            UPDATE workers
            SET device_status = %s,
                firmware_version = %s,
                last_seen_at = NOW(),
                is_active = TRUE
            WHERE worker_code = %s
        """, (status, firmware_version, worker_id))
        
        # Log the status change
        cur.execute("""
            INSERT INTO logs (worker_id, event_type, description, created_at)
            SELECT id, 'STATUS_UPDATE', %s, NOW()
            FROM workers WHERE worker_code = %s
        """, (f"Status: {status}, RSSI: {rssi}dBm", worker_id))
        
        conn.commit()
        logger.info(f"✓ Updated status for {worker_id}: {status}")
        
    except psycopg2.Error as e:
        logger.error(f"Database error in handle_status_message: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

def handle_location_message(data):
    """Handle location updates from WiFi triangulation"""
    conn = get_mqtt_db_connection()
    if not conn:
        return
    
    try:
        worker_id = data.get('worker_id')
        position_x = data.get('position_x')
        position_y = data.get('position_y')
        error = data.get('estimated_error')
        algorithm = data.get('algorithm', 'knn')
        model_version = data.get('model_version', '1.0')
        timestamp = data.get('timestamp')
        
        cur = conn.cursor()
        
        # Get worker ID from database
        cur.execute("SELECT id FROM workers WHERE worker_code = %s", (worker_id,))
        result = cur.fetchone()
        
        if not result:
            logger.warning(f"Worker {worker_id} not found in database")
            return
        
        worker_db_id = result[0]
        
        # Insert location reading
        cur.execute("""
            INSERT INTO location_readings 
            (worker_id, position_x, position_y, estimated_error, algorithm, model_version, measured_at)
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
        """, (worker_db_id, position_x, position_y, error, algorithm, model_version))
        
        # Update last location
        cur.execute("""
            UPDATE workers
            SET last_seen_at = NOW()
            WHERE id = %s
        """, (worker_db_id,))
        
        conn.commit()
        logger.info(f"✓ Location recorded for {worker_id}: ({position_x}, {position_y})")
        
    except psycopg2.Error as e:
        logger.error(f"Database error in handle_location_message: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

def handle_sensor_message(data):
    """Handle sensor data (accelerometer, etc.)"""
    conn = get_mqtt_db_connection()
    if not conn:
        return
    
    try:
        worker_id = data.get('worker_id')
        accel_x = data.get('accel_x')
        accel_y = data.get('accel_y')
        accel_z = data.get('accel_z')
        
        cur = conn.cursor()
        
        # You can store sensor data in a separate table or logs
        cur.execute("""
            INSERT INTO logs (worker_id, event_type, description, created_at)
            SELECT id, 'SENSOR_DATA', %s, NOW()
            FROM workers WHERE worker_code = %s
        """, (f"Accel: X={accel_x}, Y={accel_y}, Z={accel_z}", worker_id))
        
        conn.commit()
        logger.debug(f"Sensor data recorded for {worker_id}")
        
    except psycopg2.Error as e:
        logger.error(f"Database error in handle_sensor_message: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

def handle_heartbeat_message(data):
    """Handle periodic heartbeat from device"""
    conn = get_mqtt_db_connection()
    if not conn:
        return
    
    try:
        worker_id = data if isinstance(data, str) else data.get('worker_id')
        
        cur = conn.cursor()
        cur.execute("""
            UPDATE workers
            SET last_seen_at = NOW()
            WHERE worker_code = %s
        """, (worker_id,))
        
        conn.commit()
        
    except psycopg2.Error as e:
        logger.error(f"Database error in handle_heartbeat_message: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

# ====== MQTT CLIENT CLASS ======
class BuboMQTTClient:
    def __init__(self):
        self.client = mqtt_client.Client(MQTT_CLIENT_ID)
        self.client.on_connect = on_connect
        self.client.on_disconnect = on_disconnect
        self.client.on_message = on_message
        
        if MQTT_USERNAME:
            self.client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    
    def connect(self):
        """Connect to MQTT broker"""
        try:
            logger.info(f"Connecting to MQTT broker at {MQTT_BROKER}:{MQTT_PORT}")
            self.client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
            self.client.loop_start()
            logger.info("MQTT Client loop started")
        except Exception as e:
            logger.error(f"Failed to connect to MQTT: {e}")
    
    def disconnect(self):
        """Disconnect from MQTT broker"""
        self.client.loop_stop()
        self.client.disconnect()
    
    def is_connected(self):
        """Check if connected"""
        return self.client.is_connected()

# ====== GLOBAL MQTT CLIENT ======
mqtt_client_instance = None

def start_mqtt_client():
    """Start the MQTT client"""
    global mqtt_client_instance
    mqtt_client_instance = BuboMQTTClient()
    mqtt_client_instance.connect()
    logger.info("MQTT Client initialized and connected")

def stop_mqtt_client():
    """Stop the MQTT client"""
    global mqtt_client_instance
    if mqtt_client_instance:
        mqtt_client_instance.disconnect()
        logger.info("MQTT Client stopped")

```

### 3.3 Integrasi dengan Flask (update app.py)

Tambahkan di bagian atas `app.py`:

```python
import os
import requests
import cv2
import time
from functools import wraps
from flask import Flask, Response, jsonify, render_template, request, redirect, session, url_for
from bubo_db import init_db, get_db_connection
from app_mqtt import start_mqtt_client, stop_mqtt_client, mqtt_client_instance  # ADD THIS

app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.getenv("FLASK_SECRET_KEY") or os.urandom(32),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.getenv("SESSION_COOKIE_SECURE", "0") == "1",
)

# ====== MQTT INITIALIZATION ======
@app.before_request
def before_request():
    if not hasattr(app, 'mqtt_started'):
        try:
            start_mqtt_client()
            app.mqtt_started = True
        except Exception as e:
            print(f"MQTT initialization error: {e}")

@app.teardown_appcontext
def teardown(exception):
    if hasattr(app, 'mqtt_started') and app.mqtt_started:
        stop_mqtt_client()
```

---

## 📝 Fase 4: Environment Configuration (.env)

Buat file `.env` di root project:

```env
# Flask
FLASK_ENV=development
FLASK_SECRET_KEY=your-secret-key-here
SESSION_COOKIE_SECURE=0

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bubo
DB_USER=postgres
DB_PASSWORD=your-db-password

# MQTT
MQTT_BROKER=192.168.X.X
MQTT_PORT=1883
MQTT_USERNAME=
MQTT_PASSWORD=

# AI Server
AI_SERVER_URL=http://127.0.0.1:5002
RTSP_URL=rtsp://BUBOCAM:bubo1234@192.168.50.62/stream1
```

---

## 🧪 Fase 5: Testing & Verification

### 5.1 Test Flow

```bash
# 1. Start Mosquitto
mosquitto -c mosquitto.conf

# 2. Start Flask app
python app.py

# 3. Upload code ke ESP32

# 4. Monitor MQTT messages
mosquitto_sub -h 127.0.0.1 -t "bubo/#" -v

# 5. Check database
psql -U postgres -d bubo
SELECT * FROM workers WHERE worker_code = 'W001';
SELECT * FROM location_readings ORDER BY measured_at DESC LIMIT 10;
```

### 5.2 API Endpoints untuk Dashboard

```bash
# Get workers with latest location
GET /api/workers

# Get location history
GET /api/worker/<worker_code>/locations?limit=100

# Get logs
GET /api/logs?filter=STATUS_UPDATE

# Update device status (manual)
POST /api/worker/<worker_code>/status
Body: {"status": "maintenance"}
```

---

## 🔧 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| ESP32 tidak connect WiFi | Cek SSID & password, check WiFi signal strength |
| MQTT connection refused | Cek IP broker, port 1883 terbuka, mosquitto running |
| Data tidak masuk database | Check database credentials, connection string di .env |
| Database timeout | Increase connection timeout di psycopg2 |
| ESP32 disconnect otomatis | Increase keep-alive interval di PubSubClient |

---

## 📊 Database Queries untuk Monitoring

```sql
-- Semua pekerja aktif dengan status real-time
SELECT worker_code, name, device_status, last_seen_at, firmware_version
FROM workers
WHERE is_active = TRUE
ORDER BY last_seen_at DESC;

-- Lokasi terbaru setiap pekerja
SELECT DISTINCT ON (w.id) w.worker_code, w.name, l.position_x, l.position_y, l.measured_at
FROM workers w
LEFT JOIN location_readings l ON w.id = l.worker_id
WHERE w.is_active = TRUE
ORDER BY w.id, l.measured_at DESC;

-- Activity log
SELECT w.worker_code, l.event_type, l.description, l.created_at
FROM logs l
JOIN workers w ON l.worker_id = w.id
ORDER BY l.created_at DESC
LIMIT 100;

-- Device uptime
SELECT worker_code, 
       COUNT(*) as total_heartbeats,
       MAX(last_seen_at) as last_active
FROM workers
GROUP BY worker_code;
```

---

## 🚀 Next Steps

1. ✅ Setup Mosquitto broker
2. ✅ Program ESP32 dengan firmware MQTT
3. ✅ Deploy app_mqtt.py di backend
4. ✅ Konfigurasi environment variables
5. ✅ Test koneksi end-to-end
6. ✅ Monitor real-time di dashboard React
7. ⚠️ Production: Enable authentication (username/password MQTT)
8. ⚠️ Production: Setup SSL/TLS untuk MQTT
9. ⚠️ Production: Configure firewall rules

---

**Created:** 2026-07-20
**Status:** Ready for Implementation
