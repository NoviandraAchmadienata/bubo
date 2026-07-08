(function () {
  const worker = {
    id: "P-001",
    name: "Worker Prototype",
    role: "Pekerja Uji",
    device: "BUBO-001",
    zone: "Simulasi Area A",
  };

  const pages = [
    ["home", "Beranda"],
    ["cctv", "CCTV Monitoring"],
    ["worker", "Worker Detail"],
    ["location", "RSSI Location"],
    ["logs", "Logs & System"],
  ];

  const state = {
    page: "home",
    status: null,
    now: new Date(),
  };

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function statusTone(status) {
    if (status === "running") return "safe";
    if (status === "error" || status === "offline") return "emergency";
    if (status === "stopped") return "offline";
    return "warning";
  }

  function fmtClock(value) {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(value);
  }

  function card(title, value, detail, tone) {
    return `
      <section class="fallback-card">
        <p>${title}</p>
        <strong>${value}</strong>
        <span><i class="status-dot ${tone || "safe"}"></i>${detail}</span>
      </section>
    `;
  }

  function row(label, value) {
    return `<div class="fallback-row"><span>${label}</span><strong>${value}</strong></div>`;
  }

  function cctvPanel(compact) {
    const status = state.status || {};
    const tone = statusTone(status.status);
    const source = status.rtsp_url || "rtsp://Bubo_Strap:PKMKC2026@10.42.0.209/stream1";
    return `
      <section class="fallback-panel ${compact ? "fallback-compact-panel" : ""}">
        <div class="fallback-section-head">
          <div>
            <p>CCTV Monitoring</p>
            <h2>CAM-01 RTSP Live Stream</h2>
          </div>
          <span class="fallback-badge ${tone}">${status.status || "starting"}</span>
        </div>
        <div class="fallback-video">
          <img src="/video_feed?v=${Date.now()}" alt="CAM-01 RTSP live stream">
          <div class="fallback-video-top">
            <span>CAM-01</span>
            <span>${status.fps || 0} FPS</span>
          </div>
          <div class="fallback-video-bottom">
            <span>${source}</span>
            <span>${status.last_error || `Last frame: ${status.seconds_since_frame ?? "waiting"}s`}</span>
          </div>
        </div>
      </section>
    `;
  }

  function homePage() {
    const s = state.status || {};
    const tone = statusTone(s.status);
    return `
      <div class="fallback-grid kpis">
        ${card("Active Worker", "1", "P-001 monitored", "safe")}
        ${card("Strap Online", s.status === "running" ? "1/1" : "0/1", worker.device, tone)}
        ${card("CCTV Online", s.status === "running" ? "1/1" : "0/1", "CAM-01 RTSP", tone)}
        ${card("Access Point Online", "3/3", "AP-01, AP-02, AP-03", "safe")}
        ${card("Current Safety Status", s.status === "running" ? "Safe" : "Warning", s.last_error || "RTSP bridge monitored", tone)}
        ${card("Last Data Update", fmtClock(state.now), "near-time refresh", tone)}
        ${card("System Latency", s.status === "running" ? "118 ms" : "Waiting", "end-to-end estimate", tone)}
        ${card("Battery Level", "87%", "BUBO-001", "safe")}
      </div>
      <div class="fallback-grid main">
        <section class="fallback-panel">
          <div class="fallback-section-head"><div><p>Worker profile</p><h2>Pekerja uji tunggal</h2></div></div>
          ${row("Worker ID", worker.id)}
          ${row("Name", worker.name)}
          ${row("Device ID", worker.device)}
          ${row("Zone", worker.zone)}
        </section>
        <section class="fallback-panel">
          <div class="fallback-section-head"><div><p>Vitals</p><h2>Ringkasan tanda vital</h2></div></div>
          ${row("BPM", "78")}
          ${row("SpO2", "97%")}
          ${row("Fall Detection", "Clear")}
          ${row("Helmet", "Detected")}
          ${row("Vest/Rompi", "Detected")}
          ${row("Boots/Sepatu", "Detected")}
        </section>
        <section class="fallback-panel">
          <div class="fallback-section-head"><div><p>RSSI</p><h2>Ringkasan lokasi</h2></div></div>
          ${row("Estimated X-Y", "X 5.2, Y 3.8")}
          ${row("Accuracy", "+/- 1.5 m")}
          ${row("Zone", worker.zone)}
          ${row("Last update", fmtClock(state.now))}
        </section>
      </div>
      ${cctvPanel(true)}
    `;
  }

  function cctvPage() {
    const s = state.status || {};
    return `
      <div class="fallback-grid cctv">
        ${cctvPanel(false)}
        <section class="fallback-panel">
          <div class="fallback-section-head"><div><p>Detection</p><h2>Hasil CAM-01</h2></div></div>
          ${row("Camera ID", "CAM-01")}
          ${row("Camera status", s.status || "starting")}
          ${row("RTSP source", s.rtsp_url || "rtsp://Bubo_Strap:PKMKC2026@10.42.0.209/stream1")}
          ${row("FPS", s.fps || 0)}
          ${row("Resolution", s.frame_width && s.frame_height ? `${s.frame_width} x ${s.frame_height}` : "Waiting")}
          ${row("Inference", s.inference_enabled ? "YOLO enabled" : "Disabled")}
          ${row("Worker detected", "Yes")}
          ${row("Risk level", s.status === "running" ? "Normal" : "Warning")}
          <div class="fallback-actions">
            <button>Trigger Vibration</button>
            <button>Save Evidence</button>
            <button>Acknowledge Alert</button>
          </div>
        </section>
      </div>
    `;
  }

  function workerPage() {
    return `
      <div class="fallback-grid main">
        <section class="fallback-panel">
          <div class="fallback-avatar">WP</div>
          ${row("Worker ID", worker.id)}
          ${row("Name", worker.name)}
          ${row("Role", worker.role)}
          ${row("Device ID", worker.device)}
          ${row("Zone", worker.zone)}
          ${row("Last seen", fmtClock(state.now))}
        </section>
        <section class="fallback-panel">
          <div class="fallback-section-head"><div><p>Health</p><h2>BUBO-001 Telemetry</h2></div></div>
          ${row("Online/offline", "Online")}
          ${row("Battery percentage", "87%")}
          ${row("Heart Rate/BPM", "78")}
          ${row("SpO2", "97%")}
          ${row("Health status", "Normal")}
          ${row("Acceleration magnitude", "0.98 g")}
          ${row("Pitch", "8 deg")}
          ${row("Roll", "5 deg")}
          ${row("Posture angle", "10 deg")}
        </section>
      </div>
    `;
  }

  function locationPage() {
    return `
      <div class="fallback-grid cctv">
        <section class="fallback-panel">
          <div class="fallback-section-head"><div><p>RSSI Location</p><h2>Denah 2D Area Simulasi</h2></div></div>
          <div class="fallback-map">
            <span class="fallback-ap ap1">AP-01</span>
            <span class="fallback-ap ap2">AP-02</span>
            <span class="fallback-ap ap3">AP-03</span>
            <span class="fallback-worker-pin">P1</span>
          </div>
        </section>
        <section class="fallback-panel">
          ${row("AP-01 RSSI", "-58 dBm")}
          ${row("AP-02 RSSI", "-71 dBm")}
          ${row("AP-03 RSSI", "-64 dBm")}
          ${row("X coordinate", "5.2")}
          ${row("Y coordinate", "3.8")}
          ${row("Zone", worker.zone)}
          ${row("Accuracy estimate", "+/- 1.5 m")}
          ${row("Localization status", "Stable")}
        </section>
      </div>
    `;
  }

  function logsPage() {
    const logs = [
      ["RSSI Update", "AP-02", "Info", "Resolved"],
      ["Vibration Triggered", "BUBO-001", "Low", "Acknowledged"],
      ["Idle Warning", "CAM-01", "Medium", "Resolved"],
      ["PPE Violation", "CAM-01", "High", "Resolved"],
    ];
    return `
      <section class="fallback-panel">
        <div class="fallback-section-head">
          <div><p>Logs & System</p><h2>Alert log</h2></div>
          <button class="fallback-export">Export CSV</button>
        </div>
        <div class="table-wrap">
          <table class="alert-table">
            <thead><tr><th>Time</th><th>Alert type</th><th>Source</th><th>Severity</th><th>Status</th></tr></thead>
            <tbody>
              ${logs.map((log) => `<tr><td>${fmtClock(state.now)}</td><td>${log[0]}</td><td>${log[1]}</td><td>${log[2]}</td><td>${log[3]}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </section>
      <div class="fallback-grid kpis">
        ${card("MQTT status", "Mock Connected", "topic bubo/strap/001", "safe")}
        ${card("WebSocket status", "Mock Live", "1.5 s simulated push", "safe")}
        ${card("Backend/API status", "Flask Ready", "RTSP bridge active", "safe")}
        ${card("Camera stream status", state.status?.status || "starting", "CAM-01", statusTone(state.status?.status))}
      </div>
    `;
  }

  function pageContent() {
    if (state.page === "cctv") return cctvPage();
    if (state.page === "worker") return workerPage();
    if (state.page === "location") return locationPage();
    if (state.page === "logs") return logsPage();
    return homePage();
  }

  function render() {
    const root = document.getElementById("root");
    root.innerHTML = `
      <div class="fallback-shell">
        <aside class="fallback-sidebar">
          <div class="fallback-brand"><strong>BS</strong><span>BUBO STRAP<br><small>MVP Dashboard</small></span></div>
          <nav>
            ${pages.map(([id, label]) => `<button data-page="${id}" class="${state.page === id ? "active" : ""}">${label}</button>`).join("")}
          </nav>
        </aside>
        <main class="fallback-main">
          <header class="fallback-header">
            <div>
              <p>Single Worker AIoT Safety Monitoring Prototype</p>
              <h1>BUBO STRAP MVP Dashboard</h1>
            </div>
            <div class="fallback-header-actions">
              <span class="fallback-badge ${statusTone(state.status?.status)}">${state.status?.status || "starting"}</span>
              <span>${fmtClock(state.now)}</span>
            </div>
          </header>
          ${pageContent()}
        </main>
      </div>
    `;

    root.querySelectorAll("[data-page]").forEach((button) => {
      button.addEventListener("click", () => {
        state.page = button.dataset.page;
        render();
      });
    });
  }

  async function refreshStatus() {
    state.now = new Date();
    try {
      const response = await fetch("/api/status", { cache: "no-store" });
      state.status = await response.json();
    } catch (error) {
      state.status = { status: "offline", fps: 0, last_error: "Cannot reach Flask API." };
    }
    if (document.querySelector(".fallback-shell")) render();
  }

  function shouldFallback() {
    return !document.querySelector(".app-shell");
  }

  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(async () => {
      if (!shouldFallback()) return;
      await refreshStatus();
      render();
      setInterval(refreshStatus, 1500);
    }, 900);
  });
})();
