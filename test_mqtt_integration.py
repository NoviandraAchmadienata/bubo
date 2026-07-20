#!/usr/bin/env python3
"""
Test script untuk verifikasi MQTT to Database integration
Gunakan untuk debugging dan testing sebelum production
"""

import os
import json
import time
import sys
from datetime import datetime
from paho.mqtt import client as mqtt_client
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Config
MQTT_BROKER = os.getenv("MQTT_BROKER", "127.0.0.1")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))
MQTT_USERNAME = os.getenv("MQTT_USERNAME", "")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD", "")

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 5432))
DB_NAME = os.getenv("DB_NAME", "bubo")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

def test_mqtt_connection():
    """Test koneksi MQTT"""
    print("\n[TEST 1] Testing MQTT Connection...")
    print(f"  Broker: {MQTT_BROKER}:{MQTT_PORT}")
    
    try:
        client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION1, "test-client")
        
        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                print("  ✓ MQTT Connection successful!")
            else:
                print(f"  ✗ MQTT Connection failed with code {rc}")
        
        client.on_connect = on_connect
        client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
        client.loop_start()
        time.sleep(2)
        client.loop_stop()
        return True
        
    except Exception as e:
        print(f"  ✗ MQTT Connection error: {e}")
        return False

def test_database_connection():
    """Test koneksi Database"""
    print("\n[TEST 2] Testing Database Connection...")
    print(f"  Host: {DB_HOST}:{DB_PORT}/{DB_NAME}")
    
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM workers")
        count = cur.fetchone()[0]
        print(f"  ✓ Database connection successful!")
        print(f"  ✓ Workers in database: {count}")
        cur.close()
        conn.close()
        return True
        
    except psycopg2.Error as e:
        print(f"  ✗ Database connection error: {e}")
        return False

def test_mqtt_publish():
    """Test MQTT publish"""
    print("\n[TEST 3] Testing MQTT Publish...")
    
    try:
        client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION1, "test-publisher")
        
        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                print("  ✓ Connected to broker, publishing test messages...")
                
                # Test status message
                status_msg = {
                    "worker_id": "TEST001",
                    "armband_code": "AB_TEST",
                    "esp32_mac": "00:00:00:00:00:00",
                    "firmware_version": "1.0.0",
                    "status": "online",
                    "rssi": -65
                }
                client.publish("bubo/worker/status/TEST001", json.dumps(status_msg))
                print("  ✓ Published status message")
                
                # Test location message
                location_msg = {
                    "worker_id": "TEST001",
                    "position_x": 10.5,
                    "position_y": 20.3,
                    "estimated_error": 2.5,
                    "algorithm": "wifi_triangulation",
                    "model_version": "1.0"
                }
                client.publish("bubo/worker/location/TEST001", json.dumps(location_msg))
                print("  ✓ Published location message")
                
                # Test heartbeat
                client.publish("bubo/worker/heartbeat", "TEST001")
                print("  ✓ Published heartbeat message")
                
                time.sleep(1)
                client.disconnect()
        
        client.on_connect = on_connect
        client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
        client.loop_forever()
        return True
        
    except Exception as e:
        print(f"  ✗ MQTT publish error: {e}")
        return False

def test_database_tables():
    """Check if required tables exist"""
    print("\n[TEST 4] Checking Database Tables...")
    
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cur = conn.cursor()
        
        tables = ['workers', 'location_readings', 'logs', 'cameras']
        
        for table in tables:
            cur.execute(f"SELECT COUNT(*) FROM information_schema.tables WHERE table_name='{table}'")
            exists = cur.fetchone()[0] > 0
            status = "✓" if exists else "✗"
            print(f"  {status} Table '{table}' exists")
        
        cur.close()
        conn.close()
        return True
        
    except psycopg2.Error as e:
        print(f"  ✗ Error checking tables: {e}")
        return False

def test_worker_exists():
    """Check if test worker exists"""
    print("\n[TEST 5] Checking Sample Worker in Database...")
    
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cur = conn.cursor()
        
        # Try to find any worker
        cur.execute("SELECT worker_code, name, device_status FROM workers LIMIT 1")
        result = cur.fetchone()
        
        if result:
            worker_code, name, status = result
            print(f"  ✓ Found worker: {worker_code} ({name}), Status: {status}")
        else:
            print("  ⚠ No workers found in database")
            print("  💡 Tip: Add workers manually or via app interface")
        
        cur.close()
        conn.close()
        return True
        
    except psycopg2.Error as e:
        print(f"  ✗ Error querying workers: {e}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("BUBO MQTT ESP32 Integration - Test Suite")
    print("="*60)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = []
    
    # Run tests
    results.append(("MQTT Connection", test_mqtt_connection()))
    results.append(("Database Connection", test_database_connection()))
    results.append(("Database Tables", test_database_tables()))
    results.append(("Worker Record", test_worker_exists()))
    results.append(("MQTT Publish", test_mqtt_publish()))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = 0
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {test_name}")
        if result:
            passed += 1
    
    print("\n" + "-"*60)
    print(f"Total: {passed}/{len(results)} tests passed")
    print("="*60 + "\n")
    
    return passed == len(results)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
