# Prompt untuk Agent Setup MQTT ESP32 Integration

Berikut adalah prompt yang bisa digunakan untuk menjalankan setup di agent automation lain:

---

## 🤖 Agent Automation Prompt

```
TASK: Setup MQTT ESP32 Integration untuk BUBO Surveillance System

CONTEXT:
- Workspace: c:\Users\Lenovo\Documents\GitHub\bubo
- Database: PostgreSQL (schema sudah ada)
- Frontend: React Dashboard (sudah siap)
- Target: Hubungkan ESP32 devices via MQTT Mosquitto ke database

OBJECTIVES:
1. Setup Mosquitto MQTT Broker
2. Integrate Python MQTT client ke Flask backend
3. Prepare ESP32 firmware
4. Verify end-to-end communication
5. Document configuration

EXECUTION STEPS:

═══ PHASE 1: ENVIRONMENT SETUP ═══

[ ] 1.1 Verify Python & PostgreSQL
    Command: python --version && psql --version
    Expected: Python 3.7+ and PostgreSQL 10+

[ ] 1.2 Install Mosquitto Broker
    - Windows: 
      * Download: https://mosquitto.org/download/
      * Or use Docker: docker run -d -p 1883:1883 eclipse-mosquitto
    - Linux: sudo apt-get install mosquitto mosquitto-clients
    - Verify: mosquitto_sub -h 127.0.0.1 -t '$SYS/#' (should connect)

[ ] 1.3 Update Python dependencies
    Command: pip install -r requirements.txt
    Packages: paho-mqtt, psycopg2-binary, python-dotenv
    Verify: pip list | grep -E "paho|psycopg2|python-dotenv"

[ ] 1.4 Setup environment configuration
    - Copy .env.example to .env
    - Edit .env with:
      * DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
      * MQTT_BROKER (127.0.0.1 atau IP server)
      * MQTT_PORT (1883)

═══ PHASE 2: BACKEND INTEGRATION ═══

[ ] 2.1 Verify app_mqtt.py exists and is correct
    Path: c:\Users\Lenovo\Documents\GitHub\bubo\app_mqtt.py
    Check: File size ~270+ lines, contains MQTT client class
    
[ ] 2.2 Integrate MQTT into Flask app.py
    Location: Top of app.py (after Flask imports)
    Add:
    ```python
    try:
        from app_mqtt import start_mqtt_client, stop_mqtt_client, mqtt_client_instance
        MQTT_AVAILABLE = True
    except ImportError:
        MQTT_AVAILABLE = False
    ```
    
    Before first_request hook:
    ```python
    @app.before_first_request
    def initialize_mqtt():
        if MQTT_AVAILABLE:
            try:
                start_mqtt_client()
                app.logger.info("✓ MQTT Client initialized")
            except Exception as e:
                app.logger.error(f"✗ MQTT initialization failed: {e}")
    ```

[ ] 2.3 Add API endpoints untuk MQTT
    Copy dari INTEGRATION_SNIPPET.md:
    - /api/mqtt/status
    - /api/workers/realtime
    - /api/worker/<code>/send-command
    - /api/dashboard/live-stats

[ ] 2.4 Test Flask startup
    Command: python app.py
    Expected output:
    - ✓ Flask app started
    - ✓ MQTT Client initialized successfully
    - ✓ Database connected
    Timeout: 10 seconds, then stop (Ctrl+C)

═══ PHASE 3: MQTT VERIFICATION ═══

[ ] 3.1 Test MQTT Broker connection
    Command: mosquitto_sub -h 127.0.0.1 -t "bubo/#" -v
    Expected: Connected and waiting for messages
    Keep running in background

[ ] 3.2 Run integration test suite
    Command: python test_mqtt_integration.py
    Expected: 5/5 tests passed
    - ✓ MQTT Connection
    - ✓ Database Connection
    - ✓ Database Tables
    - ✓ Worker Record
    - ✓ MQTT Publish

[ ] 3.3 Verify database has test data
    Command (psql): SELECT COUNT(*) FROM workers;
    Expected: At least 1 worker record
    If empty: INSERT INTO workers (worker_code, name, armband_code) VALUES ('TEST001', 'Test', 'AB_TEST');

═══ PHASE 4: ESP32 FIRMWARE PREPARATION ═══

[ ] 4.1 Verify ESP32 firmware file
    Path: c:\Users\Lenovo\Documents\GitHub\bubo\esp32_mqtt_client.ino
    Check: File exists, ~500+ lines

[ ] 4.2 Document required modifications
    Create ESP32_SETUP_CHECKLIST.txt with:
    - Required Arduino IDE setup steps
    - Library installations needed
    - Configuration values needed:
      * WiFi SSID
      * WiFi Password
      * MQTT Broker IP (get from: ipconfig /all → IPv4)
      * Worker ID (W001, W002, etc)

[ ] 4.3 Create quick reference guide
    Create ESP32_CONFIG_QUICK_REFERENCE.txt:
    - Mosquitto status: mosquitto -c mosquitto.conf
    - Python app status: python app.py
    - Test MQTT: mosquitto_sub -h 127.0.0.1 -t "bubo/#" -v
    - Check database: psql -U postgres -d bubo -c "SELECT * FROM workers;"
    - API test: curl http://localhost:5000/api/mqtt/status

═══ PHASE 5: DOCUMENTATION & VERIFICATION ═══

[ ] 5.1 Verify all documentation files exist
    Files to check:
    - MQTT_ESP32_INTEGRATION_GUIDE.md ✓
    - MQTT_QUICKSTART.md ✓
    - API_ENDPOINTS_GUIDE.md ✓
    - TROUBLESHOOTING.md ✓
    - README_MQTT_SETUP.md ✓
    - INTEGRATION_SNIPPET.md ✓
    - SUMMARY.md ✓

[ ] 5.2 Create IMPLEMENTATION_STATUS.md
    Document:
    - Setup date & time
    - Completed phases
    - Current status
    - Next steps
    - Known issues (if any)

[ ] 5.3 Generate system configuration report
    Capture:
    - Python version: python --version
    - PostgreSQL version: psql --version
    - Mosquitto status: mosquitto --version
    - Network config: ipconfig (Windows) or ifconfig (Linux)
    - Database size: SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) FROM pg_database;

═══ PHASE 6: FINAL TESTING ═══

[ ] 6.1 End-to-end connectivity test
    Run: python test_mqtt_integration.py
    Expected: 5/5 PASS

[ ] 6.2 API endpoints test
    Commands:
    - curl http://localhost:5000/api/mqtt/status
    - curl http://localhost:5000/api/workers/realtime
    - curl http://localhost:5000/api/dashboard/live-stats
    Expected: All return valid JSON responses

[ ] 6.3 Database verification
    Commands:
    psql -U postgres -d bubo << EOF
    SELECT COUNT(*) as worker_count FROM workers;
    SELECT COUNT(*) as location_count FROM location_readings;
    SELECT COUNT(*) as log_count FROM logs;
    EOF
    Expected: Non-zero or zero counts displayed

═══ SUCCESS CRITERIA ═══

✓ All environment variables configured
✓ Mosquitto broker running on port 1883
✓ Flask app starts with MQTT client
✓ Database connected and accessible
✓ Test suite passes 5/5 tests
✓ API endpoints responding correctly
✓ ESP32 firmware files prepared with documentation
✓ Documentation complete and verified

═══ DELIVERABLES ═══

1. ✓ Setup environment variables (.env file)
2. ✓ Integrated MQTT into Flask backend
3. ✓ Verified database connectivity
4. ✓ Confirmed Mosquitto broker operational
5. ✓ Test suite passing
6. ✓ API endpoints validated
7. ✓ ESP32 firmware prepared
8. ✓ Configuration documented
9. ✓ Status report generated

═══ TROUBLESHOOTING IF NEEDED ═══

Problem: "Cannot import paho.mqtt"
→ Solution: pip install paho-mqtt --force-reinstall

Problem: "MQTT Connection refused"
→ Solution: Verify mosquitto is running, check firewall port 1883

Problem: "Database connection failed"
→ Solution: Verify PostgreSQL running, check .env credentials

Problem: "No such file or directory: app_mqtt.py"
→ Solution: Verify files are in workspace root directory

═══ POST-SETUP ═══

[ ] 6.1 Backup configuration
    Command: cp .env .env.backup

[ ] 6.2 Document system credentials (securely)
    - Database credentials
    - API keys (if any)

[ ] 6.3 Schedule maintenance tasks
    - Database backup: Weekly
    - Log rotation: Daily
    - Device firmware updates: Monthly

ESTIMATED TIME: 2-3 hours
STATUS: Ready for automation
```

