BEGIN;

CREATE TABLE workers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    worker_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    job_role VARCHAR(100),

    armband_code VARCHAR(50) NOT NULL UNIQUE,
    esp32_mac_address MACADDR UNIQUE,
    firmware_version VARCHAR(50),

    device_status VARCHAR(20) NOT NULL DEFAULT 'offline'
        CHECK (
            device_status IN (
                'online',
                'offline',
                'maintenance',
                'inactive'
            )
        ),

    buzzer_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    last_seen_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cameras (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    camera_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    location_name VARCHAR(150),

    status VARCHAR(20) NOT NULL DEFAULT 'offline'
        CHECK (
            status IN (
                'online',
                'offline',
                'maintenance',
                'inactive'
            )
        ),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_seen_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wifi_access_points (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    ap_code VARCHAR(50) NOT NULL UNIQUE,
    ssid VARCHAR(100),
    bssid MACADDR NOT NULL UNIQUE,

    position_x REAL NOT NULL,
    position_y REAL NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE location_readings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    worker_id BIGINT NOT NULL
        REFERENCES workers(id)
        ON DELETE RESTRICT,

    position_x REAL NOT NULL,
    position_y REAL NOT NULL,

    estimated_error REAL
        CHECK (
            estimated_error IS NULL
            OR estimated_error >= 0
        ),

    algorithm VARCHAR(50) NOT NULL DEFAULT 'knn',
    model_version VARCHAR(50),

    measured_at TIMESTAMPTZ NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_location_worker_time
ON location_readings (
    worker_id,
    measured_at DESC
);

CREATE TABLE wifi_scan_readings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    location_reading_id BIGINT NOT NULL
        REFERENCES location_readings(id)
        ON DELETE CASCADE,

    access_point_id BIGINT NOT NULL
        REFERENCES wifi_access_points(id)
        ON DELETE RESTRICT,

    rssi SMALLINT NOT NULL
        CHECK (rssi BETWEEN -120 AND 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (
        location_reading_id,
        access_point_id
    )
);

CREATE INDEX idx_wifi_scan_location
ON wifi_scan_readings (location_reading_id);

CREATE INDEX idx_wifi_scan_ap_time
ON wifi_scan_readings (
    access_point_id,
    created_at DESC
);

CREATE TABLE heart_rate_readings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    worker_id BIGINT NOT NULL
        REFERENCES workers(id)
        ON DELETE RESTRICT,

    bpm SMALLINT
        CHECK (
            bpm IS NULL
            OR (
                bpm > 0
                AND bpm <= 250
            )
        ),

    signal_quality REAL
        CHECK (
            signal_quality IS NULL
            OR (
                signal_quality >= 0
                AND signal_quality <= 1
            )
        ),

    measurement_status VARCHAR(20) NOT NULL DEFAULT 'valid'
        CHECK (
            measurement_status IN (
                'valid',
                'poor_signal',
                'not_worn',
                'invalid'
            )
        ),

    measured_at TIMESTAMPTZ NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_heart_rate_worker_time
ON heart_rate_readings (
    worker_id,
    measured_at DESC
);

CREATE TABLE ppe_detection_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,

    camera_id BIGINT NOT NULL
        REFERENCES cameras(id)
        ON DELETE RESTRICT,

    worker_id BIGINT
        REFERENCES workers(id)
        ON DELETE SET NULL,

    track_id VARCHAR(100),

    helmet_status VARCHAR(20) NOT NULL DEFAULT 'unknown'
        CHECK (
            helmet_status IN (
                'worn',
                'not_worn',
                'unknown'
            )
        ),

    vest_status VARCHAR(20) NOT NULL DEFAULT 'unknown'
        CHECK (
            vest_status IN (
                'worn',
                'not_worn',
                'unknown'
            )
        ),

    shoes_status VARCHAR(20) NOT NULL DEFAULT 'unknown'
        CHECK (
            shoes_status IN (
                'worn',
                'not_worn',
                'unknown'
            )
        ),

    is_compliant BOOLEAN NOT NULL,

    detection_confidence REAL
        CHECK (
            detection_confidence IS NULL
            OR (
                detection_confidence >= 0
                AND detection_confidence <= 1
            )
        ),

    identity_status VARCHAR(30) NOT NULL DEFAULT 'unmatched'
        CHECK (
            identity_status IN (
                'unmatched',
                'matched_by_location',
                'ambiguous',
                'manually_confirmed'
            )
        ),

    identity_confidence REAL
        CHECK (
            identity_confidence IS NULL
            OR (
                identity_confidence >= 0
                AND identity_confidence <= 1
            )
        ),

    floor_x REAL,
    floor_y REAL,

    bounding_boxes JSONB,
    image_path TEXT,

    buzzer_triggered BOOLEAN NOT NULL DEFAULT FALSE,

    detected_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ppe_camera_time
ON ppe_detection_events (
    camera_id,
    detected_at DESC
);

CREATE INDEX idx_ppe_worker_time
ON ppe_detection_events (
    worker_id,
    detected_at DESC
);

CREATE INDEX idx_ppe_violation_time
ON ppe_detection_events (detected_at DESC)
WHERE is_compliant = FALSE;

CREATE TABLE fall_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,

    worker_id BIGINT
        REFERENCES workers(id)
        ON DELETE SET NULL,

    camera_id BIGINT
        REFERENCES cameras(id)
        ON DELETE SET NULL,

    mpu_detected BOOLEAN NOT NULL DEFAULT FALSE,
    mpu_detected_at TIMESTAMPTZ,

    accel_x REAL,
    accel_y REAL,
    accel_z REAL,
    peak_acceleration REAL,

    camera_detected BOOLEAN NOT NULL DEFAULT FALSE,
    camera_detected_at TIMESTAMPTZ,

    camera_confidence REAL
        CHECK (
            camera_confidence IS NULL
            OR (
                camera_confidence >= 0
                AND camera_confidence <= 1
            )
        ),

    camera_track_id VARCHAR(100),
    evidence_image_path TEXT,

    validation_status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (
            validation_status IN (
                'pending',
                'armband_only',
                'camera_only',
                'confirmed',
                'rejected'
            )
        ),

    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
        mpu_detected = TRUE
        OR camera_detected = TRUE
    )
);

