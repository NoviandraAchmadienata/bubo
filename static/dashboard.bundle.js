function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _React = React,
  useEffect = _React.useEffect,
  useMemo = _React.useMemo,
  useRef = _React.useRef,
  useState = _React.useState;
var _ref = window.Recharts || {},
  CartesianGrid = _ref.CartesianGrid,
  Legend = _ref.Legend,
  Line = _ref.Line,
  LineChart = _ref.LineChart,
  ResponsiveContainer = _ref.ResponsiveContainer,
  ChartTooltip = _ref.Tooltip,
  XAxis = _ref.XAxis,
  YAxis = _ref.YAxis;
var STATUS_META = {
  Safe: {
    tone: "safe",
    label: "Safe",
    text: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    color: "#16a34a"
  },
  Warning: {
    tone: "warning",
    label: "Warning",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    color: "#f59e0b"
  },
  Emergency: {
    tone: "emergency",
    label: "Emergency",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    color: "#dc2626"
  },
  Offline: {
    tone: "offline",
    label: "Offline",
    text: "text-neutral-700",
    bg: "bg-neutral-100",
    border: "border-neutral-300",
    color: "#737373"
  }
};
var SEVERITY_META = {
  Info: "bg-neutral-100 text-neutral-700 border-neutral-200",
  Low: "bg-green-50 text-green-700 border-green-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-orange-50 text-orange-700 border-orange-200",
  Critical: "bg-red-50 text-red-700 border-red-200"
};
var MENU_ITEMS = [{
  id: "home",
  label: "Beranda",
  icon: "layout-dashboard"
}, {
  id: "cctv",
  label: "CCTV Monitoring",
  icon: "cctv"
}, {
  id: "worker",
  label: "Worker Detail",
  icon: "user-round"
}, {
  id: "location",
  label: "RSSI Location",
  icon: "map-pinned"
}, {
  id: "logs",
  label: "Logs & System",
  icon: "file-clock"
}];
var SCENARIOS = {
  safe: {
    key: "safe",
    label: "Nominal telemetry",
    classLabel: "working"
  },
  ppe: {
    key: "ppe",
    label: "PPE Warning",
    classLabel: "working"
  },
  idle: {
    key: "idle",
    label: "Idle Warning",
    classLabel: "idle"
  },
  medical: {
    key: "medical",
    label: "Medical Warning",
    classLabel: "working"
  },
  fall: {
    key: "fall",
    label: "Fall Emergency",
    classLabel: "fallen"
  },
  offline: {
    key: "offline",
    label: "Device Offline",
    classLabel: "idle"
  }
};
var SCENARIO_SEQUENCE = ["safe", "safe", "ppe", "safe", "idle", "safe", "medical", "safe", "fall", "safe", "offline"];
var WORKER = {
  id: "P-001",
  name: "Worker Prototype",
  role: "Pekerja Uji",
  department: "K3 Prototype Test",
  device_id: "BUBO-001",
  zone: "Simulasi Area A"
};
var ACCESS_POINTS = [{
  id: "AP-01",
  name: "AP-01",
  x: 14,
  y: 18
}, {
  id: "AP-02",
  name: "AP-02",
  x: 84,
  y: 24
}, {
  id: "AP-03",
  name: "AP-03",
  x: 52,
  y: 82
}];
function cx() {
  for (var _len = arguments.length, classes = new Array(_len), _key = 0; _key < _len; _key++) {
    classes[_key] = arguments[_key];
  }
  return classes.filter(Boolean).join(" ");
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function formatClock(value) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(value);
}
function formatDateTime(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(value));
}
function isoMinutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}
function secondsSince(isoValue, now) {
  return Math.floor((now.getTime() - new Date(isoValue).getTime()) / 1000);
}
function getScenario(tick) {
  var segment = Math.floor(tick / 10) % SCENARIO_SEQUENCE.length;
  return SCENARIOS[SCENARIO_SEQUENCE[segment]];
}
function deriveSafetyState(_ref2) {
  var health = _ref2.health,
    imu = _ref2.imu,
    ppe = _ref2.ppe,
    cctv = _ref2.cctv,
    device = _ref2.device,
    camera = _ref2.camera,
    now = _ref2.now;
  var payloadAge = secondsSince(device.last_payload, now);
  var deviceOffline = device.online_status !== "Online" || payloadAge > 30;
  var cameraOffline = camera.status !== "Online";
  if (deviceOffline || cameraOffline) {
    return {
      status: "Offline",
      reason: deviceOffline ? "BUBO-001 payload stale" : "CAM-01 offline",
      risk: "Offline"
    };
  }
  if (imu.fall_detected || cctv.class_label === "fallen") {
    return {
      status: "Emergency",
      reason: "Fall Emergency",
      risk: "Emergency"
    };
  }
  if (health.heart_rate < 50 || health.heart_rate > 120 || health.spo2 < 92) {
    return {
      status: "Warning",
      reason: "Medical Warning",
      risk: "Warning"
    };
  }
  if (!ppe.helmet || !ppe.vest || !ppe.boots || ppe.no_apd) {
    return {
      status: "Warning",
      reason: "PPE Warning",
      risk: "Warning"
    };
  }
  if (cctv.class_label === "idle" && health.heart_rate >= 60 && health.heart_rate <= 100 && health.spo2 >= 95 && imu.accel_magnitude < 0.35) {
    return {
      status: "Warning",
      reason: "Idle Warning",
      risk: "Warning"
    };
  }
  return {
    status: "Safe",
    reason: "APD lengkap, vitals normal",
    risk: "Normal"
  };
}
function buildSnapshot(tick) {
  var now = new Date();
  var scenario = getScenario(tick);
  var wave = Math.sin(tick / 2);
  var slowWave = Math.cos(tick / 4);
  var offline = scenario.key === "offline";
  var ppeWarning = scenario.key === "ppe";
  var idle = scenario.key === "idle";
  var medical = scenario.key === "medical";
  var fall = scenario.key === "fall";
  var device = {
    device_id: "BUBO-001",
    worker_id: "P-001",
    battery: clamp(87 - Math.floor(tick / 18), 72, 87),
    online_status: offline ? "Offline" : "Online",
    last_payload: new Date(now.getTime() - (offline ? 46000 : 900)).toISOString()
  };
  var camera = {
    camera_id: "CAM-01",
    name: "Prototype CCTV 01",
    status: offline ? "Offline" : "Online",
    fps: offline ? 0 : 24 + Math.round(wave),
    inference_latency: offline ? 0 : 86 + Math.round(Math.abs(slowWave) * 12),
    rtsp_status: offline ? "Inactive" : "Active"
  };
  var health = {
    worker_id: "P-001",
    heart_rate: medical ? 126 : fall ? 112 : 78 + Math.round(wave * 4),
    spo2: medical ? 91 : fall ? 94 : 97 + (slowWave > 0.55 ? 1 : 0),
    timestamp: now.toISOString(),
    health_status: medical ? "Medical Warning" : "Normal"
  };
  var imu = {
    worker_id: "P-001",
    accel_magnitude: fall ? 2.74 : idle ? 0.18 : Number((0.98 + wave * 0.04).toFixed(2)),
    pitch: fall ? 63 : 8 + Math.round(wave * 2),
    roll: fall ? 21 : 5 + Math.round(slowWave * 2),
    posture_angle: fall ? 74 : 10 + Math.round(Math.abs(wave) * 3),
    fall_detected: fall
  };
  var ppe = {
    worker_id: "P-001",
    helmet: true,
    vest: !ppeWarning,
    boots: true,
    no_apd: ppeWarning,
    ppe_score: ppeWarning ? 67 : 100
  };
  var cctv = {
    camera_id: "CAM-01",
    worker_detected: !offline,
    class_label: scenario.classLabel,
    confidence: offline ? 0 : Number((fall ? 0.94 : idle ? 0.88 : 0.91 + wave * 0.02).toFixed(2)),
    bounding_box: {
      x: 0.38,
      y: 0.26,
      width: 0.24,
      height: 0.52
    },
    frame_time: now.toISOString()
  };
  var location = {
    worker_id: "P-001",
    x: Number((fall ? 6.4 : 5.2 + wave * 0.35).toFixed(1)),
    y: Number((fall ? 4.2 : 3.8 + slowWave * 0.28).toFixed(1)),
    zone: "Simulasi Area A",
    rssi_ap1: -58 + Math.round(wave * 3),
    rssi_ap2: -71 + Math.round(slowWave * 4),
    rssi_ap3: -64 + Math.round(Math.sin(tick / 3) * 3),
    accuracy: offline ? "+/- 4.8 m" : idle ? "+/- 2.2 m" : "+/- 1.5 m",
    last_seen: new Date(now.getTime() - (offline ? 46000 : 1200)).toISOString()
  };
  var safety = deriveSafetyState({
    health: health,
    imu: imu,
    ppe: ppe,
    cctv: cctv,
    device: device,
    camera: camera,
    now: now
  });
  var apStatus = ACCESS_POINTS.map(function (ap, index) {
    return _objectSpread(_objectSpread({}, ap), {}, {
      status: "Online",
      rssi_value: [location.rssi_ap1, location.rssi_ap2, location.rssi_ap3][index]
    });
  });
  return {
    scenarioKey: scenario.key,
    scenarioLabel: scenario.label,
    worker: _objectSpread(_objectSpread({}, WORKER), {}, {
      status: safety.status
    }),
    device: device,
    camera: camera,
    accessPoints: apStatus,
    health: health,
    imu: imu,
    ppe: ppe,
    cctv: cctv,
    location: location,
    safety: safety,
    latency: offline ? 0 : 118 + Math.round(Math.abs(wave) * 24),
    packetLoss: offline ? 8.4 : Number((0.2 + Math.abs(slowWave) * 0.4).toFixed(1)),
    updated_at: now.toISOString()
  };
}
function seedHistory() {
  return Array.from({
    length: 18
  }, function (_, index) {
    var minutesAgo = 17 - index;
    return {
      time: formatClock(new Date(Date.now() - minutesAgo * 45 * 1000)),
      bpm: 76 + Math.round(Math.sin(index / 2) * 4),
      spo2: 97 + (index % 5 === 0 ? 1 : 0)
    };
  });
}
function seedAlerts() {
  return [{
    id: "A-104",
    type: "RSSI Update",
    source: "AP-02",
    severity: "Info",
    timestamp: isoMinutesAgo(2),
    status: "Resolved"
  }, {
    id: "A-103",
    type: "Vibration Triggered",
    source: "BUBO-001",
    severity: "Low",
    timestamp: isoMinutesAgo(7),
    status: "Acknowledged"
  }, {
    id: "A-102",
    type: "Idle Warning",
    source: "CAM-01",
    severity: "Medium",
    timestamp: isoMinutesAgo(14),
    status: "Resolved"
  }, {
    id: "A-101",
    type: "PPE Violation",
    source: "CAM-01",
    severity: "High",
    timestamp: isoMinutesAgo(22),
    status: "Resolved"
  }];
}
function alertFromScenario(snapshot) {
  var common = {
    id: "A-".concat(Date.now().toString().slice(-5)),
    timestamp: snapshot.updated_at,
    status: "New"
  };
  if (snapshot.scenarioKey === "ppe") {
    return _objectSpread(_objectSpread({}, common), {}, {
      type: "PPE Violation",
      source: "CAM-01",
      severity: "High"
    });
  }
  if (snapshot.scenarioKey === "idle") {
    return _objectSpread(_objectSpread({}, common), {}, {
      type: "Idle Warning",
      source: "CAM-01",
      severity: "Medium"
    });
  }
  if (snapshot.scenarioKey === "medical") {
    return _objectSpread(_objectSpread({}, common), {}, {
      type: snapshot.health.spo2 < 92 ? "SpO2 Low" : "Heart Rate Abnormal",
      source: "BUBO-001",
      severity: "High"
    });
  }
  if (snapshot.scenarioKey === "fall") {
    return _objectSpread(_objectSpread({}, common), {}, {
      type: "Fall Detected",
      source: "MPU6050/CAM-01",
      severity: "Critical"
    });
  }
  if (snapshot.scenarioKey === "offline") {
    return _objectSpread(_objectSpread({}, common), {}, {
      type: "Device Offline",
      source: "BUBO-001",
      severity: "Critical"
    });
  }
  return null;
}
function Icon(_ref3) {
  var name = _ref3.name,
    _ref3$className = _ref3.className,
    className = _ref3$className === void 0 ? "h-4 w-4" : _ref3$className;
  return /*#__PURE__*/React.createElement("i", {
    "data-lucide": name,
    className: className,
    "aria-hidden": "true"
  });
}
function StatusDot(_ref4) {
  var _STATUS_META$status;
  var status = _ref4.status;
  var tone = ((_STATUS_META$status = STATUS_META[status]) === null || _STATUS_META$status === void 0 ? void 0 : _STATUS_META$status.tone) || "offline";
  return /*#__PURE__*/React.createElement("span", {
    className: "status-dot ".concat(tone)
  });
}
function StatusBadge(_ref5) {
  var status = _ref5.status,
    children = _ref5.children;
  var meta = STATUS_META[status] || STATUS_META.Offline;
  return /*#__PURE__*/React.createElement("span", {
    className: cx("inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-black", meta.bg, meta.text, meta.border)
  }, /*#__PURE__*/React.createElement(StatusDot, {
    status: status
  }), children || meta.label);
}
function SimpleBadge(_ref6) {
  var children = _ref6.children,
    _ref6$tone = _ref6.tone,
    tone = _ref6$tone === void 0 ? "neutral" : _ref6$tone;
  var palette = {
    neutral: "bg-neutral-100 text-neutral-700 border-neutral-200",
    safe: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    emergency: "bg-red-50 text-red-700 border-red-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200"
  };
  return /*#__PURE__*/React.createElement("span", {
    className: cx("inline-flex items-center rounded-md border px-2 py-1 text-xs font-black", palette[tone])
  }, children);
}
function Panel(_ref7) {
  var children = _ref7.children,
    _ref7$className = _ref7.className,
    className = _ref7$className === void 0 ? "" : _ref7$className;
  return /*#__PURE__*/React.createElement("section", {
    className: cx("panel p-4", className)
  }, children);
}
function SectionTitle(_ref8) {
  var eyebrow = _ref8.eyebrow,
    title = _ref8.title,
    right = _ref8.right;
  return /*#__PURE__*/React.createElement("div", {
    className: "mb-4 flex flex-wrap items-start justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("p", {
    className: "mb-1 text-xs font-black uppercase text-orange-600"
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-black text-neutral-950"
  }, title)), right);
}
function DataRow(_ref9) {
  var label = _ref9.label,
    value = _ref9.value,
    _ref9$valueClass = _ref9.valueClass,
    valueClass = _ref9$valueClass === void 0 ? "" : _ref9$valueClass;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-3 border-b border-neutral-200 py-2 last:border-0"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-neutral-500"
  }, label), /*#__PURE__*/React.createElement("strong", {
    className: cx("text-right text-sm font-black text-neutral-950", valueClass)
  }, value));
}
function ActionButton(_ref0) {
  var icon = _ref0.icon,
    children = _ref0.children,
    _ref0$variant = _ref0.variant,
    variant = _ref0$variant === void 0 ? "primary" : _ref0$variant,
    onClick = _ref0.onClick;
  var styles = variant === "primary" ? "border-orange-600 bg-orange-600 text-white hover:bg-orange-700" : "border-neutral-300 bg-white text-neutral-900 hover:border-orange-400 hover:text-orange-700";
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    className: cx("inline-flex min-h-10 items-center justify-center gap-2 border px-3 text-sm font-black transition", styles)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon
  }), /*#__PURE__*/React.createElement("span", null, children));
}
function Sidebar(_ref1) {
  var activePage = _ref1.activePage,
    onNavigate = _ref1.onNavigate,
    snapshot = _ref1.snapshot;
  return /*#__PURE__*/React.createElement("aside", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand-mark mb-6 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex h-11 w-11 items-center justify-center rounded-md bg-orange-600 text-base font-black text-white"
  }, "BS"), /*#__PURE__*/React.createElement("div", {
    className: "brand-copy"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mb-1 text-sm font-black"
  }, "BUBO STRAP"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-neutral-400"
  }, "MVP Dashboard"))), /*#__PURE__*/React.createElement("nav", {
    className: "space-y-2"
  }, MENU_ITEMS.map(function (item) {
    var active = item.id === activePage;
    return /*#__PURE__*/React.createElement("button", {
      key: item.id,
      type: "button",
      onClick: function onClick() {
        return onNavigate(item.id);
      },
      className: cx("flex min-h-11 w-full items-center gap-3 rounded-md border px-3 text-left text-sm font-black transition", active ? "border-orange-500 bg-orange-600 text-white" : "border-transparent text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900 hover:text-white")
    }, /*#__PURE__*/React.createElement(Icon, {
      name: item.icon
    }), /*#__PURE__*/React.createElement("span", {
      className: "nav-text"
    }, item.label));
  })), /*#__PURE__*/React.createElement("div", {
    className: "prototype-copy mt-auto rounded-md border border-neutral-800 bg-neutral-950 p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-2 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-black text-neutral-400"
  }, "Prototype"), /*#__PURE__*/React.createElement(StatusDot, {
    status: snapshot.safety.status
  })), /*#__PURE__*/React.createElement("p", {
    className: "mb-1 text-sm font-black"
  }, snapshot.worker.id), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-neutral-400"
  }, snapshot.worker.zone)));
}
function Header(_ref10) {
  var snapshot = _ref10.snapshot,
    clock = _ref10.clock;
  return /*#__PURE__*/React.createElement("header", {
    className: "mb-5 flex flex-wrap items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "mb-1 text-sm font-black uppercase text-orange-600"
  }, "Single Worker AIoT Safety Monitoring Prototype"), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-black text-neutral-950 md:text-3xl"
  }, "BUBO STRAP MVP Dashboard")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-3"
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: snapshot.safety.status
  }, snapshot.safety.reason), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex min-h-10 items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 text-sm font-black text-orange-700"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flask-conical"
  }), "Prototype Testing Mode"), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex min-h-10 items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 text-sm font-black text-neutral-800"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock-3"
  }), formatClock(clock)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "relative inline-flex h-10 w-10 items-center justify-center border border-neutral-300 bg-white text-neutral-900",
    "aria-label": "Notifications"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange-600"
  }))));
}
function KpiCard(_ref11) {
  var label = _ref11.label,
    value = _ref11.value,
    detail = _ref11.detail,
    icon = _ref11.icon,
    status = _ref11.status;
  return /*#__PURE__*/React.createElement(Panel, {
    className: "min-h-[126px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "mb-2 text-xs font-black uppercase text-neutral-500"
  }, label), /*#__PURE__*/React.createElement("strong", {
    className: "block text-2xl font-black text-neutral-950"
  }, value)), /*#__PURE__*/React.createElement("div", {
    className: "flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100 text-neutral-700"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 flex items-center gap-2 text-sm text-neutral-500"
  }, status && /*#__PURE__*/React.createElement(StatusDot, {
    status: status
  }), /*#__PURE__*/React.createElement("span", null, detail)));
}
function ProfileCard(_ref12) {
  var snapshot = _ref12.snapshot;
  return /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "Worker profile",
    title: "Pekerja uji tunggal"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex h-16 w-16 items-center justify-center rounded-md bg-neutral-950 text-lg font-black text-white"
  }, "WP"), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-black text-neutral-950"
  }, snapshot.worker.name), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-neutral-500"
  }, snapshot.worker.role), /*#__PURE__*/React.createElement("div", {
    className: "mt-2"
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: snapshot.safety.status
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement(DataRow, {
    label: "Worker ID",
    value: snapshot.worker.id
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Name",
    value: snapshot.worker.name
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Device ID",
    value: snapshot.worker.device_id
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Zone",
    value: snapshot.worker.zone
  })));
}
function MiniMetric(_ref13) {
  var label = _ref13.label,
    value = _ref13.value,
    detail = _ref13.detail,
    status = _ref13.status,
    icon = _ref13.icon;
  return /*#__PURE__*/React.createElement("div", {
    className: "soft-panel p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 flex items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-black uppercase text-neutral-500"
  }, label), /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    className: "h-4 w-4 text-neutral-500"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-end justify-between gap-3"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-xl font-black text-neutral-950"
  }, value), status && /*#__PURE__*/React.createElement(StatusDot, {
    status: status
  })), /*#__PURE__*/React.createElement("p", {
    className: "mt-1 text-xs text-neutral-500"
  }, detail));
}
function PpeGrid(_ref14) {
  var ppe = _ref14.ppe;
  var items = [{
    label: "Helmet",
    value: ppe.helmet,
    icon: "hard-hat"
  }, {
    label: "Vest/Rompi",
    value: ppe.vest,
    icon: "shield-check"
  }, {
    label: "Boots/Sepatu",
    value: ppe.boots,
    icon: "footprints"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-3 sm:grid-cols-3"
  }, items.map(function (item) {
    return /*#__PURE__*/React.createElement("div", {
      key: item.label,
      className: cx("soft-panel p-3", item.value ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50")
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-3 flex items-center justify-between gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-black"
    }, item.label), /*#__PURE__*/React.createElement(Icon, {
      name: item.icon,
      className: cx("h-4 w-4", item.value ? "text-green-700" : "text-amber-700")
    })), /*#__PURE__*/React.createElement(SimpleBadge, {
      tone: item.value ? "safe" : "warning"
    }, item.value ? "Detected" : "Not detected"));
  }));
}
function SimulatedFrame(_ref15) {
  var _streamStatus$seconds;
  var snapshot = _ref15.snapshot,
    streamStatus = _ref15.streamStatus,
    _ref15$compact = _ref15.compact,
    compact = _ref15$compact === void 0 ? false : _ref15$compact;
  var status = snapshot.safety.status;
  var tone = STATUS_META[status].tone;
  var activeActivity = snapshot.cctv.class_label;
  var streamState = (streamStatus === null || streamStatus === void 0 ? void 0 : streamStatus.status) || "starting";
  var streamFps = (streamStatus === null || streamStatus === void 0 ? void 0 : streamStatus.fps) || snapshot.camera.fps;
  var rtspUrl = (streamStatus === null || streamStatus === void 0 ? void 0 : streamStatus.rtsp_url) || "rtsp://Bubo_Strap:PKMKC2026@10.42.0.209/stream1";
  var modelLabel = streamStatus !== null && streamStatus !== void 0 && streamStatus.inference_enabled ? (streamStatus === null || streamStatus === void 0 ? void 0 : streamStatus.model_path) || "best2.pt" : "YOLO disabled";
  var boxes = [{
    label: "Worker",
    className: "box-worker",
    active: snapshot.cctv.worker_detected,
    tone: tone
  }, {
    label: "Helmet",
    className: "box-helmet",
    active: snapshot.ppe.helmet,
    tone: "safe"
  }, {
    label: "Vest",
    className: "box-vest",
    active: snapshot.ppe.vest,
    tone: snapshot.ppe.vest ? "safe" : "warning"
  }, {
    label: "Boots",
    className: "box-boots",
    active: snapshot.ppe.boots,
    tone: "safe"
  }, {
    label: "No-APD",
    className: "box-no-apd",
    active: snapshot.ppe.no_apd,
    tone: "warning"
  }, {
    label: "Working",
    className: "box-working",
    active: activeActivity === "working",
    tone: "safe"
  }, {
    label: "Idle",
    className: "box-idle",
    active: activeActivity === "idle",
    tone: "warning"
  }, {
    label: "Fallen",
    className: "box-fallen",
    active: activeActivity === "fallen",
    tone: "emergency"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: cx("video-frame", compact && "compact")
  }, /*#__PURE__*/React.createElement("img", {
    className: "rtsp-feed",
    src: "/video_feed",
    alt: "CAM-01 RTSP live stream"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rtsp-empty-state"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cctv",
    className: "h-8 w-8"
  }), /*#__PURE__*/React.createElement("strong", null, "Waiting for CAM-01 RTSP stream"), /*#__PURE__*/React.createElement("span", null, rtspUrl)), /*#__PURE__*/React.createElement("div", {
    className: "absolute left-3 top-3 flex flex-wrap items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rounded-md bg-black/80 px-2 py-1 text-xs font-black text-white"
  }, "CAM-01"), /*#__PURE__*/React.createElement("span", {
    className: "rounded-md bg-black/70 px-2 py-1 text-xs font-black text-orange-300"
  }, streamState, " - ", streamFps, " FPS"), /*#__PURE__*/React.createElement("span", {
    className: "rounded-md bg-black/70 px-2 py-1 text-xs font-black text-green-300"
  }, "YOLO: ", modelLabel)), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-8 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-xs font-black text-white"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rounded-md bg-black/75 px-2 py-1"
  }, "RTSP: ", rtspUrl), /*#__PURE__*/React.createElement("span", {
    className: "rounded-md bg-black/75 px-2 py-1"
  }, streamStatus !== null && streamStatus !== void 0 && streamStatus.last_error ? streamStatus.last_error : "Last frame: ".concat((_streamStatus$seconds = streamStatus === null || streamStatus === void 0 ? void 0 : streamStatus.seconds_since_frame) !== null && _streamStatus$seconds !== void 0 ? _streamStatus$seconds : "waiting", "s"))), boxes.map(function (box) {
    return /*#__PURE__*/React.createElement("div", {
      key: box.label,
      className: cx("bbox", box.className, box.active ? box.tone : "inactive", snapshot.camera.status !== "Online" && "offline")
    }, /*#__PURE__*/React.createElement("span", null, box.label));
  }));
}
function RecentAlerts(_ref16) {
  var alerts = _ref16.alerts,
    _ref16$limit = _ref16.limit,
    limit = _ref16$limit === void 0 ? 5 : _ref16$limit;
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, alerts.slice(0, limit).map(function (alert) {
    return /*#__PURE__*/React.createElement("div", {
      key: alert.id,
      className: "flex items-start justify-between gap-3 rounded-md border border-neutral-200 bg-white p-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "font-black text-neutral-950"
    }, alert.type), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-neutral-500"
    }, alert.source, " - ", formatDateTime(alert.timestamp))), /*#__PURE__*/React.createElement("span", {
      className: cx("rounded-md border px-2 py-1 text-xs font-black", SEVERITY_META[alert.severity])
    }, alert.severity));
  }));
}
function HomePage(_ref17) {
  var snapshot = _ref17.snapshot,
    alerts = _ref17.alerts,
    streamStatus = _ref17.streamStatus,
    onNavigate = _ref17.onNavigate;
  var kpis = [{
    label: "Active Worker",
    value: "1",
    detail: "P-001 monitored",
    icon: "user-check",
    status: snapshot.safety.status
  }, {
    label: "Strap Online",
    value: snapshot.device.online_status === "Online" ? "1/1" : "0/1",
    detail: snapshot.device.device_id,
    icon: "watch",
    status: snapshot.device.online_status === "Online" ? "Safe" : "Offline"
  }, {
    label: "CCTV Online",
    value: snapshot.camera.status === "Online" ? "1/1" : "0/1",
    detail: snapshot.camera.camera_id,
    icon: "cctv",
    status: snapshot.camera.status === "Online" ? "Safe" : "Offline"
  }, {
    label: "Access Point Online",
    value: "3/3",
    detail: "AP-01, AP-02, AP-03",
    icon: "wifi",
    status: "Safe"
  }, {
    label: "Current Safety Status",
    value: snapshot.safety.status,
    detail: snapshot.safety.reason,
    icon: "shield-alert",
    status: snapshot.safety.status
  }, {
    label: "Last Data Update",
    value: formatClock(new Date(snapshot.updated_at)),
    detail: "Mock WebSocket tick",
    icon: "refresh-cw",
    status: snapshot.safety.status
  }, {
    label: "System Latency",
    value: snapshot.latency ? "".concat(snapshot.latency, " ms") : "Offline",
    detail: "End-to-end estimate",
    icon: "activity",
    status: snapshot.latency ? "Safe" : "Offline"
  }, {
    label: "Battery Level",
    value: "".concat(snapshot.device.battery, "%"),
    detail: "BUBO-001",
    icon: "battery-medium",
    status: snapshot.device.battery > 30 ? "Safe" : "Warning"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "content-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4"
  }, kpis.map(function (kpi) {
    return /*#__PURE__*/React.createElement(KpiCard, _objectSpread({
      key: kpi.label
    }, kpi));
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4 xl:grid-cols-[330px_minmax(0,1fr)_360px]"
  }, /*#__PURE__*/React.createElement(ProfileCard, {
    snapshot: snapshot
  }), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "Near-time telemetry",
    title: "Ringkasan tanda vital"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-3 md:grid-cols-3"
  }, /*#__PURE__*/React.createElement(MiniMetric, {
    label: "BPM",
    value: snapshot.health.heart_rate,
    detail: snapshot.health.health_status,
    status: snapshot.safety.status,
    icon: "heart-pulse"
  }), /*#__PURE__*/React.createElement(MiniMetric, {
    label: "SpO2",
    value: "".concat(snapshot.health.spo2, "%"),
    detail: "MAX30105 reading",
    status: snapshot.health.spo2 >= 95 ? "Safe" : "Warning",
    icon: "droplets"
  }), /*#__PURE__*/React.createElement(MiniMetric, {
    label: "Fall Detection",
    value: snapshot.imu.fall_detected ? "Detected" : "Clear",
    detail: "MPU6050 fusion",
    status: snapshot.imu.fall_detected ? "Emergency" : "Safe",
    icon: "person-standing"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-5"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "mb-3 text-sm font-black uppercase text-neutral-500"
  }, "Ringkasan APD"), /*#__PURE__*/React.createElement(PpeGrid, {
    ppe: snapshot.ppe
  }))), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "RSSI fingerprinting",
    title: "Ringkasan lokasi",
    right: /*#__PURE__*/React.createElement(SimpleBadge, {
      tone: "orange"
    }, snapshot.location.accuracy)
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Estimated X-Y coordinate",
    value: "X ".concat(snapshot.location.x, ", Y ").concat(snapshot.location.y)
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "RSSI accuracy estimate",
    value: snapshot.location.accuracy
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Last location update",
    value: formatClock(new Date(snapshot.location.last_seen))
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Zone",
    value: snapshot.location.zone
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return onNavigate("location");
    },
    className: "mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 border border-neutral-300 bg-white px-3 text-sm font-black hover:border-orange-400 hover:text-orange-700"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pinned"
  }), "View Worker Location"))), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]"
  }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "CCTV preview",
    title: "CAM-01 RTSP live preview",
    right: /*#__PURE__*/React.createElement(StatusBadge, {
      status: (streamStatus === null || streamStatus === void 0 ? void 0 : streamStatus.status) === "running" ? "Safe" : "Warning"
    }, (streamStatus === null || streamStatus === void 0 ? void 0 : streamStatus.status) || "starting")
  }), /*#__PURE__*/React.createElement(SimulatedFrame, {
    snapshot: snapshot,
    streamStatus: streamStatus,
    compact: true
  })), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "Recent alert",
    title: "3-5 kejadian terakhir"
  }), /*#__PURE__*/React.createElement(RecentAlerts, {
    alerts: alerts,
    limit: 5
  }))));
}
function DetectionStatusPanel(_ref18) {
  var snapshot = _ref18.snapshot,
    streamStatus = _ref18.streamStatus;
  var workerDetected = snapshot.cctv.worker_detected ? "Yes" : "No";
  return /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "Computer vision",
    title: "Hasil deteksi CAM-01",
    right: /*#__PURE__*/React.createElement(StatusBadge, {
      status: (streamStatus === null || streamStatus === void 0 ? void 0 : streamStatus.status) === "running" ? "Safe" : "Warning"
    }, (streamStatus === null || streamStatus === void 0 ? void 0 : streamStatus.status) || "starting")
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Camera ID",
    value: snapshot.camera.camera_id
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Camera status",
    value: (streamStatus === null || streamStatus === void 0 ? void 0 : streamStatus.status) || snapshot.camera.status
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "RTSP source",
    value: (streamStatus === null || streamStatus === void 0 ? void 0 : streamStatus.rtsp_url) || "rtsp://Bubo_Strap:PKMKC2026@10.42.0.209/stream1"
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "YOLO model",
    value: (streamStatus === null || streamStatus === void 0 ? void 0 : streamStatus.model_path) || "best2.pt"
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "FPS",
    value: (streamStatus === null || streamStatus === void 0 ? void 0 : streamStatus.fps) || snapshot.camera.fps
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Inference latency",
    value: streamStatus !== null && streamStatus !== void 0 && streamStatus.inference_enabled ? "".concat(snapshot.camera.inference_latency, " ms") : "Disabled"
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Worker detected",
    value: workerDetected
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Detection confidence",
    value: "".concat(Math.round(snapshot.cctv.confidence * 100), "%")
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 rounded-md border border-neutral-200 bg-neutral-50 p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-2 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-black text-neutral-600"
  }, "Risk level"), /*#__PURE__*/React.createElement(SimpleBadge, {
    tone: snapshot.safety.status === "Emergency" ? "emergency" : snapshot.safety.status === "Warning" ? "warning" : "safe"
  }, snapshot.safety.risk)), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-neutral-500"
  }, snapshot.safety.reason)));
}
function ComplianceList(_ref19) {
  var snapshot = _ref19.snapshot;
  var ppeItems = [["Helmet", snapshot.ppe.helmet], ["Vest/Rompi", snapshot.ppe.vest], ["Boots/Sepatu", snapshot.ppe.boots]];
  var activityItems = [["Working", snapshot.cctv.class_label === "working"], ["Idle", snapshot.cctv.class_label === "idle"], ["Fallen", snapshot.cctv.class_label === "fallen"]];
  return /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "Compliance",
    title: "PPE dan aktivitas"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mb-5 space-y-2"
  }, ppeItems.map(function (_ref20) {
    var _ref21 = _slicedToArray(_ref20, 2),
      label = _ref21[0],
      value = _ref21[1];
    return /*#__PURE__*/React.createElement("div", {
      key: label,
      className: "flex items-center justify-between rounded-md border border-neutral-200 p-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-black"
    }, label), /*#__PURE__*/React.createElement(SimpleBadge, {
      tone: value ? "safe" : "warning"
    }, value ? "Detected" : "Not detected"));
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, activityItems.map(function (_ref22) {
    var _ref23 = _slicedToArray(_ref22, 2),
      label = _ref23[0],
      value = _ref23[1];
    return /*#__PURE__*/React.createElement("div", {
      key: label,
      className: "flex items-center justify-between rounded-md border border-neutral-200 p-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-black"
    }, label), /*#__PURE__*/React.createElement(SimpleBadge, {
      tone: value ? label === "Fallen" ? "emergency" : label === "Idle" ? "warning" : "safe" : "neutral"
    }, value ? "Active" : "Inactive"));
  })));
}
function CctvPage(_ref24) {
  var snapshot = _ref24.snapshot,
    streamStatus = _ref24.streamStatus,
    onAction = _ref24.onAction,
    onNavigate = _ref24.onNavigate;
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]"
  }, /*#__PURE__*/React.createElement(Panel, {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "CCTV Monitoring",
    title: "Main CCTV panel - CAM-01",
    right: /*#__PURE__*/React.createElement(SimpleBadge, {
      tone: "orange"
    }, "Prototype CCTV 01")
  }), /*#__PURE__*/React.createElement(SimulatedFrame, {
    snapshot: snapshot,
    streamStatus: streamStatus
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 flex flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement(ActionButton, {
    icon: "smartphone-vibrate",
    onClick: function onClick() {
      return onAction("Trigger Vibration");
    }
  }, "Trigger Vibration"), /*#__PURE__*/React.createElement(ActionButton, {
    icon: "save",
    variant: "secondary",
    onClick: function onClick() {
      return onAction("Save Evidence");
    }
  }, "Save Evidence"), /*#__PURE__*/React.createElement(ActionButton, {
    icon: "badge-check",
    variant: "secondary",
    onClick: function onClick() {
      return onAction("Acknowledge Alert");
    }
  }, "Acknowledge Alert"), /*#__PURE__*/React.createElement(ActionButton, {
    icon: "map-pinned",
    variant: "secondary",
    onClick: function onClick() {
      return onNavigate("location");
    }
  }, "View Worker Location"))), /*#__PURE__*/React.createElement("div", {
    className: "content-grid"
  }, /*#__PURE__*/React.createElement(DetectionStatusPanel, {
    snapshot: snapshot,
    streamStatus: streamStatus
  }), /*#__PURE__*/React.createElement(ComplianceList, {
    snapshot: snapshot
  })));
}
function Gauge(_ref25) {
  var label = _ref25.label,
    value = _ref25.value,
    min = _ref25.min,
    max = _ref25.max,
    unit = _ref25.unit,
    status = _ref25.status;
  var ratio = clamp((value - min) / (max - min) * 100, 0, 100);
  var meta = STATUS_META[status] || STATUS_META.Safe;
  return /*#__PURE__*/React.createElement("div", {
    className: "soft-panel flex flex-col items-center p-4 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gauge-track",
    style: {
      "--gauge-color": meta.color,
      "--gauge-value": "".concat(ratio, "%")
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gauge-content"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-2xl font-black text-neutral-950"
  }, value), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-black text-neutral-500"
  }, unit))), /*#__PURE__*/React.createElement("p", {
    className: "mt-3 text-sm font-black text-neutral-950"
  }, label), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-neutral-500"
  }, min, "-", max, " range"));
}
function TrendChart(_ref26) {
  var history = _ref26.history;
  if (!ResponsiveContainer || !LineChart) {
    return /*#__PURE__*/React.createElement("div", {
      className: "chart-fallback"
    }, "Recharts library unavailable");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "h-[260px] w-full"
  }, /*#__PURE__*/React.createElement(ResponsiveContainer, null, /*#__PURE__*/React.createElement(LineChart, {
    data: history,
    margin: {
      top: 12,
      right: 16,
      bottom: 8,
      left: 0
    }
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    stroke: "#e5e5e5",
    strokeDasharray: "3 3"
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "time",
    tick: {
      fontSize: 11
    },
    interval: "preserveStartEnd"
  }), /*#__PURE__*/React.createElement(YAxis, {
    yAxisId: "bpm",
    tick: {
      fontSize: 11
    },
    domain: [45, 135]
  }), /*#__PURE__*/React.createElement(YAxis, {
    yAxisId: "spo2",
    orientation: "right",
    tick: {
      fontSize: 11
    },
    domain: [88, 100]
  }), /*#__PURE__*/React.createElement(ChartTooltip, null), /*#__PURE__*/React.createElement(Legend, null), /*#__PURE__*/React.createElement(Line, {
    yAxisId: "bpm",
    type: "monotone",
    dataKey: "bpm",
    name: "BPM",
    stroke: "#f97316",
    strokeWidth: 3,
    dot: false
  }), /*#__PURE__*/React.createElement(Line, {
    yAxisId: "spo2",
    type: "monotone",
    dataKey: "spo2",
    name: "SpO2",
    stroke: "#171717",
    strokeWidth: 3,
    dot: false
  }))));
}
function WorkerDetailPage(_ref27) {
  var snapshot = _ref27.snapshot,
    history = _ref27.history,
    onAction = _ref27.onAction,
    onNavigate = _ref27.onNavigate;
  var bpmStatus = snapshot.health.heart_rate >= 60 && snapshot.health.heart_rate <= 100 ? "Safe" : "Warning";
  var spo2Status = snapshot.health.spo2 >= 95 ? "Safe" : snapshot.health.spo2 < 92 ? "Warning" : "Warning";
  return /*#__PURE__*/React.createElement("div", {
    className: "content-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4 xl:grid-cols-[330px_minmax(0,1fr)]"
  }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "Worker Detail",
    title: "P-001 only",
    right: /*#__PURE__*/React.createElement(StatusBadge, {
      status: snapshot.safety.status
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex h-20 w-20 items-center justify-center rounded-md bg-neutral-950 text-2xl font-black text-white"
  }, "WP"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-black text-neutral-950"
  }, snapshot.worker.name), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-neutral-500"
  }, snapshot.worker.department))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement(DataRow, {
    label: "Worker ID",
    value: snapshot.worker.id
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Name",
    value: snapshot.worker.name
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Role",
    value: snapshot.worker.role
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Device ID",
    value: snapshot.worker.device_id
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Zone",
    value: snapshot.worker.zone
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Last seen",
    value: formatClock(new Date(snapshot.location.last_seen))
  }))), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "Device and vitals",
    title: "BUBO-001 telemetry"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-3 md:grid-cols-3"
  }, /*#__PURE__*/React.createElement(MiniMetric, {
    label: "Online/offline",
    value: snapshot.device.online_status,
    detail: "ESP32-SuperMini",
    status: snapshot.device.online_status === "Online" ? "Safe" : "Offline",
    icon: "radio"
  }), /*#__PURE__*/React.createElement(MiniMetric, {
    label: "Battery percentage",
    value: "".concat(snapshot.device.battery, "%"),
    detail: "Wearable strap",
    status: snapshot.device.battery > 30 ? "Safe" : "Warning",
    icon: "battery-medium"
  }), /*#__PURE__*/React.createElement(MiniMetric, {
    label: "Last telemetry",
    value: formatClock(new Date(snapshot.device.last_payload)),
    detail: "Mock payload",
    status: snapshot.device.online_status === "Online" ? "Safe" : "Offline",
    icon: "send"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 grid gap-3 md:grid-cols-3"
  }, /*#__PURE__*/React.createElement(MiniMetric, {
    label: "Heart Rate/BPM",
    value: snapshot.health.heart_rate,
    detail: "MAX30105",
    status: bpmStatus,
    icon: "heart-pulse"
  }), /*#__PURE__*/React.createElement(MiniMetric, {
    label: "SpO2",
    value: "".concat(snapshot.health.spo2, "%"),
    detail: "MAX30105",
    status: spo2Status,
    icon: "droplets"
  }), /*#__PURE__*/React.createElement(MiniMetric, {
    label: "Health status",
    value: snapshot.health.health_status,
    detail: snapshot.safety.reason,
    status: snapshot.safety.status,
    icon: "stethoscope"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]"
  }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "Health gauge",
    title: "BPM dan SpO2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-1"
  }, /*#__PURE__*/React.createElement(Gauge, {
    label: "BPM",
    value: snapshot.health.heart_rate,
    min: 40,
    max: 140,
    unit: "beats/min",
    status: bpmStatus
  }), /*#__PURE__*/React.createElement(Gauge, {
    label: "SpO2",
    value: snapshot.health.spo2,
    min: 88,
    max: 100,
    unit: "percent",
    status: spo2Status
  }))), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "History",
    title: "Grafik histori BPM dan SpO2"
  }), /*#__PURE__*/React.createElement(TrendChart, {
    history: history
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4 xl:grid-cols-3"
  }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "MPU6050",
    title: "IMU data"
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Acceleration magnitude",
    value: "".concat(snapshot.imu.accel_magnitude, " g")
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Pitch",
    value: "".concat(snapshot.imu.pitch, " deg")
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Roll",
    value: "".concat(snapshot.imu.roll, " deg")
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Posture angle",
    value: "".concat(snapshot.imu.posture_angle, " deg")
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Fall detection status",
    value: snapshot.imu.fall_detected ? "Detected" : "Clear",
    valueClass: snapshot.imu.fall_detected ? "text-red-700" : "text-green-700"
  })), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "APD",
    title: "PPE status"
  }), /*#__PURE__*/React.createElement(PpeGrid, {
    ppe: snapshot.ppe
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement(DataRow, {
    label: "PPE score",
    value: "".concat(snapshot.ppe.ppe_score, "%")
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "No-APD",
    value: snapshot.ppe.no_apd ? "True" : "False"
  }))), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "Activity",
    title: "Worker activity"
  }), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, ["working", "idle", "fallen"].map(function (activity) {
    return /*#__PURE__*/React.createElement("div", {
      key: activity,
      className: "flex items-center justify-between rounded-md border border-neutral-200 p-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-black capitalize"
    }, activity), /*#__PURE__*/React.createElement(SimpleBadge, {
      tone: snapshot.cctv.class_label === activity ? activity === "fallen" ? "emergency" : activity === "idle" ? "warning" : "safe" : "neutral"
    }, snapshot.cctv.class_label === activity ? "Active" : "Inactive"));
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 grid gap-2"
  }, /*#__PURE__*/React.createElement(ActionButton, {
    icon: "smartphone-vibrate",
    onClick: function onClick() {
      return onAction("Trigger Vibration");
    }
  }, "Trigger Vibration"), /*#__PURE__*/React.createElement(ActionButton, {
    icon: "cctv",
    variant: "secondary",
    onClick: function onClick() {
      return onNavigate("cctv");
    }
  }, "View CCTV"), /*#__PURE__*/React.createElement(ActionButton, {
    icon: "map-pinned",
    variant: "secondary",
    onClick: function onClick() {
      return onNavigate("location");
    }
  }, "View Location"), /*#__PURE__*/React.createElement(ActionButton, {
    icon: "check-check",
    variant: "secondary",
    onClick: function onClick() {
      return onAction("Mark as Resolved");
    }
  }, "Mark as Resolved")))));
}
function TooltipRow(_ref28) {
  var label = _ref28.label,
    value = _ref28.value;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-3 border-b border-neutral-700 py-1.5 last:border-0"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-neutral-400"
  }, label), /*#__PURE__*/React.createElement("strong", {
    className: "text-right text-xs font-black text-white"
  }, value));
}
function LocationMap(_ref29) {
  var snapshot = _ref29.snapshot;
  var xPercent = clamp(snapshot.location.x / 10 * 100, 4, 96);
  var yPercent = clamp(100 - snapshot.location.y / 8 * 100, 6, 94);
  var status = snapshot.safety.status;
  var ppeStatus = snapshot.ppe.helmet && snapshot.ppe.vest && snapshot.ppe.boots ? "Complete" : "Incomplete";
  return /*#__PURE__*/React.createElement("div", {
    className: "map-plane"
  }, /*#__PURE__*/React.createElement("div", {
    className: "zone-label left-5 top-5"
  }, "Simulasi Area A"), /*#__PURE__*/React.createElement("div", {
    className: "zone-label bottom-5 right-5"
  }, "Material mock zone"), /*#__PURE__*/React.createElement("div", {
    className: "absolute left-[8%] right-[8%] top-[50%] h-px bg-orange-300"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-[12%] left-[48%] top-[12%] w-px bg-neutral-300"
  }), snapshot.accessPoints.map(function (ap) {
    return /*#__PURE__*/React.createElement("div", {
      key: ap.id,
      className: "ap-marker",
      style: {
        left: "".concat(ap.x, "%"),
        top: "".concat(ap.y, "%")
      }
    }, ap.name);
  }), /*#__PURE__*/React.createElement("div", {
    className: "worker-pin ".concat(STATUS_META[status].tone),
    style: {
      left: "".concat(xPercent, "%"),
      top: "".concat(yPercent, "%")
    }
  }, "P1", /*#__PURE__*/React.createElement("div", {
    className: "pin-tooltip"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mb-2 font-black"
  }, "Worker ", snapshot.worker.id), /*#__PURE__*/React.createElement(TooltipRow, {
    label: "Device ID",
    value: snapshot.worker.device_id
  }), /*#__PURE__*/React.createElement(TooltipRow, {
    label: "BPM",
    value: snapshot.health.heart_rate
  }), /*#__PURE__*/React.createElement(TooltipRow, {
    label: "SpO2",
    value: "".concat(snapshot.health.spo2, "%")
  }), /*#__PURE__*/React.createElement(TooltipRow, {
    label: "PPE status",
    value: ppeStatus
  }), /*#__PURE__*/React.createElement(TooltipRow, {
    label: "Zone",
    value: snapshot.location.zone
  }), /*#__PURE__*/React.createElement(TooltipRow, {
    label: "Last seen",
    value: formatClock(new Date(snapshot.location.last_seen))
  }))));
}
function RssiPanel(_ref30) {
  var snapshot = _ref30.snapshot;
  var localizationStatus = snapshot.safety.status === "Offline" ? "Offline" : snapshot.location.accuracy.includes("2.2") ? "Unstable" : "Stable";
  var localizationTone = localizationStatus === "Stable" ? "safe" : localizationStatus === "Unstable" ? "warning" : "neutral";
  return /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "RSSI panel",
    title: "AP signal",
    right: /*#__PURE__*/React.createElement(SimpleBadge, {
      tone: localizationTone
    }, localizationStatus)
  }), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, snapshot.accessPoints.map(function (ap) {
    var strength = clamp((ap.rssi_value + 90) * 2, 8, 100);
    return /*#__PURE__*/React.createElement("div", {
      key: ap.id,
      className: "rounded-md border border-neutral-200 p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-2 flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-black"
    }, ap.name, " RSSI"), /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-black text-neutral-600"
    }, ap.rssi_value, " dBm")), /*#__PURE__*/React.createElement("div", {
      className: "metric-bar"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: "".concat(strength, "%"),
        background: "#f97316"
      }
    })));
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement(DataRow, {
    label: "X coordinate",
    value: snapshot.location.x
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Y coordinate",
    value: snapshot.location.y
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Zone",
    value: snapshot.location.zone
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Accuracy estimate",
    value: snapshot.location.accuracy
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Last update",
    value: formatClock(new Date(snapshot.location.last_seen))
  })));
}
function LocationPage(_ref31) {
  var snapshot = _ref31.snapshot;
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]"
  }, /*#__PURE__*/React.createElement(Panel, {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "RSSI Location",
    title: "Denah 2D area simulasi",
    right: /*#__PURE__*/React.createElement(StatusBadge, {
      status: snapshot.safety.status
    }, "Worker P-001")
  }), /*#__PURE__*/React.createElement(LocationMap, {
    snapshot: snapshot
  })), /*#__PURE__*/React.createElement("div", {
    className: "content-grid"
  }, /*#__PURE__*/React.createElement(RssiPanel, {
    snapshot: snapshot
  }), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "Access point status",
    title: "3 AP fixed"
  }), snapshot.accessPoints.map(function (ap) {
    return /*#__PURE__*/React.createElement(DataRow, {
      key: ap.id,
      label: "".concat(ap.name, " online/offline"),
      value: ap.status,
      valueClass: "text-green-700"
    });
  }))));
}
function exportAlertsCsv(alerts) {
  var columns = ["Time", "Alert type", "Source", "Severity", "Status"];
  var rows = alerts.map(function (alert) {
    return [formatDateTime(alert.timestamp), alert.type, alert.source, alert.severity, alert.status];
  });
  var csv = [columns].concat(_toConsumableArray(rows)).map(function (row) {
    return row.map(function (value) {
      return "\"".concat(String(value).replaceAll('"', '""'), "\"");
    }).join(",");
  }).join("\n");
  var blob = new Blob([csv], {
    type: "text/csv;charset=utf-8"
  });
  var url = URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = url;
  link.download = "bubo-alert-log-".concat(Date.now(), ".csv");
  link.click();
  URL.revokeObjectURL(url);
}
function AlertTable(_ref32) {
  var alerts = _ref32.alerts;
  return /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "alert-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Time"), /*#__PURE__*/React.createElement("th", null, "Alert type"), /*#__PURE__*/React.createElement("th", null, "Source"), /*#__PURE__*/React.createElement("th", null, "Severity"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, alerts.map(function (alert) {
    return /*#__PURE__*/React.createElement("tr", {
      key: alert.id
    }, /*#__PURE__*/React.createElement("td", null, formatDateTime(alert.timestamp)), /*#__PURE__*/React.createElement("td", {
      className: "font-black"
    }, alert.type), /*#__PURE__*/React.createElement("td", null, alert.source), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: cx("rounded-md border px-2 py-1 text-xs font-black", SEVERITY_META[alert.severity])
    }, alert.severity)), /*#__PURE__*/React.createElement("td", null, alert.status));
  }))));
}
function SystemCard(_ref33) {
  var label = _ref33.label,
    value = _ref33.value,
    detail = _ref33.detail,
    status = _ref33.status,
    icon = _ref33.icon;
  return /*#__PURE__*/React.createElement("div", {
    className: "soft-panel p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 flex items-start justify-between gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-black text-neutral-950"
  }, label), /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    className: "h-4 w-4 text-neutral-500"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(StatusDot, {
    status: status
  }), /*#__PURE__*/React.createElement("strong", {
    className: "text-sm font-black"
  }, value)), /*#__PURE__*/React.createElement("p", {
    className: "mt-2 text-xs text-neutral-500"
  }, detail));
}
function LogsPage(_ref34) {
  var snapshot = _ref34.snapshot,
    alerts = _ref34.alerts;
  var systemCards = [{
    label: "MQTT status",
    value: "Mock Connected",
    detail: "topic bubo/strap/001",
    status: "Safe",
    icon: "message-square-dot"
  }, {
    label: "WebSocket status",
    value: "Mock Live",
    detail: "1.5 s simulated push",
    status: "Safe",
    icon: "radio-tower"
  }, {
    label: "Backend/API status",
    value: "Flask Ready",
    detail: "ready for FastAPI/Node bridge",
    status: "Safe",
    icon: "server"
  }, {
    label: "Database status",
    value: "Mock Mode",
    detail: "in-memory prototype log",
    status: "Warning",
    icon: "database"
  }, {
    label: "Camera stream status",
    value: snapshot.camera.rtsp_status,
    detail: "CAM-01 RTSP bridge",
    status: snapshot.camera.status === "Online" ? "Safe" : "Offline",
    icon: "cctv"
  }, {
    label: "Packet loss",
    value: "".concat(snapshot.packetLoss, "%"),
    detail: "telemetry estimate",
    status: snapshot.packetLoss < 2 ? "Safe" : "Warning",
    icon: "activity"
  }, {
    label: "End-to-end latency",
    value: snapshot.latency ? "".concat(snapshot.latency, " ms") : "Offline",
    detail: "sensor to dashboard",
    status: snapshot.latency ? "Safe" : "Offline",
    icon: "timer"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "content-grid"
  }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "Logs & System",
    title: "Alert log",
    right: /*#__PURE__*/React.createElement(ActionButton, {
      icon: "download",
      variant: "secondary",
      onClick: function onClick() {
        return exportAlertsCsv(alerts);
      }
    }, "Export CSV")
  }), /*#__PURE__*/React.createElement(AlertTable, {
    alerts: alerts
  })), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "System health",
    title: "Prototype service status"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-3 md:grid-cols-2 xl:grid-cols-4"
  }, systemCards.map(function (card) {
    return /*#__PURE__*/React.createElement(SystemCard, _objectSpread({
      key: card.label
    }, card));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4 xl:grid-cols-3"
  }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "Device status",
    title: "BUBO-001"
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Online/offline",
    value: snapshot.device.online_status
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Battery",
    value: "".concat(snapshot.device.battery, "%")
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Last payload",
    value: formatDateTime(snapshot.device.last_payload)
  })), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "Camera status",
    title: "CAM-01"
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "Online/offline",
    value: snapshot.camera.status
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "FPS",
    value: snapshot.camera.fps
  }), /*#__PURE__*/React.createElement(DataRow, {
    label: "RTSP status",
    value: snapshot.camera.rtsp_status
  })), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "Access point status",
    title: "AP-01 to AP-03"
  }), snapshot.accessPoints.map(function (ap) {
    return /*#__PURE__*/React.createElement(DataRow, {
      key: ap.id,
      label: "".concat(ap.name, " online/offline"),
      value: ap.status
    });
  }))));
}
function Toast(_ref35) {
  var message = _ref35.message;
  if (!message) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed bottom-4 right-4 z-50 rounded-md border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm font-black text-white shadow-panel"
  }, message);
}
function App() {
  var _useState = useState("home"),
    _useState2 = _slicedToArray(_useState, 2),
    activePage = _useState2[0],
    setActivePage = _useState2[1];
  var _useState3 = useState(0),
    _useState4 = _slicedToArray(_useState3, 2),
    tick = _useState4[0],
    setTick = _useState4[1];
  var _useState5 = useState(new Date()),
    _useState6 = _slicedToArray(_useState5, 2),
    clock = _useState6[0],
    setClock = _useState6[1];
  var _useState7 = useState(seedHistory),
    _useState8 = _slicedToArray(_useState7, 2),
    history = _useState8[0],
    setHistory = _useState8[1];
  var _useState9 = useState(seedAlerts),
    _useState0 = _slicedToArray(_useState9, 2),
    alerts = _useState0[0],
    setAlerts = _useState0[1];
  var _useState1 = useState(""),
    _useState10 = _slicedToArray(_useState1, 2),
    toast = _useState10[0],
    setToast = _useState10[1];
  var _useState11 = useState(null),
    _useState12 = _slicedToArray(_useState11, 2),
    streamStatus = _useState12[0],
    setStreamStatus = _useState12[1];
  var lastScenarioRef = useRef("safe");
  var snapshot = useMemo(function () {
    return buildSnapshot(tick);
  }, [tick]);
  useEffect(function () {
    var timer = setInterval(function () {
      setTick(function (current) {
        return current + 1;
      });
      setClock(new Date());
    }, 1500);
    return function () {
      return clearInterval(timer);
    };
  }, []);
  useEffect(function () {
    var alive = true;
    function loadStreamStatus() {
      return _loadStreamStatus.apply(this, arguments);
    }
    function _loadStreamStatus() {
      _loadStreamStatus = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var response, data, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return fetch("/api/status", {
                cache: "no-store"
              });
            case 1:
              response = _context.v;
              _context.n = 2;
              return response.json();
            case 2:
              data = _context.v;
              if (alive) {
                setStreamStatus(data);
              }
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
              if (alive) {
                setStreamStatus({
                  status: "offline",
                  fps: 0,
                  last_error: "Dashboard cannot reach the Flask RTSP bridge."
                });
              }
            case 4:
              return _context.a(2);
          }
        }, _callee, null, [[0, 3]]);
      }));
      return _loadStreamStatus.apply(this, arguments);
    }
    loadStreamStatus();
    var timer = setInterval(loadStreamStatus, 1500);
    return function () {
      alive = false;
      clearInterval(timer);
    };
  }, []);
  useEffect(function () {
    setHistory(function (current) {
      return [].concat(_toConsumableArray(current.slice(-23)), [{
        time: formatClock(new Date(snapshot.updated_at)),
        bpm: snapshot.health.heart_rate,
        spo2: snapshot.health.spo2
      }]);
    });
    if (snapshot.scenarioKey !== lastScenarioRef.current) {
      var nextAlert = alertFromScenario(snapshot);
      if (nextAlert) {
        setAlerts(function (current) {
          return [nextAlert].concat(_toConsumableArray(current)).slice(0, 12);
        });
      }
      lastScenarioRef.current = snapshot.scenarioKey;
    }
  }, [snapshot.updated_at, snapshot.health.heart_rate, snapshot.health.spo2, snapshot.scenarioKey]);
  useEffect(function () {
    if (window.lucide) {
      window.lucide.createIcons({
        attrs: {
          "stroke-width": 1.8
        }
      });
    }
  });
  useEffect(function () {
    if (!toast) return undefined;
    var timeout = setTimeout(function () {
      return setToast("");
    }, 2400);
    return function () {
      return clearTimeout(timeout);
    };
  }, [toast]);
  function handleAction(label) {
    if (label === "Acknowledge Alert") {
      setAlerts(function (current) {
        return current.map(function (alert, index) {
          return index === 0 && alert.status === "New" ? _objectSpread(_objectSpread({}, alert), {}, {
            status: "Acknowledged"
          }) : alert;
        });
      });
      setToast("Latest alert acknowledged");
      return;
    }
    if (label === "Mark as Resolved") {
      setAlerts(function (current) {
        return current.map(function (alert, index) {
          return index === 0 ? _objectSpread(_objectSpread({}, alert), {}, {
            status: "Resolved"
          }) : alert;
        });
      });
      setToast("Latest alert marked as resolved");
      return;
    }
    if (label === "Trigger Vibration") {
      var event = {
        id: "A-".concat(Date.now().toString().slice(-5)),
        type: "Vibration Triggered",
        source: "BUBO-001",
        severity: "Low",
        timestamp: new Date().toISOString(),
        status: "Acknowledged"
      };
      setAlerts(function (current) {
        return [event].concat(_toConsumableArray(current)).slice(0, 12);
      });
    }
    setToast("".concat(label, " queued for ").concat(snapshot.worker.id));
  }
  var pages = {
    home: /*#__PURE__*/React.createElement(HomePage, {
      snapshot: snapshot,
      alerts: alerts,
      streamStatus: streamStatus,
      onNavigate: setActivePage
    }),
    cctv: /*#__PURE__*/React.createElement(CctvPage, {
      snapshot: snapshot,
      streamStatus: streamStatus,
      onAction: handleAction,
      onNavigate: setActivePage
    }),
    worker: /*#__PURE__*/React.createElement(WorkerDetailPage, {
      snapshot: snapshot,
      history: history,
      onAction: handleAction,
      onNavigate: setActivePage
    }),
    location: /*#__PURE__*/React.createElement(LocationPage, {
      snapshot: snapshot
    }),
    logs: /*#__PURE__*/React.createElement(LogsPage, {
      snapshot: snapshot,
      alerts: alerts
    })
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app-shell"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    activePage: activePage,
    onNavigate: setActivePage,
    snapshot: snapshot
  }), /*#__PURE__*/React.createElement("main", {
    className: "main-surface"
  }, /*#__PURE__*/React.createElement(Header, {
    snapshot: snapshot,
    clock: clock
  }), pages[activePage]), /*#__PURE__*/React.createElement(Toast, {
    message: toast
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));