const { useEffect, useMemo, useRef, useState } = React;
const {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip: ChartTooltip,
  XAxis,
  YAxis,
} = window.Recharts || {};

const STATUS_META = {
  Safe: {
    tone: "safe",
    label: "Safe",
    text: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    color: "#16a34a",
  },
  Warning: {
    tone: "warning",
    label: "Warning",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    color: "#f59e0b",
  },
  Emergency: {
    tone: "emergency",
    label: "Emergency",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    color: "#dc2626",
  },
  Offline: {
    tone: "offline",
    label: "Offline",
    text: "text-neutral-700",
    bg: "bg-neutral-100",
    border: "border-neutral-300",
    color: "#737373",
  },
};

const SEVERITY_META = {
  Info: "bg-neutral-100 text-neutral-700 border-neutral-200",
  Low: "bg-green-50 text-green-700 border-green-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-orange-50 text-orange-700 border-orange-200",
  Critical: "bg-red-50 text-red-700 border-red-200",
};

const MENU_ITEMS = [
  { id: "home", label: "Beranda", icon: "layout-dashboard" },
  { id: "cctv", label: "CCTV Monitoring", icon: "cctv" },
  { id: "worker", label: "Worker Detail", icon: "user-round" },
  { id: "location", label: "RSSI Location", icon: "map-pinned" },
  { id: "logs", label: "Logs & System", icon: "file-clock" },
];

const SCENARIOS = {
  safe: { key: "safe", label: "Nominal telemetry", classLabel: "working" },
  ppe: { key: "ppe", label: "PPE Warning", classLabel: "working" },
  idle: { key: "idle", label: "Idle Warning", classLabel: "idle" },
  medical: { key: "medical", label: "Medical Warning", classLabel: "working" },
  fall: { key: "fall", label: "Fall Emergency", classLabel: "fallen" },
  offline: { key: "offline", label: "Device Offline", classLabel: "idle" },
};

const SCENARIO_SEQUENCE = [
  "safe",
  "safe",
  "ppe",
  "safe",
  "idle",
  "safe",
  "medical",
  "safe",
  "fall",
  "safe",
  "offline",
];

const WORKER = {
  id: "P-001",
  name: "Worker Prototype",
  role: "Pekerja Uji",
  department: "K3 Prototype Test",
  device_id: "BUBO-001",
  zone: "Simulasi Area A",
};