---

## 📝 Alternatif: Prompt untuk Copilot Agent

```
Jalankan setup MQTT ESP32 integration dengan langkah-langkah berikut:

1. SETUP PHASE
   - Install Mosquitto broker (Docker atau native)
   - Update Python dependencies: pip install -r requirements.txt
   - Configure .env dengan database dan MQTT credentials

2. BACKEND PHASE
   - Verify app_mqtt.py exists
   - Integrate MQTT initialization ke app.py
   - Add REST API endpoints untuk MQTT communication
   - Test Flask app startup (Ctrl+C after confirm working)

3. TESTING PHASE
   - Run python test_mqtt_integration.py
   - Verify all 5 tests pass
   - Test MQTT message publishing: mosquitto_sub & mosquitto_pub
   - Verify database can be queried

4. DOCUMENTATION PHASE
   - Verify all 7 documentation files exist
   - Create implementation status report
   - Generate system configuration report
   - Document any issues or deviations

5. FINAL VERIFICATION
   - Curl test all API endpoints
   - Query database for record counts
   - Confirm Mosquitto broker connectivity
   - Generate success report

REPORT FORMAT:
- Phase completion status (✓ or ✗)
- Any errors encountered and resolution
- Test results (passed/failed counts)
- System configuration details
- Recommendations for next steps
```