CREATE INDEX idx_fall_worker_time
ON fall_events (
    worker_id,
    occurred_at DESC
);

CREATE INDEX idx_fall_status_time
ON fall_events (
    validation_status,
    occurred_at DESC
);

CREATE TABLE alerts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    alert_type VARCHAR(30) NOT NULL
        CHECK (
            alert_type IN (
                'ppe_violation',
                'abnormal_bpm',
                'fall_suspected',
                'fall_confirmed',
                'device_offline'
            )
        ),

    severity VARCHAR(20) NOT NULL
        CHECK (
            severity IN (
                'info',
                'warning',
                'critical'
            )
        ),

    worker_id BIGINT
        REFERENCES workers(id)
        ON DELETE SET NULL,

    ppe_event_id BIGINT
        REFERENCES ppe_detection_events(id)
        ON DELETE SET NULL,

    fall_event_id BIGINT
        REFERENCES fall_events(id)
        ON DELETE SET NULL,

    title VARCHAR(150) NOT NULL,
    message TEXT,

    buzzer_requested BOOLEAN NOT NULL DEFAULT FALSE,

    buzzer_status VARCHAR(20) NOT NULL DEFAULT 'not_required'
        CHECK (
            buzzer_status IN (
                'not_required',
                'pending',
                'sent',
                'acknowledged',
                'failed'
            )
        ),

    buzzer_sent_at TIMESTAMPTZ,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,

    CHECK (
        expires_at IS NULL
        OR expires_at >= created_at
    )
);

CREATE INDEX idx_alert_active_time
ON alerts (
    is_active,
    created_at DESC
);

CREATE INDEX idx_alert_worker_time
ON alerts (
    worker_id,
    created_at DESC
);

COMMIT;