const ACCESS_POINTS = [
  { id: "AP-01", name: "AP-01", x: 14, y: 18 },
  { id: "AP-02", name: "AP-02", x: 84, y: 24 },
  { id: "AP-03", name: "AP-03", x: 52, y: 82 },
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatClock(value) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(value);
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

function isoMinutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

function secondsSince(isoValue, now) {
  return Math.floor((now.getTime() - new Date(isoValue).getTime()) / 1000);
}

function getScenario(tick) {
  const segment = Math.floor(tick / 10) % SCENARIO_SEQUENCE.length;
  return SCENARIOS[SCENARIO_SEQUENCE[segment]];
}

function deriveSafetyState({ health, imu, ppe, cctv, device, camera, now }) {
  const payloadAge = secondsSince(device.last_payload, now);
  const deviceOffline = device.online_status !== "Online" || payloadAge > 30;
  const cameraOffline = camera.status !== "Online";

  if (deviceOffline || cameraOffline) {
    return {
      status: "Offline",
      reason: deviceOffline ? "BUBO-001 payload stale" : "CAM-01 offline",
      risk: "Offline",
    };
  }

  if (imu.fall_detected || cctv.class_label === "fallen") {
    return {
      status: "Emergency",
      reason: "Fall Emergency",
      risk: "Emergency",
    };
  }

  if (health.heart_rate < 50 || health.heart_rate > 120 || health.spo2 < 92) {
    return {
      status: "Warning",
      reason: "Medical Warning",
      risk: "Warning",
    };
  }

  if (!ppe.helmet || !ppe.vest || !ppe.boots || ppe.no_apd) {
    return {
      status: "Warning",
      reason: "PPE Warning",
      risk: "Warning",
    };
  }

  if (
    cctv.class_label === "idle" &&
    health.heart_rate >= 60 &&
    health.heart_rate <= 100 &&
    health.spo2 >= 95 &&
    imu.accel_magnitude < 0.35
  ) {
    return {
      status: "Warning",
      reason: "Idle Warning",
      risk: "Warning",
    };
  }

  return {
    status: "Safe",
    reason: "APD lengkap, vitals normal",
    risk: "Normal",
  };
}

function buildSnapshot(tick) {
  const now = new Date();
  const scenario = getScenario(tick);
  const wave = Math.sin(tick / 2);
  const slowWave = Math.cos(tick / 4);
  const offline = scenario.key === "offline";
  const ppeWarning = scenario.key === "ppe";
  const idle = scenario.key === "idle";
  const medical = scenario.key === "medical";
  const fall = scenario.key === "fall";

  const device = {
    device_id: "BUBO-001",
    worker_id: "P-001",
    battery: clamp(87 - Math.floor(tick / 18), 72, 87),
    online_status: offline ? "Offline" : "Online",
    last_payload: new Date(now.getTime() - (offline ? 46000 : 900)).toISOString(),
  };

  const camera = {
    camera_id: "CAM-01",
    name: "Prototype CCTV 01",
    status: offline ? "Offline" : "Online",
    fps: offline ? 0 : 24 + Math.round(wave),
    inference_latency: offline ? 0 : 86 + Math.round(Math.abs(slowWave) * 12),
    rtsp_status: offline ? "Inactive" : "Active",
  };

  const health = {
    worker_id: "P-001",
    heart_rate: medical ? 126 : fall ? 112 : 78 + Math.round(wave * 4),
    spo2: medical ? 91 : fall ? 94 : 97 + (slowWave > 0.55 ? 1 : 0),
    timestamp: now.toISOString(),
    health_status: medical ? "Medical Warning" : "Normal",
  };

  const imu = {
    worker_id: "P-001",
    accel_magnitude: fall ? 2.74 : idle ? 0.18 : Number((0.98 + wave * 0.04).toFixed(2)),
    pitch: fall ? 63 : 8 + Math.round(wave * 2),
    roll: fall ? 21 : 5 + Math.round(slowWave * 2),
    posture_angle: fall ? 74 : 10 + Math.round(Math.abs(wave) * 3),
    fall_detected: fall,
  };

  const ppe = {
    worker_id: "P-001",
    helmet: true,
    vest: !ppeWarning,
    boots: true,
    no_apd: ppeWarning,
    ppe_score: ppeWarning ? 67 : 100,
  };

  const cctv = {
    camera_id: "CAM-01",
    worker_detected: !offline,
    class_label: scenario.classLabel,
    confidence: offline ? 0 : Number((fall ? 0.94 : idle ? 0.88 : 0.91 + wave * 0.02).toFixed(2)),
    bounding_box: { x: 0.38, y: 0.26, width: 0.24, height: 0.52 },
    frame_time: now.toISOString(),
  };

  const location = {
    worker_id: "P-001",
    x: Number((fall ? 6.4 : 5.2 + wave * 0.35).toFixed(1)),
    y: Number((fall ? 4.2 : 3.8 + slowWave * 0.28).toFixed(1)),
    zone: "Simulasi Area A",
    rssi_ap1: -58 + Math.round(wave * 3),
    rssi_ap2: -71 + Math.round(slowWave * 4),
    rssi_ap3: -64 + Math.round(Math.sin(tick / 3) * 3),
    accuracy: offline ? "+/- 4.8 m" : idle ? "+/- 2.2 m" : "+/- 1.5 m",
    last_seen: new Date(now.getTime() - (offline ? 46000 : 1200)).toISOString(),
  };

  const safety = deriveSafetyState({ health, imu, ppe, cctv, device, camera, now });
  const apStatus = ACCESS_POINTS.map((ap, index) => ({
    ...ap,
    status: "Online",
    rssi_value: [location.rssi_ap1, location.rssi_ap2, location.rssi_ap3][index],
  }));

  return {
    scenarioKey: scenario.key,
    scenarioLabel: scenario.label,
    worker: { ...WORKER, status: safety.status },
    device,
    camera,
    accessPoints: apStatus,
    health,
    imu,
    ppe,
    cctv,
    location,
    safety,
    latency: offline ? 0 : 118 + Math.round(Math.abs(wave) * 24),
    packetLoss: offline ? 8.4 : Number((0.2 + Math.abs(slowWave) * 0.4).toFixed(1)),
    updated_at: now.toISOString(),
  };
}

function seedHistory() {
  return Array.from({ length: 18 }, (_, index) => {
    const minutesAgo = 17 - index;
    return {
      time: formatClock(new Date(Date.now() - minutesAgo * 45 * 1000)),
      bpm: 76 + Math.round(Math.sin(index / 2) * 4),
      spo2: 97 + (index % 5 === 0 ? 1 : 0),
    };
  });
}

function seedAlerts() {
  return [
    {
      id: "A-104",
      type: "RSSI Update",
      source: "AP-02",
      severity: "Info",
      timestamp: isoMinutesAgo(2),
      status: "Resolved",
    },
    {
      id: "A-103",
      type: "Vibration Triggered",
      source: "BUBO-001",
      severity: "Low",
      timestamp: isoMinutesAgo(7),
      status: "Acknowledged",
    },
    {
      id: "A-102",
      type: "Idle Warning",
      source: "CAM-01",
      severity: "Medium",
      timestamp: isoMinutesAgo(14),
      status: "Resolved",
    },
    {
      id: "A-101",
      type: "PPE Violation",
      source: "CAM-01",
      severity: "High",
      timestamp: isoMinutesAgo(22),
      status: "Resolved",
    },
  ];
}

function alertFromScenario(snapshot) {
  const common = {
    id: `A-${Date.now().toString().slice(-5)}`,
    timestamp: snapshot.updated_at,
    status: "New",
  };

  if (snapshot.scenarioKey === "ppe") {
    return {
      ...common,
      type: "PPE Violation",
      source: "CAM-01",
      severity: "High",
    };
  }

  if (snapshot.scenarioKey === "idle") {
    return {
      ...common,
      type: "Idle Warning",
      source: "CAM-01",
      severity: "Medium",
    };
  }

  if (snapshot.scenarioKey === "medical") {
    return {
      ...common,
      type: snapshot.health.spo2 < 92 ? "SpO2 Low" : "Heart Rate Abnormal",
      source: "BUBO-001",
      severity: "High",
    };
  }

  if (snapshot.scenarioKey === "fall") {
    return {
      ...common,
      type: "Fall Detected",
      source: "MPU6050/CAM-01",
      severity: "Critical",
    };
  }

  if (snapshot.scenarioKey === "offline") {
    return {
      ...common,
      type: "Device Offline",
      source: "BUBO-001",
      severity: "Critical",
    };
  }

  return null;
}

function Icon({ name, className = "h-4 w-4" }) {
  return <i data-lucide={name} className={className} aria-hidden="true" />;
}

function StatusDot({ status }) {
  const tone = STATUS_META[status]?.tone || "offline";
  return <span className={`status-dot ${tone}`} />;
}

function StatusBadge({ status, children }) {
  const meta = STATUS_META[status] || STATUS_META.Offline;
  return (
    <span className={cx("inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-black", meta.bg, meta.text, meta.border)}>
      <StatusDot status={status} />
      {children || meta.label}
    </span>
  );
}

function SimpleBadge({ children, tone = "neutral" }) {
  const palette = {
    neutral: "bg-neutral-100 text-neutral-700 border-neutral-200",
    safe: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    emergency: "bg-red-50 text-red-700 border-red-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
  };
  return (
    <span className={cx("inline-flex items-center rounded-md border px-2 py-1 text-xs font-black", palette[tone])}>
      {children}
    </span>
  );
}

function Panel({ children, className = "" }) {
  return <section className={cx("panel p-4", className)}>{children}</section>;
}

function SectionTitle({ eyebrow, title, right }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-black uppercase text-orange-600">{eyebrow}</p>}
        <h2 className="text-lg font-black text-neutral-950">{title}</h2>
      </div>
      {right}
    </div>
  );
}