---

## 🎯 Prompt untuk Automation Script

Jika menggunakan automation/scripting:

```bash
#!/bin/bash
# MQTT ESP32 Setup Automation Script

echo "========================================="
echo "BUBO MQTT ESP32 Setup Automation"
echo "========================================="

# Phase 1: Environment Setup
echo "[1/6] Setting up environment..."
pip install -r requirements.txt || exit 1
cp .env.example .env
echo "✓ Environment setup complete"

# Phase 2: Backend Integration
echo "[2/6] Integrating MQTT into Flask..."
# Add MQTT imports and initialization to app.py
python -c "import app_mqtt; print('✓ app_mqtt module verified')" || exit 1

# Phase 3: MQTT Broker Check
echo "[3/6] Checking Mosquitto broker..."
mosquitto_sub -h 127.0.0.1 -t '$SYS/#' -n -C 1 2>/dev/null && echo "✓ Mosquitto broker running" || echo "⚠ Mosquitto not responding"

# Phase 4: Database Verification
echo "[4/6] Verifying database..."
psql -U postgres -d bubo -c "SELECT COUNT(*) FROM workers;" > /dev/null 2>&1 && echo "✓ Database accessible" || exit 1

# Phase 5: Test Suite
echo "[5/6] Running test suite..."
python test_mqtt_integration.py || exit 1

# Phase 6: Documentation
echo "[6/6] Generating documentation..."
echo "Setup completed at: $(date)" > IMPLEMENTATION_STATUS.md
echo "✓ All phases complete!"
```

---

## 💻 PowerShell Automation (untuk Windows)

```powershell
# MQTT ESP32 Setup Automation (Windows)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "BUBO MQTT ESP32 Setup - Windows" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Phase 1: Install Mosquitto
Write-Host "[1/5] Installing Mosquitto..." -ForegroundColor Yellow
docker run -d -p 1883:1883 --name mosquitto eclipse-mosquitto
Start-Sleep -Seconds 3

# Phase 2: Install Python packages
Write-Host "[2/5] Installing Python packages..." -ForegroundColor Yellow
pip install -r requirements.txt

# Phase 3: Setup environment
Write-Host "[3/5] Setting up environment..." -ForegroundColor Yellow
Copy-Item .env.example .env
Write-Host "Edit .env with your database credentials" -ForegroundColor Cyan

# Phase 4: Test connectivity
Write-Host "[4/5] Testing connectivity..." -ForegroundColor Yellow
python test_mqtt_integration.py

# Phase 5: Generate report
Write-Host "[5/5] Generating report..." -ForegroundColor Yellow
$report = @"
Setup Date: $(Get-Date)
Environment: Windows
Status: Complete
Next Steps:
1. Edit .env file
2. Start Flask app: python app.py
3. Upload ESP32 firmware
"@
$report | Out-File -FilePath .\IMPLEMENTATION_STATUS.md -Encoding UTF8

Write-Host "✓ Setup complete!" -ForegroundColor Green
```

---

SUMMARY: Gunakan prompt di atas untuk automation tool atau Copilot agent lain dengan clear checklist dan expected outputs.
