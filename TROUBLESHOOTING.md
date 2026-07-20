# Troubleshooting Guide - ESP32 MQTT Integration

## 🔴 Masalah Umum dan Solusi

### 1. ESP32 Tidak Connect ke WiFi

**Gejala:**
- Serial Monitor menunjukkan "WiFi Connection Failed"
- LED tidak menyala
- Tidak ada MQTT messages

**Solusi:**
```
1. Cek SSID & Password di sketch:
   const char* ssid = "YOUR_SSID";
   const char* wifi_password = "YOUR_PASSWORD";

2. Pastikan WiFi tidak hidden
3. Cek format password (case-sensitive)
4. Monitor serial output:
   - Open Arduino IDE → Tools → Serial Monitor
   - Set baud rate ke 115200
   
5. Restart ESP32:
   - Disconnect & reconnect USB
   - Atau tekan tombol RESET di board
```

---

### 2. MQTT Connection Refused

**Gejala:**
```
MQTT Connection Failed, rc=5
```

**Solusi:**
```
1. Verifikasi IP Broker di .env:
   MQTT_BROKER=192.168.X.X
   
2. Pastikan Mosquitto running:
   Windows: mosquitto -c mosquitto.conf
   Linux: sudo systemctl status mosquitto
   
3. Check firewall:
   netstat -an | grep 1883 (Linux/Mac)
   netstat -an | findstr 1883 (Windows)
   
4. Restart MQTT broker:
   sudo systemctl restart mosquitto
   
5. Di ESP32, ubah IP ke localhost jika komputer sama:
   const char* mqtt_server = "127.0.0.1";
```

---

### 3. Data Tidak Masuk Database

**Gejala:**
- MQTT messages terlihat di mosquitto_sub
- Database workers masih empty
- No location_readings

**Solusi:**
```
1. Verifikasi database credentials di .env:
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your-password

2. Test database connection:
   psql -U postgres -d bubo
   
3. Cek logs Python:
   tail -f /var/log/mosquitto/mosquitto.log
   
4. Pastikan Flask app running dengan app_mqtt:
   python app.py
   
5. Check table structure:
   \d workers (di psql)
   
6. Insert test worker manually:
   INSERT INTO workers (worker_code, name, armband_code)
   VALUES ('W001', 'Test Worker', 'AB001');
```

---

### 4. ESP32 Disconnect Otomatis

**Gejala:**
- Connected, kemudian disconnect setelah beberapa menit
- MQTT re-connect terus menerus

**Solusi:**
```
1. Tingkatkan keep-alive di ESP32:
   Ubah di app_mqtt.py:
   self.client.connect(MQTT_BROKER, MQTT_PORT, keepalive=120)  // dari 60 ke 120

2. Stabilkan WiFi:
   - Ubah channel WiFi router
   - Terapkan power saving:
     WiFi.setSleep(false);  // Disable sleep di ESP32

3. Tambahkan reconnection logic:
   if (WiFi.status() != WL_CONNECTED) {
       setup_wifi();
   }

4. Increase timeout:
   client.setSocket(SOCKET_TIMEOUT, 30000);
```

---

### 5. Database Connection Timeout

**Gejala:**
```
psycopg2.OperationalError: timeout expired
```

**Solusi:**
```
1. Increase connection timeout di app_mqtt.py:
   conn = psycopg2.connect(
       ...,
       connect_timeout=10  // Add this
   )

2. Check database resource usage:
   SELECT * FROM pg_stat_activity;
   
3. Kill hanging connections:
   SELECT pid FROM pg_stat_activity WHERE state = 'idle';
   SELECT pg_terminate_backend(pid);

4. Increase database connection pool:
   max_connections=200 (di postgresql.conf)
```

---

### 6. Mosquitto tidak bisa subscribe topics

**Gejala:**
```
$ mosquitto_sub -h 127.0.0.1 -t "bubo/#"
(No messages received)
```

**Solusi:**
```
1. Publish test message terlebih dahulu:
   mosquitto_pub -h 127.0.0.1 -t "bubo/test" -m "hello"

2. Verifikasi persistence di mosquitto.conf:
   persistence true
   persistence_location /var/lib/mosquitto/

3. Check firewall:
   sudo ufw allow 1883/tcp

4. Verifikasi broker listening:
   netstat -tuln | grep 1883
   
5. Restart mosquitto dan clear old data:
   sudo systemctl stop mosquitto
   sudo rm -rf /var/lib/mosquitto/*
   sudo systemctl start mosquitto
```

