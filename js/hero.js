/** Ana sayfa 2D araç hero — CSS/SVG silüet, foto isteğe bağlı. Three.js yok. */

export const DEFAULT_CAR_COLOR = "#8b949c";

export const RENK_ADI = {
  siyah: "#1c1e21",
  black: "#1c1e21",
  beyaz: "#f4f1ea",
  white: "#f4f1ea",
  gri: "#8b949c",
  gray: "#8b949c",
  grey: "#8b949c",
  gümüş: "#c5ccd3",
  gumus: "#c5ccd3",
  silver: "#c5ccd3",
  antrasit: "#3d444b",
  füme: "#5c6570",
  fume: "#5c6570",
  kırmızı: "#b42318",
  kirmizi: "#b42318",
  red: "#b42318",
  bordo: "#7a1520",
  mavi: "#1d4e89",
  blue: "#1d4e89",
  lacivert: "#16324f",
  navi: "#16324f",
  navy: "#16324f",
  yeşil: "#1f7a4d",
  yesil: "#1f7a4d",
  green: "#1f7a4d",
  sarı: "#d4a017",
  sari: "#d4a017",
  yellow: "#d4a017",
  turuncu: "#c05621",
  orange: "#c05621",
  kahverengi: "#6b3f2a",
  brown: "#6b3f2a",
  bej: "#d8c3a5",
  beige: "#d8c3a5",
  krem: "#efe6d4",
  pembe: "#c4516c",
  pink: "#c4516c",
  mor: "#6b3fa0",
  purple: "#6b3fa0",
  turkuaz: "#1a8a86",
  teal: "#1a8a86",
};

export const RENK_SWATCHES = [
  { label: "Siyah", value: "Siyah" },
  { label: "Beyaz", value: "Beyaz" },
  { label: "Gri", value: "Gri" },
  { label: "Gümüş", value: "Gümüş" },
  { label: "Kırmızı", value: "Kırmızı" },
  { label: "Mavi", value: "Mavi" },
  { label: "Lacivert", value: "Lacivert" },
  { label: "Yeşil", value: "Yeşil" },
];

function clampByte(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((n) => clampByte(n).toString(16).padStart(2, "0")).join("")}`;
}

export function normalizeHex(raw) {
  const s = String(raw || "").trim();
  const short = s.match(/^#([0-9a-f]{3})$/i);
  if (short) {
    return `#${short[1]
      .split("")
      .map((c) => c + c)
      .join("")
      .toLowerCase()}`;
  }
  const full = s.match(/^#([0-9a-f]{6})$/i);
  return full ? `#${full[1].toLowerCase()}` : null;
}

export function hexToRgb(hex) {
  const n = normalizeHex(hex);
  if (!n) return null;
  return {
    r: parseInt(n.slice(1, 3), 16),
    g: parseInt(n.slice(3, 5), 16),
    b: parseInt(n.slice(5, 7), 16),
  };
}

export function mixHex(hex, toward, amount) {
  const a = hexToRgb(hex);
  const b = hexToRgb(toward);
  if (!a || !b) return hex;
  const t = Math.max(0, Math.min(1, amount));
  return rgbToHex(
    a.r + (b.r - a.r) * t,
    a.g + (b.g - a.g) * t,
    a.b + (b.b - a.b) * t,
  );
}

export function luminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;
  return (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
}

function parseColorToken(raw) {
  const s = String(raw || "").trim();
  const hex = normalizeHex(s);
  if (hex) return hex;
  const rgb = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgb) return rgbToHex(Number(rgb[1]), Number(rgb[2]), Number(rgb[3]));
  return null;
}

function normalizeColorName(raw) {
  return String(raw || "")
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function resolveVehicleColor(renk, fallback = DEFAULT_CAR_COLOR) {
  const raw = String(renk || "").trim();
  if (!raw) return fallback;
  const token = parseColorToken(raw);
  if (token) return token;

  const name = normalizeColorName(raw);
  if (RENK_ADI[name]) return RENK_ADI[name];
  const compact = name.replace(/\s+/g, "");
  if (RENK_ADI[compact]) return RENK_ADI[compact];

  const keys = Object.keys(RENK_ADI).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (name.includes(key) || compact.includes(key)) return RENK_ADI[key];
  }
  return fallback;
}

export function carPalette(hex) {
  const body = resolveVehicleColor(hex);
  const light = luminance(body) > 0.62;
  return {
    body,
    hi: mixHex(body, "#ffffff", light ? 0.18 : 0.28),
    lo: mixHex(body, "#0b1014", light ? 0.22 : 0.38),
    glass: light ? "#1b2a36" : "#0d1822",
    glassHi: light ? "#4a6578" : "#2a4154",
    trim: light ? "#2a3138" : "#d7dde3",
    light: "#f3d27a",
    tail: "#e24b4b",
  };
}

export function heroMode(vehicle) {
  return vehicle?.foto ? "photo" : "silhouette";
}

export function heroCaption(vehicle) {
  if (!vehicle) {
    return {
      title: "Garajın",
      meta: "Araç ekleyince silüet marka, renk ve plakaya göre güncellenir.",
    };
  }
  const title = `${vehicle.marka || ""} ${vehicle.model || ""}`.trim() || "Araç";
  const bits = [
    vehicle.plaka,
    vehicle.yil,
    vehicle.yakit,
    vehicle.km ? `${Number(vehicle.km).toLocaleString("tr-TR")} km` : "",
  ].filter(Boolean);
  return { title, meta: bits.join(" · ") || "Özellikleri tamamlayın" };
}