function DataRow({ label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-neutral-200 py-2 last:border-0">
      <span className="text-sm text-neutral-500">{label}</span>
      <strong className={cx("text-right text-sm font-black text-neutral-950", valueClass)}>{value}</strong>
    </div>
  );
}

function ActionButton({ icon, children, variant = "primary", onClick }) {
  const styles =
    variant === "primary"
      ? "border-orange-600 bg-orange-600 text-white hover:bg-orange-700"
      : "border-neutral-300 bg-white text-neutral-900 hover:border-orange-400 hover:text-orange-700";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx("inline-flex min-h-10 items-center justify-center gap-2 border px-3 text-sm font-black transition", styles)}
    >
      <Icon name={icon} />
      <span>{children}</span>
    </button>
  );
}

function Sidebar({ activePage, onNavigate, snapshot }) {
  return (
    <aside className="sidebar">
      <div className="brand-mark mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-orange-600 text-base font-black text-white">
          BS
        </div>
        <div className="brand-copy">
          <p className="mb-1 text-sm font-black">BUBO STRAP</p>
          <p className="text-xs text-neutral-400">MVP Dashboard</p>
        </div>
      </div>

      <nav className="space-y-2">
        {MENU_ITEMS.map((item) => {
          const active = item.id === activePage;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cx(
                "flex min-h-11 w-full items-center gap-3 rounded-md border px-3 text-left text-sm font-black transition",
                active
                  ? "border-orange-500 bg-orange-600 text-white"
                  : "border-transparent text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900 hover:text-white"
              )}
            >
              <Icon name={item.icon} />
              <span className="nav-text">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="prototype-copy mt-auto rounded-md border border-neutral-800 bg-neutral-950 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-black text-neutral-400">Prototype</span>
          <StatusDot status={snapshot.safety.status} />
        </div>
        <p className="mb-1 text-sm font-black">{snapshot.worker.id}</p>
        <p className="text-xs text-neutral-400">{snapshot.worker.zone}</p>
      </div>
    </aside>
  );
}

function Header({ snapshot, clock }) {
  return (
    <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="mb-1 text-sm font-black uppercase text-orange-600">Single Worker AIoT Safety Monitoring Prototype</p>
        <h1 className="text-2xl font-black text-neutral-950 md:text-3xl">BUBO STRAP MVP Dashboard</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={snapshot.safety.status}>{snapshot.safety.reason}</StatusBadge>
        <span className="inline-flex min-h-10 items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 text-sm font-black text-orange-700">
          <Icon name="flask-conical" />
          Prototype Testing Mode
        </span>
        <span className="inline-flex min-h-10 items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 text-sm font-black text-neutral-800">
          <Icon name="clock-3" />
          {formatClock(clock)}
        </span>
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center border border-neutral-300 bg-white text-neutral-900"
          aria-label="Notifications"
        >
          <Icon name="bell" />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange-600" />
        </button>
      </div>
    </header>
  );
}

function KpiCard({ label, value, detail, icon, status }) {
  return (
    <Panel className="min-h-[126px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mb-2 text-xs font-black uppercase text-neutral-500">{label}</p>
          <strong className="block text-2xl font-black text-neutral-950">{value}</strong>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100 text-neutral-700">
          <Icon name={icon} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
        {status && <StatusDot status={status} />}
        <span>{detail}</span>
      </div>
    </Panel>
  );
}

function ProfileCard({ snapshot }) {
  return (
    <Panel>
      <SectionTitle eyebrow="Worker profile" title="Pekerja uji tunggal" />
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-md bg-neutral-950 text-lg font-black text-white">
          WP
        </div>
        <div className="min-w-0">
          <p className="font-black text-neutral-950">{snapshot.worker.name}</p>
          <p className="text-sm text-neutral-500">{snapshot.worker.role}</p>
          <div className="mt-2">
            <StatusBadge status={snapshot.safety.status} />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <DataRow label="Worker ID" value={snapshot.worker.id} />
        <DataRow label="Name" value={snapshot.worker.name} />
        <DataRow label="Device ID" value={snapshot.worker.device_id} />
        <DataRow label="Zone" value={snapshot.worker.zone} />
      </div>
    </Panel>
  );
}

function MiniMetric({ label, value, detail, status, icon }) {
  return (
    <div className="soft-panel p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase text-neutral-500">{label}</span>
        <Icon name={icon} className="h-4 w-4 text-neutral-500" />
      </div>
      <div className="flex items-end justify-between gap-3">
        <strong className="text-xl font-black text-neutral-950">{value}</strong>
        {status && <StatusDot status={status} />}
      </div>
      <p className="mt-1 text-xs text-neutral-500">{detail}</p>
    </div>
  );
}

function PpeGrid({ ppe }) {
  const items = [
    { label: "Helmet", value: ppe.helmet, icon: "hard-hat" },
    { label: "Vest/Rompi", value: ppe.vest, icon: "shield-check" },
    { label: "Boots/Sepatu", value: ppe.boots, icon: "footprints" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className={cx("soft-panel p-3", item.value ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50")}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-sm font-black">{item.label}</span>
            <Icon name={item.icon} className={cx("h-4 w-4", item.value ? "text-green-700" : "text-amber-700")} />
          </div>
          <SimpleBadge tone={item.value ? "safe" : "warning"}>{item.value ? "Detected" : "Not detected"}</SimpleBadge>
        </div>
      ))}
    </div>
  );
}

function SimulatedFrame({ snapshot, streamStatus, compact = false }) {
  const status = snapshot.safety.status;
  const tone = STATUS_META[status].tone;
  const activeActivity = snapshot.cctv.class_label;
  const streamState = streamStatus?.status || "starting";
  const streamFps = streamStatus?.fps || snapshot.camera.fps;
  const rtspUrl = streamStatus?.rtsp_url || "rtsp://Bubo_Strap:PKMKC2026@10.42.0.209/stream1";
  const modelLabel = streamStatus?.inference_enabled ? streamStatus?.model_path || "best2.pt" : "YOLO disabled";
  const boxes = [
    { label: "Worker", className: "box-worker", active: snapshot.cctv.worker_detected, tone },
    { label: "Helmet", className: "box-helmet", active: snapshot.ppe.helmet, tone: "safe" },
    { label: "Vest", className: "box-vest", active: snapshot.ppe.vest, tone: snapshot.ppe.vest ? "safe" : "warning" },
    { label: "Boots", className: "box-boots", active: snapshot.ppe.boots, tone: "safe" },
    { label: "No-APD", className: "box-no-apd", active: snapshot.ppe.no_apd, tone: "warning" },
    { label: "Working", className: "box-working", active: activeActivity === "working", tone: "safe" },
    { label: "Idle", className: "box-idle", active: activeActivity === "idle", tone: "warning" },
    { label: "Fallen", className: "box-fallen", active: activeActivity === "fallen", tone: "emergency" },
  ];

  return (
    <div className={cx("video-frame", compact && "compact")}>
      <img className="rtsp-feed" src="/video_feed" alt="CAM-01 RTSP live stream" />
      <div className="rtsp-empty-state">
        <Icon name="cctv" className="h-8 w-8" />
        <strong>Waiting for CAM-01 RTSP stream</strong>
        <span>{rtspUrl}</span>
      </div>
      <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-black/80 px-2 py-1 text-xs font-black text-white">CAM-01</span>
        <span className="rounded-md bg-black/70 px-2 py-1 text-xs font-black text-orange-300">
          {streamState} - {streamFps} FPS
        </span>
        <span className="rounded-md bg-black/70 px-2 py-1 text-xs font-black text-green-300">
          YOLO: {modelLabel}
        </span>
      </div>
      <div className="absolute bottom-8 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-xs font-black text-white">
        <span className="rounded-md bg-black/75 px-2 py-1">RTSP: {rtspUrl}</span>
        <span className="rounded-md bg-black/75 px-2 py-1">
          {streamStatus?.last_error ? streamStatus.last_error : `Last frame: ${streamStatus?.seconds_since_frame ?? "waiting"}s`}
        </span>
      </div>
      {boxes.map((box) => (
        <div
          key={box.label}
          className={cx(
            "bbox",
            box.className,
            box.active ? box.tone : "inactive",
            snapshot.camera.status !== "Online" && "offline"
          )}
        >
          <span>{box.label}</span>
        </div>
      ))}
    </div>
  );
}

function RecentAlerts({ alerts, limit = 5 }) {
  return (
    <div className="space-y-3">
      {alerts.slice(0, limit).map((alert) => (
        <div key={alert.id} className="flex items-start justify-between gap-3 rounded-md border border-neutral-200 bg-white p-3">
          <div>
            <p className="font-black text-neutral-950">{alert.type}</p>
            <p className="text-sm text-neutral-500">
              {alert.source} - {formatDateTime(alert.timestamp)}
            </p>
          </div>
          <span className={cx("rounded-md border px-2 py-1 text-xs font-black", SEVERITY_META[alert.severity])}>
            {alert.severity}
          </span>
        </div>
      ))}
    </div>
  );
}

function HomePage({ snapshot, alerts, streamStatus, onNavigate }) {
  const kpis = [
    { label: "Active Worker", value: "1", detail: "P-001 monitored", icon: "user-check", status: snapshot.safety.status },
    { label: "Strap Online", value: snapshot.device.online_status === "Online" ? "1/1" : "0/1", detail: snapshot.device.device_id, icon: "watch", status: snapshot.device.online_status === "Online" ? "Safe" : "Offline" },
    { label: "CCTV Online", value: snapshot.camera.status === "Online" ? "1/1" : "0/1", detail: snapshot.camera.camera_id, icon: "cctv", status: snapshot.camera.status === "Online" ? "Safe" : "Offline" },
    { label: "Access Point Online", value: "3/3", detail: "AP-01, AP-02, AP-03", icon: "wifi", status: "Safe" },
    { label: "Current Safety Status", value: snapshot.safety.status, detail: snapshot.safety.reason, icon: "shield-alert", status: snapshot.safety.status },
    { label: "Last Data Update", value: formatClock(new Date(snapshot.updated_at)), detail: "Mock WebSocket tick", icon: "refresh-cw", status: snapshot.safety.status },
    { label: "System Latency", value: snapshot.latency ? `${snapshot.latency} ms` : "Offline", detail: "End-to-end estimate", icon: "activity", status: snapshot.latency ? "Safe" : "Offline" },
    { label: "Battery Level", value: `${snapshot.device.battery}%`, detail: "BUBO-001", icon: "battery-medium", status: snapshot.device.battery > 30 ? "Safe" : "Warning" },
  ];

  return (
    <div className="content-grid">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[330px_minmax(0,1fr)_360px]">
        <ProfileCard snapshot={snapshot} />

        <Panel>
          <SectionTitle eyebrow="Near-time telemetry" title="Ringkasan tanda vital" />
          <div className="grid gap-3 md:grid-cols-3">
            <MiniMetric label="BPM" value={snapshot.health.heart_rate} detail={snapshot.health.health_status} status={snapshot.safety.status} icon="heart-pulse" />
            <MiniMetric label="SpO2" value={`${snapshot.health.spo2}%`} detail="MAX30105 reading" status={snapshot.health.spo2 >= 95 ? "Safe" : "Warning"} icon="droplets" />
            <MiniMetric label="Fall Detection" value={snapshot.imu.fall_detected ? "Detected" : "Clear"} detail="MPU6050 fusion" status={snapshot.imu.fall_detected ? "Emergency" : "Safe"} icon="person-standing" />
          </div>

          <div className="mt-5">
            <h3 className="mb-3 text-sm font-black uppercase text-neutral-500">Ringkasan APD</h3>
            <PpeGrid ppe={snapshot.ppe} />
          </div>
        </Panel>

        <Panel>
          <SectionTitle eyebrow="RSSI fingerprinting" title="Ringkasan lokasi" right={<SimpleBadge tone="orange">{snapshot.location.accuracy}</SimpleBadge>} />
          <DataRow label="Estimated X-Y coordinate" value={`X ${snapshot.location.x}, Y ${snapshot.location.y}`} />
          <DataRow label="RSSI accuracy estimate" value={snapshot.location.accuracy} />
          <DataRow label="Last location update" value={formatClock(new Date(snapshot.location.last_seen))} />
          <DataRow label="Zone" value={snapshot.location.zone} />
          <button
            type="button"
            onClick={() => onNavigate("location")}
            className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 border border-neutral-300 bg-white px-3 text-sm font-black hover:border-orange-400 hover:text-orange-700"
          >
            <Icon name="map-pinned" />
            View Worker Location
          </button>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Panel>
          <SectionTitle eyebrow="CCTV preview" title="CAM-01 RTSP live preview" right={<StatusBadge status={streamStatus?.status === "running" ? "Safe" : "Warning"}>{streamStatus?.status || "starting"}</StatusBadge>} />
          <SimulatedFrame snapshot={snapshot} streamStatus={streamStatus} compact />
        </Panel>

        <Panel>
          <SectionTitle eyebrow="Recent alert" title="3-5 kejadian terakhir" />
          <RecentAlerts alerts={alerts} limit={5} />
        </Panel>
      </div>
    </div>
  );
}

function DetectionStatusPanel({ snapshot, streamStatus }) {
  const workerDetected = snapshot.cctv.worker_detected ? "Yes" : "No";
  return (
    <Panel>
      <SectionTitle eyebrow="Computer vision" title="Hasil deteksi CAM-01" right={<StatusBadge status={streamStatus?.status === "running" ? "Safe" : "Warning"}>{streamStatus?.status || "starting"}</StatusBadge>} />
      <DataRow label="Camera ID" value={snapshot.camera.camera_id} />
      <DataRow label="Camera status" value={streamStatus?.status || snapshot.camera.status} />
      <DataRow label="RTSP source" value={streamStatus?.rtsp_url || "rtsp://Bubo_Strap:PKMKC2026@10.42.0.209/stream1"} />
      <DataRow label="YOLO model" value={streamStatus?.model_path || "best2.pt"} />
      <DataRow label="FPS" value={streamStatus?.fps || snapshot.camera.fps} />
      <DataRow label="Inference latency" value={streamStatus?.inference_enabled ? `${snapshot.camera.inference_latency} ms` : "Disabled"} />
      <DataRow label="Worker detected" value={workerDetected} />
      <DataRow label="Detection confidence" value={`${Math.round(snapshot.cctv.confidence * 100)}%`} />
      <div className="mt-4 rounded-md border border-neutral-200 bg-neutral-50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-black text-neutral-600">Risk level</span>
          <SimpleBadge tone={snapshot.safety.status === "Emergency" ? "emergency" : snapshot.safety.status === "Warning" ? "warning" : "safe"}>
            {snapshot.safety.risk}
          </SimpleBadge>
        </div>
        <p className="text-sm text-neutral-500">{snapshot.safety.reason}</p>
      </div>
    </Panel>
  );
}

function ComplianceList({ snapshot }) {
  const ppeItems = [
    ["Helmet", snapshot.ppe.helmet],
    ["Vest/Rompi", snapshot.ppe.vest],
    ["Boots/Sepatu", snapshot.ppe.boots],
  ];
  const activityItems = [
    ["Working", snapshot.cctv.class_label === "working"],
    ["Idle", snapshot.cctv.class_label === "idle"],
    ["Fallen", snapshot.cctv.class_label === "fallen"],
  ];

  return (
    <Panel>
      <SectionTitle eyebrow="Compliance" title="PPE dan aktivitas" />
      <div className="mb-5 space-y-2">
        {ppeItems.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between rounded-md border border-neutral-200 p-3">
            <span className="text-sm font-black">{label}</span>
            <SimpleBadge tone={value ? "safe" : "warning"}>{value ? "Detected" : "Not detected"}</SimpleBadge>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {activityItems.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between rounded-md border border-neutral-200 p-3">
            <span className="text-sm font-black">{label}</span>
            <SimpleBadge tone={value ? (label === "Fallen" ? "emergency" : label === "Idle" ? "warning" : "safe") : "neutral"}>
              {value ? "Active" : "Inactive"}
            </SimpleBadge>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function CctvPage({ snapshot, streamStatus, onAction, onNavigate }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Panel className="min-w-0">
        <SectionTitle
          eyebrow="CCTV Monitoring"
          title="Main CCTV panel - CAM-01"
          right={<SimpleBadge tone="orange">Prototype CCTV 01</SimpleBadge>}
        />
        <SimulatedFrame snapshot={snapshot} streamStatus={streamStatus} />
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton icon="smartphone-vibrate" onClick={() => onAction("Trigger Vibration")}>Trigger Vibration</ActionButton>
          <ActionButton icon="save" variant="secondary" onClick={() => onAction("Save Evidence")}>Save Evidence</ActionButton>
          <ActionButton icon="badge-check" variant="secondary" onClick={() => onAction("Acknowledge Alert")}>Acknowledge Alert</ActionButton>
          <ActionButton icon="map-pinned" variant="secondary" onClick={() => onNavigate("location")}>View Worker Location</ActionButton>
        </div>
      </Panel>

      <div className="content-grid">
        <DetectionStatusPanel snapshot={snapshot} streamStatus={streamStatus} />
        <ComplianceList snapshot={snapshot} />
      </div>
    </div>
  );
}

function Gauge({ label, value, min, max, unit, status }) {
  const ratio = clamp(((value - min) / (max - min)) * 100, 0, 100);
  const meta = STATUS_META[status] || STATUS_META.Safe;
  return (
    <div className="soft-panel flex flex-col items-center p-4 text-center">
      <div className="gauge-track" style={{ "--gauge-color": meta.color, "--gauge-value": `${ratio}%` }}>
        <div className="gauge-content">
          <strong className="text-2xl font-black text-neutral-950">{value}</strong>
          <span className="text-xs font-black text-neutral-500">{unit}</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-black text-neutral-950">{label}</p>
      <p className="text-xs text-neutral-500">{min}-{max} range</p>
    </div>
  );
}

function TrendChart({ history }) {
  if (!ResponsiveContainer || !LineChart) {
    return <div className="chart-fallback">Recharts library unavailable</div>;
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer>
        <LineChart data={history} margin={{ top: 12, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="#e5e5e5" strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis yAxisId="bpm" tick={{ fontSize: 11 }} domain={[45, 135]} />
          <YAxis yAxisId="spo2" orientation="right" tick={{ fontSize: 11 }} domain={[88, 100]} />
          <ChartTooltip />
          <Legend />
          <Line yAxisId="bpm" type="monotone" dataKey="bpm" name="BPM" stroke="#f97316" strokeWidth={3} dot={false} />
          <Line yAxisId="spo2" type="monotone" dataKey="spo2" name="SpO2" stroke="#171717" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function WorkerDetailPage({ snapshot, history, onAction, onNavigate }) {
  const bpmStatus = snapshot.health.heart_rate >= 60 && snapshot.health.heart_rate <= 100 ? "Safe" : "Warning";
  const spo2Status = snapshot.health.spo2 >= 95 ? "Safe" : snapshot.health.spo2 < 92 ? "Warning" : "Warning";

  return (
    <div className="content-grid">
      <div className="grid gap-4 xl:grid-cols-[330px_minmax(0,1fr)]">
        <Panel>
          <SectionTitle eyebrow="Worker Detail" title="P-001 only" right={<StatusBadge status={snapshot.safety.status} />} />
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-md bg-neutral-950 text-2xl font-black text-white">WP</div>
            <div>
              <p className="text-lg font-black text-neutral-950">{snapshot.worker.name}</p>
              <p className="text-sm text-neutral-500">{snapshot.worker.department}</p>
            </div>
          </div>
          <div className="mt-4">
            <DataRow label="Worker ID" value={snapshot.worker.id} />
            <DataRow label="Name" value={snapshot.worker.name} />
            <DataRow label="Role" value={snapshot.worker.role} />
            <DataRow label="Device ID" value={snapshot.worker.device_id} />
            <DataRow label="Zone" value={snapshot.worker.zone} />
            <DataRow label="Last seen" value={formatClock(new Date(snapshot.location.last_seen))} />
          </div>
        </Panel>

        <Panel>
          <SectionTitle eyebrow="Device and vitals" title="BUBO-001 telemetry" />
          <div className="grid gap-3 md:grid-cols-3">
            <MiniMetric label="Online/offline" value={snapshot.device.online_status} detail="ESP32-SuperMini" status={snapshot.device.online_status === "Online" ? "Safe" : "Offline"} icon="radio" />
            <MiniMetric label="Battery percentage" value={`${snapshot.device.battery}%`} detail="Wearable strap" status={snapshot.device.battery > 30 ? "Safe" : "Warning"} icon="battery-medium" />
            <MiniMetric label="Last telemetry" value={formatClock(new Date(snapshot.device.last_payload))} detail="Mock payload" status={snapshot.device.online_status === "Online" ? "Safe" : "Offline"} icon="send" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <MiniMetric label="Heart Rate/BPM" value={snapshot.health.heart_rate} detail="MAX30105" status={bpmStatus} icon="heart-pulse" />
            <MiniMetric label="SpO2" value={`${snapshot.health.spo2}%`} detail="MAX30105" status={spo2Status} icon="droplets" />
            <MiniMetric label="Health status" value={snapshot.health.health_status} detail={snapshot.safety.reason} status={snapshot.safety.status} icon="stethoscope" />
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Panel>
          <SectionTitle eyebrow="Health gauge" title="BPM dan SpO2" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <Gauge label="BPM" value={snapshot.health.heart_rate} min={40} max={140} unit="beats/min" status={bpmStatus} />
            <Gauge label="SpO2" value={snapshot.health.spo2} min={88} max={100} unit="percent" status={spo2Status} />
          </div>
        </Panel>

        <Panel>
          <SectionTitle eyebrow="History" title="Grafik histori BPM dan SpO2" />
          <TrendChart history={history} />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel>
          <SectionTitle eyebrow="MPU6050" title="IMU data" />
          <DataRow label="Acceleration magnitude" value={`${snapshot.imu.accel_magnitude} g`} />
          <DataRow label="Pitch" value={`${snapshot.imu.pitch} deg`} />
          <DataRow label="Roll" value={`${snapshot.imu.roll} deg`} />
          <DataRow label="Posture angle" value={`${snapshot.imu.posture_angle} deg`} />
          <DataRow label="Fall detection status" value={snapshot.imu.fall_detected ? "Detected" : "Clear"} valueClass={snapshot.imu.fall_detected ? "text-red-700" : "text-green-700"} />
        </Panel>

        <Panel>
          <SectionTitle eyebrow="APD" title="PPE status" />
          <PpeGrid ppe={snapshot.ppe} />
          <div className="mt-4">
            <DataRow label="PPE score" value={`${snapshot.ppe.ppe_score}%`} />
            <DataRow label="No-APD" value={snapshot.ppe.no_apd ? "True" : "False"} />
          </div>
        </Panel>

        <Panel>
          <SectionTitle eyebrow="Activity" title="Worker activity" />
          <div className="space-y-2">
            {["working", "idle", "fallen"].map((activity) => (
              <div key={activity} className="flex items-center justify-between rounded-md border border-neutral-200 p-3">
                <span className="text-sm font-black capitalize">{activity}</span>
                <SimpleBadge tone={snapshot.cctv.class_label === activity ? (activity === "fallen" ? "emergency" : activity === "idle" ? "warning" : "safe") : "neutral"}>
                  {snapshot.cctv.class_label === activity ? "Active" : "Inactive"}
                </SimpleBadge>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2">
            <ActionButton icon="smartphone-vibrate" onClick={() => onAction("Trigger Vibration")}>Trigger Vibration</ActionButton>
            <ActionButton icon="cctv" variant="secondary" onClick={() => onNavigate("cctv")}>View CCTV</ActionButton>
            <ActionButton icon="map-pinned" variant="secondary" onClick={() => onNavigate("location")}>View Location</ActionButton>
            <ActionButton icon="check-check" variant="secondary" onClick={() => onAction("Mark as Resolved")}>Mark as Resolved</ActionButton>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function TooltipRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-neutral-700 py-1.5 last:border-0">
      <span className="text-xs text-neutral-400">{label}</span>
      <strong className="text-right text-xs font-black text-white">{value}</strong>
    </div>
  );
}

function LocationMap({ snapshot }) {
  const xPercent = clamp((snapshot.location.x / 10) * 100, 4, 96);
  const yPercent = clamp(100 - (snapshot.location.y / 8) * 100, 6, 94);
  const status = snapshot.safety.status;
  const ppeStatus = snapshot.ppe.helmet && snapshot.ppe.vest && snapshot.ppe.boots ? "Complete" : "Incomplete";

  return (
    <div className="map-plane">
      <div className="zone-label left-5 top-5">Simulasi Area A</div>
      <div className="zone-label bottom-5 right-5">Material mock zone</div>
      <div className="absolute left-[8%] right-[8%] top-[50%] h-px bg-orange-300" />
      <div className="absolute bottom-[12%] left-[48%] top-[12%] w-px bg-neutral-300" />
      {snapshot.accessPoints.map((ap) => (
        <div key={ap.id} className="ap-marker" style={{ left: `${ap.x}%`, top: `${ap.y}%` }}>
          {ap.name}
        </div>
      ))}
      <div className={`worker-pin ${STATUS_META[status].tone}`} style={{ left: `${xPercent}%`, top: `${yPercent}%` }}>
        P1
        <div className="pin-tooltip">
          <p className="mb-2 font-black">Worker {snapshot.worker.id}</p>
          <TooltipRow label="Device ID" value={snapshot.worker.device_id} />
          <TooltipRow label="BPM" value={snapshot.health.heart_rate} />
          <TooltipRow label="SpO2" value={`${snapshot.health.spo2}%`} />
          <TooltipRow label="PPE status" value={ppeStatus} />
          <TooltipRow label="Zone" value={snapshot.location.zone} />
          <TooltipRow label="Last seen" value={formatClock(new Date(snapshot.location.last_seen))} />
        </div>
      </div>
    </div>
  );
}

function RssiPanel({ snapshot }) {
  const localizationStatus = snapshot.safety.status === "Offline" ? "Offline" : snapshot.location.accuracy.includes("2.2") ? "Unstable" : "Stable";
  const localizationTone = localizationStatus === "Stable" ? "safe" : localizationStatus === "Unstable" ? "warning" : "neutral";

  return (
    <Panel>
      <SectionTitle eyebrow="RSSI panel" title="AP signal" right={<SimpleBadge tone={localizationTone}>{localizationStatus}</SimpleBadge>} />
      <div className="space-y-3">
        {snapshot.accessPoints.map((ap) => {
          const strength = clamp((ap.rssi_value + 90) * 2, 8, 100);
          return (
            <div key={ap.id} className="rounded-md border border-neutral-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-black">{ap.name} RSSI</span>
                <span className="text-sm font-black text-neutral-600">{ap.rssi_value} dBm</span>
              </div>
              <div className="metric-bar">
                <span style={{ width: `${strength}%`, background: "#f97316" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <DataRow label="X coordinate" value={snapshot.location.x} />
        <DataRow label="Y coordinate" value={snapshot.location.y} />
        <DataRow label="Zone" value={snapshot.location.zone} />
        <DataRow label="Accuracy estimate" value={snapshot.location.accuracy} />
        <DataRow label="Last update" value={formatClock(new Date(snapshot.location.last_seen))} />
      </div>
    </Panel>
  );
}

function LocationPage({ snapshot }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Panel className="min-w-0">
        <SectionTitle
          eyebrow="RSSI Location"
          title="Denah 2D area simulasi"
          right={<StatusBadge status={snapshot.safety.status}>Worker P-001</StatusBadge>}
        />
        <LocationMap snapshot={snapshot} />
      </Panel>
      <div className="content-grid">
        <RssiPanel snapshot={snapshot} />
        <Panel>
          <SectionTitle eyebrow="Access point status" title="3 AP fixed" />
          {snapshot.accessPoints.map((ap) => (
            <DataRow key={ap.id} label={`${ap.name} online/offline`} value={ap.status} valueClass="text-green-700" />
          ))}
        </Panel>
      </div>
    </div>
  );
}

function exportAlertsCsv(alerts) {
  const columns = ["Time", "Alert type", "Source", "Severity", "Status"];
  const rows = alerts.map((alert) => [
    formatDateTime(alert.timestamp),
    alert.type,
    alert.source,
    alert.severity,
    alert.status,
  ]);
  const csv = [columns, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bubo-alert-log-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function AlertTable({ alerts }) {
  return (
    <div className="table-wrap">
      <table className="alert-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Alert type</th>
            <th>Source</th>
            <th>Severity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td>{formatDateTime(alert.timestamp)}</td>
              <td className="font-black">{alert.type}</td>
              <td>{alert.source}</td>
              <td>
                <span className={cx("rounded-md border px-2 py-1 text-xs font-black", SEVERITY_META[alert.severity])}>
                  {alert.severity}
                </span>
              </td>
              <td>{alert.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SystemCard({ label, value, detail, status, icon }) {
  return (
    <div className="soft-panel p-3">
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="text-sm font-black text-neutral-950">{label}</span>
        <Icon name={icon} className="h-4 w-4 text-neutral-500" />
      </div>
      <div className="flex items-center gap-2">
        <StatusDot status={status} />
        <strong className="text-sm font-black">{value}</strong>
      </div>
      <p className="mt-2 text-xs text-neutral-500">{detail}</p>
    </div>
  );
}

function LogsPage({ snapshot, alerts }) {
  const systemCards = [
    { label: "MQTT status", value: "Mock Connected", detail: "topic bubo/strap/001", status: "Safe", icon: "message-square-dot" },
    { label: "WebSocket status", value: "Mock Live", detail: "1.5 s simulated push", status: "Safe", icon: "radio-tower" },
    { label: "Backend/API status", value: "Flask Ready", detail: "ready for FastAPI/Node bridge", status: "Safe", icon: "server" },
    { label: "Database status", value: "Mock Mode", detail: "in-memory prototype log", status: "Warning", icon: "database" },
    { label: "Camera stream status", value: snapshot.camera.rtsp_status, detail: "CAM-01 RTSP bridge", status: snapshot.camera.status === "Online" ? "Safe" : "Offline", icon: "cctv" },
    { label: "Packet loss", value: `${snapshot.packetLoss}%`, detail: "telemetry estimate", status: snapshot.packetLoss < 2 ? "Safe" : "Warning", icon: "activity" },
    { label: "End-to-end latency", value: snapshot.latency ? `${snapshot.latency} ms` : "Offline", detail: "sensor to dashboard", status: snapshot.latency ? "Safe" : "Offline", icon: "timer" },
  ];

  return (
    <div className="content-grid">
      <Panel>
        <SectionTitle
          eyebrow="Logs & System"
          title="Alert log"
          right={<ActionButton icon="download" variant="secondary" onClick={() => exportAlertsCsv(alerts)}>Export CSV</ActionButton>}
        />
        <AlertTable alerts={alerts} />
      </Panel>

      <Panel>
        <SectionTitle eyebrow="System health" title="Prototype service status" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {systemCards.map((card) => (
            <SystemCard key={card.label} {...card} />
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel>
          <SectionTitle eyebrow="Device status" title="BUBO-001" />
          <DataRow label="Online/offline" value={snapshot.device.online_status} />
          <DataRow label="Battery" value={`${snapshot.device.battery}%`} />
          <DataRow label="Last payload" value={formatDateTime(snapshot.device.last_payload)} />
        </Panel>

        <Panel>
          <SectionTitle eyebrow="Camera status" title="CAM-01" />
          <DataRow label="Online/offline" value={snapshot.camera.status} />
          <DataRow label="FPS" value={snapshot.camera.fps} />
          <DataRow label="RTSP status" value={snapshot.camera.rtsp_status} />
        </Panel>

        <Panel>
          <SectionTitle eyebrow="Access point status" title="AP-01 to AP-03" />
          {snapshot.accessPoints.map((ap) => (
            <DataRow key={ap.id} label={`${ap.name} online/offline`} value={ap.status} />
          ))}
        </Panel>
      </div>
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-md border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm font-black text-white shadow-panel">
      {message}
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState("home");
  const [tick, setTick] = useState(0);
  const [clock, setClock] = useState(new Date());
  const [history, setHistory] = useState(seedHistory);
  const [alerts, setAlerts] = useState(seedAlerts);
  const [toast, setToast] = useState("");
  const [streamStatus, setStreamStatus] = useState(null);
  const lastScenarioRef = useRef("safe");
  const snapshot = useMemo(() => buildSnapshot(tick), [tick]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((current) => current + 1);
      setClock(new Date());
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadStreamStatus() {
      try {
        const response = await fetch("/api/status", { cache: "no-store" });
        const data = await response.json();
        if (alive) {
          setStreamStatus(data);
        }
      } catch (error) {
        if (alive) {
          setStreamStatus({
            status: "offline",
            fps: 0,
            last_error: "Dashboard cannot reach the Flask RTSP bridge.",
          });
        }
      }
    }

    loadStreamStatus();
    const timer = setInterval(loadStreamStatus, 1500);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setHistory((current) => [
      ...current.slice(-23),
      {
        time: formatClock(new Date(snapshot.updated_at)),
        bpm: snapshot.health.heart_rate,
        spo2: snapshot.health.spo2,
      },
    ]);

    if (snapshot.scenarioKey !== lastScenarioRef.current) {
      const nextAlert = alertFromScenario(snapshot);
      if (nextAlert) {
        setAlerts((current) => [nextAlert, ...current].slice(0, 12));
      }
      lastScenarioRef.current = snapshot.scenarioKey;
    }
  }, [snapshot.updated_at, snapshot.health.heart_rate, snapshot.health.spo2, snapshot.scenarioKey]);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons({
        attrs: {
          "stroke-width": 1.8,
        },
      });
    }
  });

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timeout);
  }, [toast]);

  function handleAction(label) {
    if (label === "Acknowledge Alert") {
      setAlerts((current) =>
        current.map((alert, index) => (index === 0 && alert.status === "New" ? { ...alert, status: "Acknowledged" } : alert))
      );
      setToast("Latest alert acknowledged");
      return;
    }

    if (label === "Mark as Resolved") {
      setAlerts((current) =>
        current.map((alert, index) => (index === 0 ? { ...alert, status: "Resolved" } : alert))
      );
      setToast("Latest alert marked as resolved");
      return;
    }

    if (label === "Trigger Vibration") {
      const event = {
        id: `A-${Date.now().toString().slice(-5)}`,
        type: "Vibration Triggered",
        source: "BUBO-001",
        severity: "Low",
        timestamp: new Date().toISOString(),
        status: "Acknowledged",
      };
      setAlerts((current) => [event, ...current].slice(0, 12));
    }

    setToast(`${label} queued for ${snapshot.worker.id}`);
  }

  const pages = {
    home: <HomePage snapshot={snapshot} alerts={alerts} streamStatus={streamStatus} onNavigate={setActivePage} />,
    cctv: <CctvPage snapshot={snapshot} streamStatus={streamStatus} onAction={handleAction} onNavigate={setActivePage} />,
    worker: <WorkerDetailPage snapshot={snapshot} history={history} onAction={handleAction} onNavigate={setActivePage} />,
    location: <LocationPage snapshot={snapshot} />,
    logs: <LogsPage snapshot={snapshot} alerts={alerts} />,
  };

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} snapshot={snapshot} />
      <main className="main-surface">
        <Header snapshot={snapshot} clock={clock} />
        {pages[activePage]}
      </main>
      <Toast message={toast} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