---

### 7. React Dashboard tidak update real-time

**Gejala:**
- Dashboard loading, tapi data tidak refresh
- Workers status selalu "offline"
- Map tidak menunjukkan lokasi

**Solusi:**
```
1. Check browser console untuk errors:
   F12 → Console → lihat error messages

2. Verifikasi API endpoints working:
   curl http://localhost:5000/api/workers/status
   
3. Check CORS issues:
   // di Flask
   from flask_cors import CORS
   CORS(app)

4. Ensure Flask app started correctly:
   python app.py
   Cari message: "MQTT Client initialized successfully"

5. Polling interval terlalu cepat?
   // di React component
   const interval = setInterval(fetchWorkers, 5000); // 5 detik

6. Update interval di dashboard.jsx:
   Cari line: setInterval atau useEffect dependencies
```

---

### 8. Permission Denied saat install packages

**Gejala:**
```
ERROR: Permission denied: /usr/local/lib/python3.x/site-packages/
```

**Solusi:**
```
1. Gunakan virtual environment:
   python -m venv venv
   source venv/bin/activate (Linux)
   venv\Scripts\activate (Windows)

2. Install packages:
   pip install -r requirements.txt

3. Atau gunakan --user flag:
   pip install --user paho-mqtt
```

---

### 9. Memory Leak di ESP32

**Gejala:**
- ESP32 semakin lambat seiring waktu
- Akhirnya crash/reboot otomatis

**Solusi:**
```
1. Monitor memory di ESP32:
   Serial.println(ESP.getFreeHeap());

2. Hapus global variables yang tidak perlu

3. Batasi JSON document size:
   DynamicJsonDocument doc(256);  // Jangan terlalu besar

4. Implement periodic restart di ESP32:
   if (millis() > 86400000) {  // 24 jam
       ESP.restart();
   }

5. Clear MQTT subscription yang tidak dipakai:
   client.unsubscribe(old_topic);
```

---

### 10. "Cannot find module 'paho'"

**Gejala:**
```
ModuleNotFoundError: No module named 'paho'
```

**Solusi:**
```
1. Install paho-mqtt:
   pip install paho-mqtt

2. Verifikasi install:
   python -c "import paho.mqtt.client"

3. Check Python version compatibility:
   python --version
   pip list | grep paho

4. Reinstall:
   pip uninstall paho-mqtt
   pip install paho-mqtt==1.6.1
```

---

## 🟡 Performance Issues

### Slow Location Updates
```sql
-- Optimize database
CREATE INDEX idx_location_worker_time ON location_readings(worker_id, measured_at DESC);

-- Archive old data
DELETE FROM location_readings WHERE measured_at < NOW() - INTERVAL '90 days';

-- Check index usage
EXPLAIN ANALYZE SELECT * FROM location_readings WHERE worker_id = 1;
```

### High CPU Usage
```
1. Reduce PUBLISH_INTERVAL di ESP32:
   const unsigned long PUBLISH_INTERVAL = 10000;  // 10s instead of 5s

2. Reduce polling interval di React:
   setInterval(fetchWorkers, 10000);  // 10s instead of 5s

3. Implement database connection pooling:
   pip install psycopg2-pool
```

---

## 🟢 Testing Commands

```bash
# 1. Test MQTT Connection
mosquitto_sub -h 127.0.0.1 -t "bubo/#" -v

# 2. Publish test message
mosquitto_pub -h 127.0.0.1 -t "bubo/worker/W001/status" \
  -m '{"worker_id":"W001","status":"online"}'

# 3. Check database
psql -U postgres -d bubo -c "SELECT * FROM workers LIMIT 5;"

# 4. Run test suite
python test_mqtt_integration.py

# 5. Monitor Python logs
python app.py (watch output)

# 6. Check ESP32 Serial
Arduino IDE → Tools → Serial Monitor → 115200 baud
```

---

## 📞 Support Checklist

Sebelum troubleshoot lebih lanjut, pastikan:

- [ ] Python 3.7+ installed
- [ ] PostgreSQL running
- [ ] Mosquitto broker running
- [ ] ESP32 firmware uploaded
- [ ] WiFi credentials correct
- [ ] Database initialized with schema.sql
- [ ] .env file configured
- [ ] requirements.txt installed
- [ ] Firewall allows ports (1883, 5432, 5000)
- [ ] No typos di MQTT topics

---

**Last Updated**: 2026-07-20
**Status**: Ready for Production
