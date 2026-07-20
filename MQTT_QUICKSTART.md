# MQTT ESP32 Integration - Quick Start Guide

## 🚀 Panduan Cepat Setup

### Step 1: Update `requirements.txt`

```bash
pip install flask paho-mqtt psycopg2-binary python-dotenv
```

Atau update file `requirements.txt`:
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

Kemudian install:
```bash
pip install -r requirements.txt
```

### Step 2: Setup Mosquitto

**Windows (Option 1 - Native):**
1. Download installer: https://mosquitto.org/download/
2. Install ke `C:\Program Files\mosquitto`
3. Start service: `mosquitto -c "C:\Program Files\mosquitto\mosquitto.conf"`

**Windows (Option 2 - Docker):**
```bash
docker run -d --name mosquitto -p 1883:1883 eclipse-mosquitto
```

**Linux:**
```bash
sudo apt-get install mosquitto mosquitto-clients
sudo systemctl start mosquitto
sudo systemctl enable mosquitto
```

### Step 3: Konfigurasi Environment

1. Copy `.env.example` ke `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` sesuai konfigurasi Anda:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bubo
DB_USER=postgres
DB_PASSWORD=your-password

MQTT_BROKER=127.0.0.1
MQTT_PORT=1883
```

### Step 4: Program ESP32

1. **Install Arduino IDE**: https://www.arduino.cc/en/software
2. **Add ESP32 Board URL** di Preferences:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. **Install Libraries**:
   - Tools → Manage Libraries
   - Cari dan install:
     - PubSubClient (Nick O'Leary)
     - ArduinoJson (Benoit Blanchon)

4. **Edit `esp32_mqtt_client.ino`**:
   - Ganti `YOUR_SSID` dengan WiFi SSID Anda
   - Ganti `YOUR_WIFI_PASSWORD` dengan password WiFi
   - Ganti `192.168.X.X` dengan IP komputer yang menjalankan Mosquitto
   - Ganti `W001` dengan Worker ID Anda

5. **Upload ke ESP32**:
   - Pilih Board: ESP32 Dev Module
   - Pilih Port yang sesuai
   - Click Upload

### Step 5: Start Aplikasi

```bash
# Terminal 1: Start Mosquitto
mosquitto -c mosquitto.conf

# Terminal 2: Monitor MQTT messages (opsional)
mosquitto_sub -h 127.0.0.1 -t "bubo/#" -v

# Terminal 3: Start Flask app
python app.py
```

### Step 6: Verifikasi Koneksi

**Check MQTT Messages:**
```bash
mosquitto_sub -h 127.0.0.1 -t "bubo/worker/#" -v
```

Anda akan lihat messages seperti:
```
bubo/worker/status/W001 {"worker_id":"W001","armband_code":"AB001","esp32_mac":"...","status":"online",...}
bubo/worker/location/W001 {"worker_id":"W001","position_x":10.5,"position_y":20.3,...}
bubo/worker/heartbeat W001
```

**Check Database:**
```bash
psql -U postgres -d bubo

# Lihat worker records
SELECT * FROM workers WHERE worker_code = 'W001';

# Lihat location history
SELECT * FROM location_readings ORDER BY measured_at DESC LIMIT 5;

# Lihat logs
SELECT * FROM logs ORDER BY created_at DESC LIMIT 10;
```

### Step 7: Dashboard

Akses frontend React di: `http://localhost:5000`

---

## 🔍 Debugging Tips

### ESP32 tidak connect WiFi
```
Solusi:
1. Check SSID & password di sketch
2. Lihat Serial Monitor di Arduino IDE
3. Restart ESP32
```

### MQTT Connection Refused
```
Solusi:
1. Pastikan Mosquitto running
2. Check IP address MQTT_BROKER di .env
3. Check firewall port 1883
```

### Data tidak masuk database
```
Solusi:
1. Check database connection di .env
2. Verify user & password database
3. Cek logs: tail -f /var/log/mosquitto/mosquitto.log
```

### Persistent Timeout
```
Solusi:
1. Increase keepalive: client.setKeepAlive(60)
2. Increase connection timeout di PubSubClient
3. Check network stability
```

---

## 📱 Test Remote Control

**Via Terminal:**
```bash
# Activate buzzer
mosquitto_pub -h 127.0.0.1 -t "bubo/worker/W001/command" \
  -m '{"action":"buzzer","duration":1000}'

# Control LED
mosquitto_pub -h 127.0.0.1 -t "bubo/worker/W001/command" \
  -m '{"action":"led","state":"on"}'

# Reset device
mosquitto_pub -h 127.0.0.1 -t "bubo/worker/W001/command" \
  -m '{"action":"reset"}'
```

---

## 🎯 Next Phase (Optional)

- [ ] Add encryption (SSL/TLS untuk MQTT)
- [ ] Add authentication (username/password)
- [ ] Add real WiFi triangulation algorithm
- [ ] Add database cleanup cronjob
- [ ] Add alerting system
- [ ] Add device management API

---

**Last Updated**: 2026-07-20
