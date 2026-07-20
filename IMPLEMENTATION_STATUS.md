# MQTT ESP32 Implementation Status

Date: 2026-07-20

## Completed

- MQTT subscriber is integrated with Flask through `app_mqtt.py`.
- PostgreSQL configuration is in `.env`; the schema source is `schema.sql`.
- Authenticated APIs: `/api/mqtt/status`, `/api/workers/realtime`, `/api/worker/<worker_code>/send-command`, `/api/worker/<worker_code>/location/history`, and `/api/dashboard/live-stats`.
- Commands use `bubo/worker/<worker_code>/command`, matching the ESP32 firmware.
- MQTT handlers use PostgreSQL workers and location tables without referencing a PostgreSQL `logs` table.

## Remaining verification

- PostgreSQL credentials and required schema tables were verified against `bubostrap_db`.
- Start Mosquitto and publish an ESP32 status/location payload to complete the end-to-end test.
