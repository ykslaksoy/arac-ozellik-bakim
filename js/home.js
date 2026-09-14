/** Kilitli dikey ana sayfa — metrik, demo garaj, ikon kimliği. */

import {
  currentYearMonth,
  inYearMonth,
  litersPer100km,
  sumField,
  toNumber,
} from "./logic.js";

/**
 * Renault Megane III Phase 2/3 Sport Tourer — parçalı (segmented) ön kaput.
 * Orbit dosyaları `assets/orbit-m3-*.png` (eski hero-megane-* ile senkron).
 */
export const DEFAULT_HERO_SRC = "assets/orbit-m3-1-front-right.png";
export const DEMO_MEGANE_YEAR = "2012";
/** Varsayılan: parçalı kaputlu ön-sağ 3/4. */
export const DEFAULT_HERO_INDEX = 1;
/**
 * Saat yönü turntable (yukarıdan bakınca):
 * ön → ön-sağ → sağ → arka-sağ → arka → arka-sol → sol → ön-sol → (ön).
 * Sağ ok / sola kaydırma = +1.
 */
export const DEFAULT_HERO_GALLERY = [
  { id: "front", src: "assets/orbit-m3-0-front.png" },
  { id: "right-three-quarter", src: "assets/orbit-m3-1-front-right.png" },
  { id: "right-side", src: "assets/orbit-m3-2-right.png" },
  { id: "rear-right-quarter", src: "assets/orbit-m3-3-rear-right.png" },
  { id: "rear", src: "assets/orbit-m3-4-rear.png" },
  { id: "rear-left-quarter", src: "assets/orbit-m3-5-rear-left.png" },
  { id: "left-side", src: "assets/orbit-m3-6-left.png" },
  { id: "left-three-quarter", src: "assets/orbit-m3-7-front-left.png" },
];
export const HERO_LEFT_IDS = ["rear-left-quarter", "left-side", "left-three-quarter"];
export const HERO_ORBIT_IDS = DEFAULT_HERO_GALLERY.map((slide) => slide.id);
export const HERO_PLATE = "34 MKB 421";
export const HINT_KEY = "aob-rotate-hint";
export const OBD_PILL = {
  connected: false,
  label: "Bağlı değil",
  overlay: false,
  ring: false,
};

export const HOME_ACTIONS_TOP = [
  { id: "tara", label: "Tara", href: "#/tara", icon: "scan" },
  { id: "yakit", label: "Yakıt", href: "#/yakit", icon: "fuel" },
  { id: "masraf", label: "Masraf", href: "#/masraf", icon: "card" },
  { id: "ozet", label: "Özet", href: "#/ozet", icon: "gauge" },
];

export const HOME_ACTIONS_BOTTOM = [
  { id: "bakim", label: "Bakım", href: "#/bakim", icon: "dipstick" },
  { id: "ariza", label: "Arıza", href: "#/ariza", icon: "chassis" },
  { id: "gizli", label: "Gizli özellik", href: "#/gizli", icon: "lock" },
  { id: "ekspertiz", label: "Ekspertiz", href: "#/ekspertiz", icon: "list" },
];

export const TAB_ITEMS = [
  { id: "home", label: "Ana sayfa", href: "#/", route: "/", icon: "home" },
  { id: "cars", label: "Araçlarım", href: "#/araclar", route: "/araclar", icon: "car", badge: true },
  { id: "reminders", label: "Hatırlatıcı", href: "#/hatirlaticilar", route: "/hatirlaticilar", icon: "bell" },
  { id: "perf", label: "Performans", href: "#/performans", route: "/performans", icon: "chart" },
  { id: "settings", label: "Ayarlar", href: "#/ayarlar", route: "/ayarlar", icon: "sliders" },
];