export function applyCarPalette(svg, renk) {
  if (!svg) return carPalette(renk);
  const palette = carPalette(renk);
  svg.style.setProperty("--car-body", palette.body);
  svg.style.setProperty("--car-hi", palette.hi);
  svg.style.setProperty("--car-lo", palette.lo);
  svg.style.setProperty("--car-glass", palette.glass);
  svg.style.setProperty("--car-glass-hi", palette.glassHi);
  svg.style.setProperty("--car-trim", palette.trim);
  svg.style.setProperty("--car-light", palette.light);
  svg.style.setProperty("--car-tail", palette.tail);
  return palette;
}

export function silhouetteMarkup(prefix = "car") {
  const body = `${prefix}-body`;
  const glass = `${prefix}-glass`;
  const wheel = `${prefix}-wheel`;
  return `<svg class="car-svg" viewBox="0 0 860 340" role="img" aria-label="Araç silüeti" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${body}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--car-hi)"/>
      <stop offset="48%" stop-color="var(--car-body)"/>
      <stop offset="100%" stop-color="var(--car-lo)"/>
    </linearGradient>
    <linearGradient id="${glass}" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0%" stop-color="var(--car-glass-hi)"/>
      <stop offset="100%" stop-color="var(--car-glass)"/>
    </linearGradient>
    <radialGradient id="${wheel}" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#4b5158"/>
      <stop offset="55%" stop-color="#1b1f24"/>
      <stop offset="100%" stop-color="#0a0c0e"/>
    </radialGradient>
  </defs>
  <ellipse class="car-shadow" cx="430" cy="304" rx="290" ry="14" fill="rgba(0,0,0,0.38)"/>
  <path fill="url(#${body})" stroke="rgba(8,12,16,0.28)" stroke-width="2" d="M98 210
    C102 186 124 176 160 174
    L250 174 L312 108
    C326 94 346 88 368 86
    L548 84
    C580 84 604 96 624 118
    L680 174 L746 174
    C790 176 816 192 822 216
    L826 230
    C828 244 816 254 798 256
    L710 256
    C700 228 676 212 650 212
    C624 212 600 228 590 256
    L294 256
    C284 228 260 212 234 212
    C208 212 184 228 174 256
    L126 256
    C106 256 94 244 92 228 Z"/>
  <path fill="url(#${glass})" opacity="0.92" d="M322 172 L360 114
    C368 104 384 98 402 97
    L536 96
    C560 96 578 104 592 118
    L640 172 Z"/>
  <path fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="3" d="M430 100 L430 170"/>
  <path fill="none" stroke="rgba(8,12,16,0.2)" stroke-width="2" d="M430 176 L430 248"/>
  <path fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="2" d="M168 196 H742"/>
  <rect x="788" y="196" width="28" height="16" rx="5" fill="var(--car-light)"/>
  <rect x="104" y="198" width="22" height="14" rx="4" fill="var(--car-tail)"/>
  <path fill="var(--car-lo)" d="M300 156 C292 148 276 146 262 152 L254 164 C272 160 292 164 300 172 Z"/>
  <g class="car-wheel" transform="translate(234 248)">
    <circle r="46" fill="url(#${wheel})"/>
    <circle r="22" fill="#9aa3ab"/>
    <circle r="9" fill="#2c333a"/>
  </g>
  <g class="car-wheel" transform="translate(650 248)">
    <circle r="46" fill="url(#${wheel})"/>
    <circle r="22" fill="#9aa3ab"/>
    <circle r="9" fill="#2c333a"/>
  </g>
</svg>`;
}

export function bindHeroTilt(rig, { min = -30, max = 30 } = {}) {
  if (!rig) return () => {};
  let angle = 0;
  let startX = 0;
  let startAngle = 0;
  let dragging = false;
  let dir = Number(rig.dataset.flip || 1);

  const apply = () => {
    rig.style.transform = `scaleX(${dir}) rotateY(${angle}deg)`;
    rig.dataset.flip = String(dir);
  };

  const setAngle = (next) => {
    angle = Math.min(max, Math.max(min, next));
    apply();
  };

  const onDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true;
    startX = e.clientX;
    startAngle = angle;
    rig.classList.add("is-dragging");
    rig.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    if (!dragging) return;
    setAngle(startAngle + (e.clientX - startX) * 0.16);
  };
  const onUp = (e) => {
    if (!dragging) return;
    dragging = false;
    rig.classList.remove("is-dragging");
    try {
      rig.releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
  };
  const onDbl = () => {
    angle = 0;
    apply();
  };

  rig.addEventListener("pointerdown", onDown);
  rig.addEventListener("pointermove", onMove);
  rig.addEventListener("pointerup", onUp);
  rig.addEventListener("pointercancel", onUp);
  rig.addEventListener("dblclick", onDbl);
  apply();

  rig.__flip = () => {
    dir *= -1;
    apply();
  };

  return () => {
    rig.removeEventListener("pointerdown", onDown);
    rig.removeEventListener("pointermove", onMove);
    rig.removeEventListener("pointerup", onUp);
    rig.removeEventListener("pointercancel", onUp);
    rig.removeEventListener("dblclick", onDbl);
  };
}

export function flipHeroRig(rig) {
  if (!rig) return;
  if (typeof rig.__flip === "function") {
    rig.__flip();
    return;
  }
  const dir = Number(rig.dataset.flip || 1) * -1;
  rig.dataset.flip = String(dir);
  rig.style.transform = `scaleX(${dir}) rotateY(0deg)`;
}

export function compressPhoto(file, { maxSize = 960, quality = 0.72 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !String(file.type || "").startsWith("image/")) {
      reject(new Error("Geçerli bir görsel seçin."));
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#111418";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Görsel okunamadı."));
    };
    img.src = url;
  });
}
