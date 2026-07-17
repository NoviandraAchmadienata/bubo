import sqlite3
import os
from datetime import datetime

DB_NAME = 'bubo.db'

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        department TEXT,
        status TEXT NOT NULL DEFAULT 'Aktif',
        last_login TEXT
    )
    ''')
    
    # Create workers table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS workers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        init TEXT NOT NULL,
        color TEXT NOT NULL,
        blood_type TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT NOT NULL,
        status TEXT NOT NULL,
        zone TEXT NOT NULL,
        gx REAL NOT NULL,
        gy REAL NOT NULL,
        hr REAL NOT NULL,
        spo2 REAL NOT NULL,
        apd_status TEXT NOT NULL,
        avatar_class TEXT NOT NULL,
        ap1_rssi REAL NOT NULL,
        ap2_rssi REAL NOT NULL,
        ap3_rssi REAL NOT NULL,
        ap4_rssi REAL NOT NULL
    )
    ''')

    # Create logs table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        worker_id INTEGER,
        violation TEXT NOT NULL,
        camera TEXT NOT NULL,
        severity TEXT NOT NULL,
        status TEXT NOT NULL
    )
    ''')

    # Create videos table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        date TEXT NOT NULL,
        duration TEXT NOT NULL,
        camera TEXT NOT NULL,
        size TEXT NOT NULL
    )
    ''')
    
    # Check if we need to insert dummy data for users
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        dummy_users = [
            ("Ahmad Faruqi", "afaruqi", "pass123", "Admin", "Manajemen", "Aktif", "2026-07-16 09:15"),
            ("Rina Dewi", "rdewi", "pass123", "Supervisor", "Pengawas K3", "Aktif", "2026-07-16 08:30"),
            ("Budi Santoso", "bsantoso", "pass123", "Operator", "Lapangan", "Aktif", "2026-07-16 10:01"),
            ("Joko Bonaparte", "jbonaparte", "pass123", "Operator", "Lapangan", "Aktif", "2026-07-16 09:45"),
            ("Siti Rahayu", "srahayu", "pass123", "Operator", "Lapangan", "Aktif", "2026-07-16 09:50"),
            ("Bima Sakti", "bsakti", "pass123", "Operator", "Lapangan", "Aktif", "2026-07-16 09:38"),
            ("Aditya Pratama", "apratama", "pass123", "Operator", "Lapangan", "Nonaktif", "2026-07-15 17:22"),
            ("Ilham Maulana", "imaulana", "pass123", "Supervisor", "Pengawas K3", "Aktif", "2026-07-16 07:55")
        ]
        cursor.executemany('INSERT INTO users (name, username, password, role, department, status, last_login) VALUES (?, ?, ?, ?, ?, ?, ?)', dummy_users)

    # Check if we need to insert dummy data for workers
    cursor.execute("SELECT COUNT(*) FROM workers")
    if cursor.fetchone()[0] == 0:
        # Only 1 worker as requested for prototype
        dummy_workers = [
            ("123456789", "Joko Bonaparte", "J", "#835f3b", "AB+", "Jl. Kemang No 12", "08123456789", "ok", "Area Proyek", 12.5, 6.5, 85.7, 99.0, "Lengkap", "joko", -48, -70, -65, -82)
        ]
        cursor.executemany('''
        INSERT INTO workers (uid, name, init, color, blood_type, address, phone, status, zone, gx, gy, hr, spo2, apd_status, avatar_class, ap1_rssi, ap2_rssi, ap3_rssi, ap4_rssi)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', dummy_workers)

    # Check if we need to insert dummy data for videos
    cursor.execute("SELECT COUNT(*) FROM videos")
    if cursor.fetchone()[0] == 0:
        dummy_videos = [
            ("bubo_rec_20260715_0952.mp4", "15 Jul 2026", "00:02:14", "CAM 1", "47.2 MB"),
            ("bubo_rec_20260715_0838.mp4", "15 Jul 2026", "00:01:05", "CAM 1", "21.8 MB"),
            ("bubo_rec_20260714_1445.mp4", "14 Jul 2026", "00:03:41", "CAM 1", "76.4 MB")
        ]
        cursor.executemany('INSERT INTO videos (filename, date, duration, camera, size) VALUES (?, ?, ?, ?, ?)', dummy_videos)

    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

if __name__ == '__main__':
    init_db()
    print(f"Database {DB_NAME} initialized successfully.")