export function demoState(now = new Date()) {
  const ym = currentYearMonth(now);
  return {
    vehicles: [
      {
        id: "demo-megane",
        plaka: HERO_PLATE,
        marka: "Renault",
        model: "Megane 3 SW",
        yil: DEMO_MEGANE_YEAR,
        yakit: "Dizel",
        km: 12540,
        renk: "Beyaz",
        motor: "",
        sasi: "",
        foto: "",
      },
      {
        id: "demo-clio",
        plaka: "06 YKS 34",
        marka: "Renault",
        model: "Clio",
        yil: "2018",
        yakit: "Benzin",
        km: 42000,
        renk: "Gri",
        motor: "",
        sasi: "",
        foto: "",
      },
    ],
    fuels: [
      {
        id: "df1",
        vehicleId: "demo-megane",
        tarih: `${ym}-02`,
        km: 11584,
        litre: 32.4,
        /* ~güncel motorin × litre; canlı fiyat gelince applyPumpPricesToDemoFuels günceller */
        ucret: 2826,
        not: "Pompa ~87,22 TL/L",
      },
      {
        id: "df2",
        vehicleId: "demo-megane",
        tarih: `${ym}-18`,
        km: 12140,
        litre: 31.8,
        ucret: 2774,
        not: "Pompa ~87,22 TL/L",
      },
    ],
    expenses: [
      { id: "de1", vehicleId: "demo-megane", tarih: `${ym}-04`, kalem: "Sigorta", ucret: 920, km: "", not: "" },
      { id: "de2", vehicleId: "demo-megane", tarih: `${ym}-08`, kalem: "Otopark", ucret: 780, km: "", not: "" },
      { id: "de3", vehicleId: "demo-megane", tarih: `${ym}-12`, kalem: "Yıkama", ucret: 650, km: "", not: "" },
      { id: "de4", vehicleId: "demo-megane", tarih: `${ym}-20`, kalem: "Köprü / otoyol", ucret: 480, km: "", not: "" },
    ],
    maintenances: [
      {
        id: "dm1",
        vehicleId: "demo-megane",
        tur: "Yağ",
        tarih: `${ym}-01`,
        km: 12540,
        ucret: "",
        sonrakiTarih: "",
        sonrakiKm: 27540,
        not: "",
      },
    ],
    reminders: [],
  };
}

export function maybeSeedDemo(state, persistFn) {
  if (state.vehicles.length) return state;
  const seeded = demoState();
  Object.assign(state, seeded);
  persistFn?.(state);
  return state;
}

export function userHeroPhotos(vehicle) {
  const extras = [];
  if (vehicle?.foto) extras.push(vehicle.foto);
  if (Array.isArray(vehicle?.fotos)) {
    for (const src of vehicle.fotos) {
      if (src) extras.push(src);
    }
  }
  return [...new Set(extras)];
}

export function heroSlides(vehicle) {
  return [...DEFAULT_HERO_GALLERY.map((slide) => slide.src), ...userHeroPhotos(vehicle)];
}

/** First/last clones so wrap-around never shows an empty frame. */
export function loopedHeroSlides(slides) {
  if (!slides.length) return [];
  if (slides.length === 1) return [slides[0]];
  return [slides[slides.length - 1], ...slides, slides[0]];
}

export function heroTrackOffset(logicalIndex, length) {
  if (length <= 1) return 0;
  return -(clampHeroIndex(logicalIndex, length) + 1) * 100;
}

export function clampHeroIndex(index, length) {
  if (!length) return 0;
  const n = Number(index);
  if (!Number.isFinite(n)) return 0;
  return ((Math.trunc(n) % length) + length) % length;
}

export function nextHeroIndex(index, length, delta = 1) {
  return clampHeroIndex((Number(index) || 0) + delta, length);
}

/** Sağ ok / sola kaydırma (+1) ile gelen sonraki galeri id'leri. */
export function dragRightHeroIds(fromIndex = DEFAULT_HERO_INDEX) {
  const n = DEFAULT_HERO_GALLERY.length;
  return [1, 2].map((delta) => DEFAULT_HERO_GALLERY[nextHeroIndex(fromIndex, n, delta)].id);
}

export function heroVisualIndex(logicalIndex, length) {
  if (length <= 1) return 0;
  return clampHeroIndex(logicalIndex, length) + 1;
}

export function heroImageSrc(vehicle, index = DEFAULT_HERO_INDEX) {
  const slides = heroSlides(vehicle);
  if (!slides.length) return DEFAULT_HERO_SRC;
  return slides[clampHeroIndex(index, slides.length)];
}

/** Hero üzerinde model / yıl / motor / EDC yazılmaz. */
export function heroCaptionHidden() {
  return true;
}

export function homeVehicle(state, preferredId) {
  if (preferredId) {
    const found = state.vehicles.find((v) => v.id === preferredId);
    if (found) return found;
  }
  return (
    state.vehicles.find((v) => v.plaka === HERO_PLATE) ||
    state.vehicles[0] ||
    null
  );
}

export function homeMetrics(state, now = new Date()) {
  const ym = currentYearMonth(now);
  const vehicle = homeVehicle(state);
  const fuels = vehicle
    ? state.fuels.filter((row) => row.vehicleId === vehicle.id)
    : state.fuels;
  const expenses = vehicle
    ? state.expenses.filter((row) => row.vehicleId === vehicle.id)
    : state.expenses;
  const maintenances = vehicle
    ? state.maintenances.filter((row) => row.vehicleId === vehicle.id)
    : state.maintenances;

  const monthFuels = fuels.filter((row) => inYearMonth(row.tarih, ym));
  const monthExpenses = expenses.filter((row) => inYearMonth(row.tarih, ym));
  const lastService = [...maintenances].sort((a, b) => {
    const km = (toNumber(b.km) ?? 0) - (toNumber(a.km) ?? 0);
    if (km) return km;
    return String(b.tarih || "").localeCompare(String(a.tarih || ""));
  })[0];

  const lastKm = toNumber(lastService?.km) ?? toNumber(vehicle?.km);
  const nextKm = toNumber(lastService?.sonrakiKm);
  const remaining = lastKm != null && nextKm != null ? nextKm - lastKm : null;

  return {
    fuelCost: sumField(monthFuels, "ucret"),
    fuelLitres: sumField(monthFuels, "litre"),
    expenseCost: sumField(monthExpenses, "ucret"),
    expenseCount: monthExpenses.length,
    consumption: litersPer100km(fuels),
    lastServiceKm: lastKm,
    remainingKm: remaining,
    vehicleCount: state.vehicles.length,
  };
}

