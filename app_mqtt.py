import os
import json
import logging
import warnings
import psycopg2
import joblib
import numpy as np
from datetime import datetime
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

# KNN fingerprint model: four RSSI values in, coordinates on the BUBO site grid out.
MODEL_PATH = os.getenv("LOCALIZATION_MODEL_PATH", os.path.join(os.path.dirname(__file__), "model_lokalisasi_buboKNN.joblib"))
GRID_X_MAX = 26.0
GRID_Y_MAX = 15.0
LOCALIZATION_MODEL = None
MODEL_METADATA = {}

def load_localization_model():
    """Load the trusted local KNN model once at application startup."""
    global LOCALIZATION_MODEL, MODEL_METADATA
    try:
        bundle = joblib.load(MODEL_PATH)
        LOCALIZATION_MODEL = bundle["model"] if isinstance(bundle, dict) else bundle
        MODEL_METADATA = bundle if isinstance(bundle, dict) else {}
        if getattr(LOCALIZATION_MODEL, "n_features_in_", 0) != 4:
            raise ValueError("Model lokalisasi harus memiliki tepat empat fitur RSSI.")
        logger.info("Localization model loaded: %s", MODEL_METADATA.get("metode", "KNN"))
    except Exception as exc:
        LOCALIZATION_MODEL = None
        MODEL_METADATA = {}
        logger.error("Localization model unavailable: %s", exc)

def _rssi_value(data, index):
    """Accept documented and common ESP32 RSSI field names."""
    for key in (f"rssi_bubo_{index}", f"rssi_bubo{index}", f"ap{index}_rssi", f"rssi_ap{index}", f"AP{index}"):
        if data.get(key) is not None:
            return float(data[key])
    nested = data.get("rssi")
    if isinstance(nested, dict):
        for key in (f"bubo_{index}", f"bubo{index}", f"ap{index}", f"AP{index}"):
            if nested.get(key) is not None:
                return float(nested[key])
    return None

def predict_location_from_rssi(data):
    """Return KNN position and RSSI vector, or None for incomplete scans."""
    if LOCALIZATION_MODEL is None:
        return None
    try:
        rssi_values = [_rssi_value(data, index) for index in range(1, 5)]
        if any(value is None for value in rssi_values):
            return None
        with warnings.catch_warnings():
            warnings.filterwarnings("ignore", message="X does not have valid feature names")
            prediction = np.asarray(LOCALIZATION_MODEL.predict([rssi_values])[0], dtype=float)
        return (float(np.clip(prediction[0], 0, GRID_X_MAX)),
                float(np.clip(prediction[1], 0, GRID_Y_MAX)), rssi_values)
    except (TypeError, ValueError, IndexError) as exc:
        logger.warning("Invalid RSSI localization payload: %s", exc)
        return None

load_localization_model()

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
            worker_id = msg.payload.decode('utf-8')
            handle_heartbeat_message(worker_id)
            
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
        
        conn.commit()
        logger.info(f"✓ Updated status for {worker_id}: {status}")
        
    except psycopg2.Error as e:
        logger.error(f"Database error in handle_status_message: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

def handle_location_message(data):
    """Store a device coordinate or a KNN prediction from four RSSI readings."""
    conn = get_mqtt_db_connection()
    if not conn:
        return
    cur = None
    try:
        worker_id = data.get("worker_id")
        if not worker_id:
            logger.warning("Location ignored: worker_id is missing")
            return

        prediction = predict_location_from_rssi(data)
        if prediction:
            position_x, position_y, rssi_values = prediction
            error = float(MODEL_METADATA.get("rata_rata_error_final", 0)) or None
            algorithm = "knn-rssi-fingerprinting"
            model_version = str(MODEL_METADATA.get("algoritma", "KNeighborsRegressor"))
            logger.info("KNN location for %s: (%.1f, %.1f), RSSI=%s", worker_id, position_x, position_y, rssi_values)
        else:
            position_x = data.get("position_x", data.get("x"))
            position_y = data.get("position_y", data.get("y"))
            if position_x is None or position_y is None:
                logger.warning("Location ignored for %s: four RSSI values or coordinates are required", worker_id)
                return
            position_x = min(max(float(position_x), 0), GRID_X_MAX)
            position_y = min(max(float(position_y), 0), GRID_Y_MAX)
            error = data.get("estimated_error")
            algorithm = data.get("algorithm", "device-location")
            model_version = data.get("model_version", "1.0")

        cur = conn.cursor()
        cur.execute("SELECT id FROM workers WHERE worker_code = %s", (worker_id,))
        result = cur.fetchone()
        if not result:
            logger.warning("Worker %s not found in database", worker_id)
            return

        worker_db_id = result[0]
        cur.execute("""
            INSERT INTO location_readings
            (worker_id, position_x, position_y, estimated_error, algorithm, model_version, measured_at)
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
        """, (worker_db_id, position_x, position_y, error, algorithm, model_version))
        cur.execute("UPDATE workers SET last_seen_at = NOW(), is_active = TRUE WHERE id = %s", (worker_db_id,))
        conn.commit()
        logger.info("Location recorded for %s: (%.1f, %.1f)", worker_id, position_x, position_y)
    except (psycopg2.Error, TypeError, ValueError) as exc:
        logger.error("Database/localization error in handle_location_message: %s", exc)
        conn.rollback()
    finally:
        if cur:
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
        
        cur.execute("UPDATE workers SET last_seen_at = NOW() WHERE worker_code = %s", (worker_id,))
        conn.commit()
        logger.debug(f"Sensor data recorded for {worker_id}")
        
    except psycopg2.Error as e:
        logger.error(f"Database error in handle_sensor_message: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

def handle_heartbeat_message(worker_id):
    """Handle periodic heartbeat from device"""
    conn = get_mqtt_db_connection()
    if not conn:
        return
    
    try:
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
        self.client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION1, MQTT_CLIENT_ID)
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
