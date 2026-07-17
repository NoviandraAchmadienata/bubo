# 📖 BUBO STRAP - Struktur Manual Book

## DAFTAR ISI & STRUKTUR SECTION

---

## **BAGIAN 1: PENDAHULUAN**

### 1.1 Gambaran Umum Sistem
- Tujuan aplikasi BUBO STRAP
- Fitur-fitur utama
- Target pengguna

### 1.2 Requirement Sistem
- OS Requirements (Linux/Windows/Mac)
- Hardware Specifications
- Network Requirements (RTSP, WiFi)

### 1.3 Arsitektur Sistem
- System Architecture Diagram
- Component Overview
- Technology Stack

**File yang dimasukkan:**
- `app.py` (baris 1-50) - Overview struktur Flask

---

## **BAGIAN 2: INSTALASI & SETUP**

### 2.1 Persiapan Environment
- Python version (3.8+)
- Virtual environment setup (venv/conda)
- Download & ekstrak source code

### 2.2 Instalasi Dependencies
- Command: `pip install -r requirements.txt`
- Penjelasan setiap library

**File yang dimasukkan:**
```
requirements.txt (lengkap)
```

### 2.3 Database Setup
- Inisialisasi database SQLite
- Default dummy data
- User credentials default

**File yang dimasukkan:**
```
bubo_db.py (baris 1-100) - Database initialization
schema.sql (lengkap) - Database schema
```

### 2.4 Konfigurasi Environment
- Environment variables (.env file)
- RTSP URL configuration
- AI Server URL setup
- Secret key generation

**File yang dimasukkan:**
```
app.py (baris 37-45) - Configuration section
```

---

## **BAGIAN 3: KONFIGURASI SISTEM**

### 3.1 Konfigurasi Aplikasi Flask
- Flask app initialization
- Session configuration
- Security settings

**File yang dimasukkan:**
```
app.py (baris 8-16) - Flask initialization
app.py (baris 31-35) - Cache prevention
```

### 3.2 Konfigurasi Network
- RTSP stream configuration
- AI Server connection
- WiFi access points setup

**File yang dimasukkan:**
```
app.py (baris 37-45) - Network config
```

### 3.3 Konfigurasi Database
- Database connection
- Table structure
- User roles & permissions

**File yang dimasukkan:**
```
bubo_db.py (lengkap)
schema.sql (bagian users & workers)
```

---

## **BAGIAN 4: AUTHENTICATION & SECURITY**

### 4.1 Sistem Login
- Login mechanism
- Password validation
- Session management

**File yang dimasukkan:**
```
app.py (baris 150-190) - Login page route & logic
templates/login.html (lengkap)
```

### 4.2 Authorization & Access Control
- Login required decorator
- Role-based access control
- Permission management

**File yang dimasukkan:**
```
app.py (baris 19-28) - login_required decorator
```

### 4.3 Security Features
- Cache prevention
- CSRF protection
- Session cookie configuration
- Password hashing (rekomendasi)

**File yang dimasukkan:**
```
app.py (baris 31-35) - prevent_authenticated_page_caching
app.py (baris 11-16) - Security config
```

---

## **BAGIAN 5: DATABASE & DATA STRUCTURE**

### 5.1 Database Schema
- Users table (user management)
- Workers table (pekerja tracking)
- Logs table (violation records)
- Videos table (recording management)

**File yang dimasukkan:**
```
schema.sql (lengkap)
bubo_db.py (baris 13-70)
```

### 5.2 User Roles & Permissions
- Admin role
- Supervisor role
- Operator role
- Permission matrix

**File yang dimasukkan:**
```
bubo_db.py (baris 76-90) - dummy users
app.py (baris 194) - role checking
```

### 5.3 Data Models
- User model
- Worker model
- Log model
- Video model

**File yang dimasukkan:**
```
bubo_db.py (table definitions)
```

---

## **BAGIAN 6: API ENDPOINTS & ROUTING**

### 6.1 Page Routes
| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Dashboard |
| `/login` | GET, POST | Login page |
| `/cctv` | GET | CCTV streaming |
| `/pekerja` | GET | Workers list |
| `/lokasi` | GET | Location tracking |
| `/laporan` | GET | Reports & violations |
| `/users` | GET | User management |
| `/logout` | POST | Logout |

**File yang dimasukkan:**
```
app.py (baris 95-145) - Page routes
```

### 6.2 API Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/users` | GET, POST | Manage users |
| `/api/users/<id>` | PUT, DELETE | User detail |
| `/api/snapshot` | GET | Get snapshot |
| `/api/status` | GET | AI status |
| `/video_feed` | GET | Video stream |

**File yang dimasukkan:**
```
app.py (baris 270-305) - API endpoints
```

### 6.3 Video Streaming
- RTSP stream handling
- Frame generation
- Error handling & fallback

**File yang dimasukkan:**
```
app.py (baris 215-270) - Video streaming functions
```

### 6.4 AI Integration
- AI server connection
- Status checking
- Detection handling

**File yang dimasukkan:**
```
app.py (baris 47-57) - get_ai_status function
```

---

## **BAGIAN 7: FRONTEND & USER INTERFACE**

### 7.1 HTML Templates
| File | Purpose |
|------|---------|
| `login.html` | Login page UI |
| `dashboard.html` | Main dashboard |
| `cctv.html` | CCTV viewer |
| `pekerja.html` | Workers list |
| `lokasi.html` | Location map |
| `laporan.html` | Reports page |
| `users.html` | User management |

**File yang dimasukkan:**
```
templates/login.html (baris 1-50)
templates/dashboard.html (baris 1-100)
```

### 7.2 CSS & Styling
- TailwindCSS integration
- Custom styles
- Responsive design