export function formatWholeTl(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `${Math.round(Number(value)).toLocaleString("tr-TR")} TL`;
}

export function formatLitres(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `${Number(value).toLocaleString("tr-TR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} L`;
}

export function formatKm(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `${Math.round(Number(value)).toLocaleString("tr-TR")} km`;
}

export function formatRemainingKm(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `${Math.round(Number(value)).toLocaleString("tr-TR")} kaldı`;
}

export function metricCards(metrics, options = {}) {
  const fuelHintParts = [formatLitres(metrics.fuelLitres)];
  if (options.pumpHint) fuelHintParts.push(options.pumpHint);
  return [
    {
      id: "fuel",
      label: "Bu ay yakıt",
      value: formatWholeTl(metrics.fuelCost),
      hint: fuelHintParts.join(" · "),
    },
    {
      id: "expense",
      label: "Bu ay masraf",
      value: formatWholeTl(metrics.expenseCost),
      hint: `${metrics.expenseCount} işlem`,
    },
    {
      id: "avg",
      label: "Ort L/100",
      value: formatLitres(metrics.consumption),
      hint: "Uzun dönem",
    },
    {
      id: "service",
      label: "Son bakım km",
      value: formatKm(metrics.lastServiceKm),
      hint: formatRemainingKm(metrics.remainingKm),
    },
  ];
}

export function tabActive(path, route) {
  if (route === "/") return path === "/";
  return path === route;
}

