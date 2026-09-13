/** Kilitli dikey ana sayfa — metrik, demo garaj, ikon kimliği. */

import {
  currentYearMonth,
  inYearMonth,
  litersPer100km,
  sumField,
  toNumber,
} from "./logic.js";

export const DEFAULT_HERO_SRC = "assets/hero-megane.png";
/** Repodaki doğru Megane 3 (paneled/segmented kaput, Phase 2 SW). */
export const DEMO_MEGANE_YEAR = "2012";
/** Varsayılan: parçalı kaputlu ön-sağ 3/4. */
export const DEFAULT_HERO_INDEX = 1;
/**
 * Saat yönü turntable (yukarıdan):
 * ön → ön-sağ → sağ → arka-sağ → arka → arka-sol → sol → ön-sol → (ön).
 * Sağ ok / sola kaydırma = +1.
 */
export const DEFAULT_HERO_GALLERY = [
  { id: "front", src: "assets/hero-megane-front.png" },
  { id: "right-three-quarter", src: "assets/hero-megane.png" },
  { id: "right-side", src: "assets/hero-megane-right.png" },
  { id: "rear-right-quarter", src: "assets/hero-megane-rear-right-q.png" },
  { id: "rear", src: "assets/hero-megane-rear.png" },
  { id: "rear-left-quarter", src: "assets/hero-megane-rear-left-q.png" },
  { id: "left-side", src: "assets/hero-megane-left.png" },
  { id: "left-three-quarter", src: "assets/hero-megane-left-q.png" },
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
        litre: 30.6,
        ucret: 625,
        not: "",
      },
      {
        id: "df2",
        vehicleId: "demo-megane",
        tarih: `${ym}-18`,
        km: 12062,
        litre: 30.6,
        ucret: 625,
        not: "",
      },
    ],
    expenses: [
      { id: "de1", vehicleId: "demo-megane", tarih: `${ym}-04`, kalem: "Sigorta", ucret: 800, km: "", not: "" },
      { id: "de2", vehicleId: "demo-megane", tarih: `${ym}-08`, kalem: "Otopark", ucret: 700, km: "", not: "" },
      { id: "de3", vehicleId: "demo-megane", tarih: `${ym}-12`, kalem: "Yıkama", ucret: 580, km: "", not: "" },
      { id: "de4", vehicleId: "demo-megane", tarih: `${ym}-20`, kalem: "Köprü / otoyol", ucret: 400, km: "", not: "" },
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

export function metricCards(metrics) {
  return [
    {
      id: "fuel",
      label: "Bu ay yakıt",
      value: formatWholeTl(metrics.fuelCost),
      hint: formatLitres(metrics.fuelLitres),
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
  /* Üst aksiyon — referans: dolgulu iki ton ikonlar */
  scan: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.2 4.2H5.2A1.2 1.2 0 0 0 4 5.4v2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M16.8 4.2h2A1.2 1.2 0 0 1 20 5.4v2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M20 16.6v2A1.2 1.2 0 0 1 18.8 19.8h-2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M4 16.6v2A1.2 1.2 0 0 0 5.2 19.8h2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M8.2 12h7.6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M9.4 9.2c1.5-1.2 3.7-1.2 5.2 0" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" opacity=".55"/><path d="M10.2 14.8c1.1 1 2.5 1 3.6 0" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" opacity=".55"/></svg>`,
  fuel: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.6 4.2h4.2c.85 0 1.55.6 1.72 1.42L15.6 10.2H7.9l1-4.58A1.75 1.75 0 0 1 8.6 4.2Z" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/><path d="M10.4 10.2v7.2" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/><path d="M14.2 10.2v2.4c0 1.05.55 2 1.5 2.45l1.85.9" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><path d="M15.5 7.4c1.05.55 1.9 1.25 2.55 2.1" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/><path d="M6.6 16.4c.7-1.35 2.35-1.85 3.7-1.05.9.55 1.35 1.45 1.35 2.4" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M5.3 18.7c.7.95 1.75 1.45 2.9 1.35" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M4.6 16.8c-.55.35-1 .9-1.15 1.55" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/></svg>`,
  card: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.2" y="6.2" width="17.6" height="11.6" rx="2.2" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.55"/><path d="M3.2 9.6h17.6" stroke="currentColor" stroke-width="1.7"/><rect x="5.4" y="11.8" width="3.2" height="2.2" rx=".45" fill="currentColor" fill-opacity=".35"/><circle cx="15.6" cy="14.6" r="1.35" fill="currentColor" fill-opacity=".28"/><circle cx="17.4" cy="14.6" r="1.35" fill="currentColor" fill-opacity=".45"/></svg>`,
  gauge: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12.2" r="7.2" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.55"/><path d="M12 12.2 16.6 8.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M12 5V7.2M5.8 12.2H8M12 17.2v2M16 12.2h2.2" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" opacity=".7"/><path d="M16.8 5.1v2.1M15.7 6.15h2.2" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/></svg>`,
  /* Alt aksiyon */
  dipstick: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.4 16.2 15.2 9.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M13.9 8.1 16.7 5.3a1.35 1.35 0 0 1 1.9 0l.7.7a1.35 1.35 0 0 1 0 1.9L16.5 10.7" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><path d="M10.1 17.3 7.3 20.1a1.35 1.35 0 0 1-1.9 0l-.7-.7a1.35 1.35 0 0 1 0-1.9L7.7 14.7" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><path d="M7.6 8.8 15.4 16.6" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><path d="M7 8.1 5.3 6.4M16.8 17.5 18.5 19.2" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/></svg>`,
  chassis: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.6 10.2h10.8" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><path d="M5.8 10.2V8.2h8.4v2" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><path d="M6.4 13.4h7.8M7.2 10.2v3.2M10.2 10.2v3.2M13.2 10.2v3.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M6.8 13.4 5.8 15.8M13.8 13.4 14.8 15.8M8.2 15.8h5.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M16.4 14.2h2.1a1.55 1.55 0 0 1 1.55 1.55v1.7c0 .4-.2.78-.52 1.02l-2.1 1.15-2.1-1.15a1.25 1.25 0 0 1-.53-1.02v-1.7A1.55 1.55 0 0 1 16.4 14.2Z" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><path d="M17.95 15.7v2.5M17.95 19v.25" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5.6" y="10" width="10.2" height="8.4" rx="2" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.55"/><path d="M8 10V7.8a3.1 3.1 0 0 1 6.2 0V10" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><circle cx="18" cy="17.4" r="3.15" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="1.45"/><path d="M18 15.9v3M16.55 17.4H19.45" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/></svg>`,
  list: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.8 4.4h9.2A1.6 1.6 0 0 1 18.6 6v12.6a1.6 1.6 0 0 1-1.6 1.6H7.8A1.6 1.6 0 0 1 6.2 18.6V6A1.6 1.6 0 0 1 7.8 4.4Z" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.5"/><path d="M9.2 3.7h6.4" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/><path d="M8.8 10 10 11.2 12.5 8.7M8.8 14 10 15.2 12.5 12.7M8.8 18 10 19.2 12.5 16.7" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 10.4h2.5M14 14.4h2.5M14 18.3h2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  /* Alt nav — ince çizgi */
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11 12 4l8 7"/><path d="M7 10.2V19h10v-8.8"/></svg>`,
  car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.2 14.8h13.6"/><path d="M7 14.8 8.2 11.2A2.1 2.1 0 0 1 10.2 9.8h3.6a2.1 2.1 0 0 1 2 1.4L17 14.8"/><circle cx="8.2" cy="16.5" r="1.2"/><circle cx="15.8" cy="16.5" r="1.2"/><path d="M9.4 11.4h5.2"/><path d="M8.6 9.8 9.5 7.8h5l.9 2"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 16V11a5.5 5.5 0 1 1 11 0v5"/><path d="M5.5 16h13"/><path d="M10.5 18.4a1.5 1.5 0 0 0 3 0"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 18h16"/><path d="M6 14.5 10 10l3 2.5 5.5-6"/><path d="M16.2 6.5h2.8v2.8"/></svg>`,
  sliders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.1"/><path d="M12 3.8v2.2M12 18v2.2M4.9 7.1 6.5 8.6M17.5 15.4 19.1 17M3.8 12h2.2M18 12h2.2M4.9 16.9 6.5 15.4M17.5 8.6 19.1 7.1"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.2 8.2h2.8l1.35-1.7h7.3l1.35 1.7h2.8a1.1 1.1 0 0 1 1.1 1.1v8.4a1.1 1.1 0 0 1-1.1 1.1H4.2a1.1 1.1 0 0 1-1.1-1.1v-8.4a1.1 1.1 0 0 1 1.1-1.1z"/><circle cx="12" cy="13.2" r="3"/></svg>`,
  bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.2 17.6h5.6"/><path d="M10.2 20.2h3.6"/><path d="M8.2 14.6a5.8 5.8 0 1 1 7.6 0c-.7.7-1.1 1.45-1.2 2.25H9.4c-.1-.8-.5-1.55-1.2-2.25z"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 6.5 9 12l5.5 5.5"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 6.5 15 12l-5.5 5.5"/></svg>`,
};

export function iconSvg(name) {
  return ICONS[name] || "";
}