**File yang dimasukkan:**
```
static/styles.css (overview)
templates/dashboard.html (inline styles)
```

### 7.3 JavaScript & Components
- React components
- Chart integration (Recharts)
- Event handling
- Data binding

**File yang dimasukkan:**
```
static/dashboard.jsx (overview)
static/sidebar.js (overview)
```

### 7.4 Vendor Libraries
- React & React-DOM
- Recharts (charting)
- TailwindCSS
- Babel (transpiler)
- Lucide (icons)

**File yang dimasukkan:**
```
static/vendor/ (list semua files)
```

---

## **BAGIAN 8: OPERATION & USAGE**

### 8.1 Cara Menjalankan Aplikasi
1. Aktivasi virtual environment
2. Install dependencies
3. Setup database
4. Run Flask app
5. Access dashboard

**Command Examples:**
```bash
python3 app.py
# atau
flask run
```

### 8.2 User Management
- Membuat user baru
- Edit user
- Delete user
- Change role & department

**File yang dimasukkan:**
```
app.py (baris 270-305) - API functions
templates/users.html
```

### 8.3 Monitoring Features
- Live CCTV viewing
- Worker tracking
- Violation reports
- Video recordings

**File yang dimasukkan:**
```
app.py (baris 130-145) - Page routes
templates/dashboard.html
```

### 8.4 Dashboard Usage
- Viewing statistics
- Monitoring active workers
- Checking violations
- Accessing reports

**File yang dimasukkan:**
```
templates/dashboard.html
static/dashboard.jsx
```

---

## **BAGIAN 9: DEPLOYMENT & MAINTENANCE**

### 9.1 Production Setup
- Server requirements
- Environment configuration
- Database migration
- Static files serving

**File yang dimasukkan:**
```
deploy/bubo-dashboard.service
deploy/cloudflare-dashboard.md
```

### 9.2 Systemd Service Configuration
- Service file setup
- Auto-restart configuration
- Logging setup

**File yang dimasukkan:**
```
deploy/bubo-dashboard.service (lengkap)
```

### 9.3 Monitoring & Logging
- Application logs
- Error handling
- Debug mode

**File yang dimasukkan:**
```
app.log
ai.log
web.log
```

### 9.4 Troubleshooting
- Common issues
- Error messages
- Solution guide

---

## **BAGIAN 10: ADVANCED TOPICS**

### 10.1 AI Model Integration
- YOLO model explanation
- OpenVINO optimization
- Model deployment

**File yang dimasukkan:**
```
best.pt (model file info)
best2.pt (model file info)
best2_openvino_model/ (metadata.yaml)
```

### 10.2 Real-time Streaming
- RTSP protocol
- Frame buffering
- Bandwidth optimization

### 10.3 WiFi Positioning
- RSSI-based positioning
- Access point configuration
- Triangulation algorithm

### 10.4 Security Best Practices
- Password security
- Database security
- Network security
- API security

---

## **BAGIAN 11: APPENDIX**

### A. Glossary (Daftar Istilah)
- RTSP
- YOLO
- OpenVINO
- RSSI
- Flask
- CCTV
- APD (Alat Pelindung Diri)

### B. Default Credentials
- Default users & passwords
- Sample data

**File yang dimasukkan:**
```
bubo_db.py (baris 76-90)
```

### C. API Documentation
- Request/response format
- Error codes
- Example calls

**File yang dimasukkan:**
```
app.py (API endpoints section)
```

### D. Database Backup & Recovery
- Backup procedures
- Recovery steps
- Data integrity checks

### E. Frequently Asked Questions (FAQ)
- Common questions
- Troubleshooting tips
- Best practices

### F. Contact & Support
- Developer contact
- Support channels
- Version history

---

## 📊 **FILE CHECKLIST UNTUK MANUAL BOOK**

```
✅ app.py
   └─ Baris 1-50 (imports & setup)
   └─ Baris 8-16 (Flask config)
   └─ Baris 19-28 (login_required)
   └─ Baris 31-35 (cache prevention)
   └─ Baris 37-57 (network config & AI status)
   └─ Baris 95-145 (page routes)
   └─ Baris 150-190 (login logic)
   └─ Baris 194 (user management)
   └─ Baris 215-270 (video streaming)
   └─ Baris 270-305 (API endpoints)

✅ bubo_db.py
   └─ Lengkap (database setup & dummy data)

✅ schema.sql
   └─ Lengkap (database schema)

✅ requirements.txt
   └─ Lengkap (all dependencies)

✅ templates/login.html
   └─ Lengkap atau baris 1-100 (login UI)

✅ templates/dashboard.html
   └─ Baris 1-100 (dashboard structure)

✅ static/styles.css
   └─ Overview section

✅ static/dashboard.jsx
   └─ Overview atau key components

✅ static/sidebar.js
   └─ Overview

✅ deploy/bubo-dashboard.service
   └─ Lengkap (deployment config)

✅ best.pt, best2.pt
   └─ Model info & description

✅ best2_openvino_model/metadata.yaml
   └─ Model metadata
```

---

## 💡 **TIPS UNTUK MENYUSUN MANUAL BOOK**

1. **Urutan Logis**: Mulai dari instalasi → konfigurasi → usage → troubleshooting
2. **Code Snippets**: Gunakan syntax highlighting untuk setiap code
3. **Screenshots**: Tambahkan screenshot untuk setiap page/fitur
4. **Diagram**: Buat diagram untuk architecture & workflow
5. **Table of Contents**: Buat TOC yang clickable
6. **Index**: Buat index untuk referensi cepat
7. **Version**: Catat versi aplikasi & tanggal update

---

**Generated**: 2026-07-17
**Version**: 1.0