export const ICONS = {
  /* Üst aksiyon — logo-icon-reference: dolgu + çizgi, iki ton */
  /* Tara: köşe çerçeve (referans) */
  scan: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 3.8H5.4A1.6 1.6 0 0 0 3.8 5.4V8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M16 3.8h2.6A1.6 1.6 0 0 1 20.2 5.4V8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M20.2 16v2.6a1.6 1.6 0 0 1-1.6 1.6H16" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M3.8 16v2.6A1.6 1.6 0 0 0 5.4 20.2H8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  fuel: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.2 4.4h5.1c.9 0 1.65.65 1.82 1.53L15.1 11H6.9l.9-5.07A1.85 1.85 0 0 1 7.2 4.4Z" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9.7 11v7.4" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/><path d="M14.2 11.2v2.1c0 1.15.62 2.2 1.62 2.7l2.05 1.05" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M15.5 7.1c1.15.5 2.05 1.2 2.7 2.15" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5.6 16.1c.85-1.55 2.75-2.05 4.2-1 .7.5 1.15 1.3 1.15 2.2" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M4.3 18.6c.75 1.05 1.9 1.55 3.15 1.4" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M3.7 16.6c-.6.4-1.05 1-1.2 1.7" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/></svg>`,
  /* Masraf: kart + çip + kabartma çizgileri */
  card: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.9" y="5.8" width="18.2" height="12.4" rx="2.3" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.55"/><path d="M2.9 9.4h18.2" stroke="currentColor" stroke-width="1.7"/><rect x="5.1" y="11.7" width="3.5" height="2.45" rx=".5" fill="currentColor" fill-opacity=".42"/><path d="M11.2 12.4h6.4M11.2 14.4h4.6M11.2 16.4h5.2" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" opacity=".55"/></svg>`,
  /* Özet: pasta + % (referans) */
  gauge: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="1.55"/><path d="M12 4a8 8 0 0 1 8 8h-8V4Z" fill="currentColor" fill-opacity=".42"/><path d="M12 12 18.2 15.6A8 8 0 0 1 12 20V12Z" fill="currentColor" fill-opacity=".22"/><text x="8.2" y="13.35" fill="currentColor" font-size="5.2" font-weight="700" font-family="system-ui,sans-serif">%</text></svg>`,
  /* Bakım: anahtar + tornavida */
  dipstick: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.2 4.6 19.4 9.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M16.05 6.45 8.2 14.3l-1.55 4.05 4.05-1.55 7.85-7.85" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><path d="M17.7 8.1 15.9 9.9" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/><path d="M6.2 5.2 12.6 11.6" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/><path d="M5.1 4.1c1.1-.05 2 .7 2.15 1.75L4.9 8.2C3.85 8.05 3.1 7.15 3.15 6.05A1.9 1.9 0 0 1 5.1 4.1Z" fill="currentColor" fill-opacity=".28" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/><path d="M11.4 12.8 13 14.4" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/></svg>`,
  /* Arıza: motor + kalkan ✓ */
  chassis: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.8 10.3h11.2" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><path d="M5.1 10.3V8.1h8.6v2.2" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><path d="M5.8 13.6h8.2M6.6 10.3v3.3M9.7 10.3v3.3M12.8 10.3v3.3" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M6.2 13.6 5.2 16.2M13.4 13.6 14.4 16.2M7.6 16.2h5.4" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M16.2 13.5h2.25a1.7 1.7 0 0 1 1.7 1.7v1.85c0 .45-.22.87-.58 1.12l-2.25 1.25-2.25-1.25a1.35 1.35 0 0 1-.58-1.12V15.2a1.7 1.7 0 0 1 1.7-1.7Z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M16.85 16.55 17.7 17.45 19.15 15.85" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4.8" y="9.6" width="11" height="9" rx="2.1" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.55"/><path d="M7.4 9.6V7.3a3.4 3.4 0 0 1 6.8 0v2.3" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><circle cx="10.3" cy="14.3" r="1.15" fill="currentColor" fill-opacity=".45"/><path d="M10.3 15.2v1.7" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/><circle cx="18.1" cy="17.5" r="3.35" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="1.4"/><path d="M18.1 15.9v3.2M16.5 17.5h3.2" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/></svg>`,
  list: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.6 3.9h8.8A1.7 1.7 0 0 1 18.1 5.6v13.3a1.7 1.7 0 0 1-1.7 1.7H7.6a1.7 1.7 0 0 1-1.7-1.7V5.6A1.7 1.7 0 0 1 7.6 3.9Z" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.5"/><path d="M9.1 3.2h5.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M8.5 9.6 9.8 10.9 12.5 8.2M8.5 13.7 9.8 15 12.5 12.3M8.5 17.8 9.8 19.1 12.5 16.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.2 10.1h2.4M14.2 14.2h2.4M14.2 18.2h2.4" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/></svg>`,
  /* Alt nav — ince çizgi (referans) */
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.8 11.2 12 4.2l8.2 7"/><path d="M6.6 10.4V19.2h10.8v-8.8"/><path d="M10 19.2v-5.2h4v5.2"/></svg>`,
  car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.2 10.2 8.6 7.4h6.8l1.4 2.8"/><path d="M5.4 13.2h13.2"/><path d="M6.2 13.2 5.2 16.6h13.6l-1-3.4"/><path d="M8.2 16.6v1.7M15.8 16.6v1.7"/><path d="M9.2 10.2h5.6"/><circle cx="8.2" cy="13.2" r=".7" fill="currentColor"/><circle cx="15.8" cy="13.2" r=".7" fill="currentColor"/><path d="M10.6 14.6h2.8"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.4 15.8V10.6a5.6 5.6 0 0 1 11.2 0v5.2"/><path d="M5.2 15.8h13.6"/><path d="M10.4 18.2a1.6 1.6 0 0 0 3.2 0"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.8 18.2h16.4"/><path d="M5.6 14.2 9.8 9.8l3.2 2.6L18.6 6"/><path d="M15.8 6h2.8v2.8"/></svg>`,
  sliders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.05"/><path d="M12 3.6v2.15M12 18.25V20.4M4.7 7l1.52 1.52M17.78 15.48 19.3 17M3.6 12h2.15M18.25 12H20.4M4.7 17l1.52-1.52M17.78 8.52 19.3 7"/><path d="M12 8.95a3.05 3.05 0 1 1 0 6.1 3.05 3.05 0 0 1 0-6.1Z" fill="currentColor" fill-opacity=".08"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.2 8.2h2.8l1.35-1.7h7.3l1.35 1.7h2.8a1.1 1.1 0 0 1 1.1 1.1v8.4a1.1 1.1 0 0 1-1.1 1.1H4.2a1.1 1.1 0 0 1-1.1-1.1v-8.4a1.1 1.1 0 0 1 1.1-1.1z"/><circle cx="12" cy="13.2" r="3"/></svg>`,
  bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.2 17.6h5.6"/><path d="M10.2 20.2h3.6"/><path d="M8.2 14.6a5.8 5.8 0 1 1 7.6 0c-.7.7-1.1 1.45-1.2 2.25H9.4c-.1-.8-.5-1.55-1.2-2.25z"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 6.5 9 12l5.5 5.5"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 6.5 15 12l-5.5 5.5"/></svg>`,
};

export function iconSvg(name) {
  return ICONS[name] || "";
}
