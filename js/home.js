/** Kilitli dikey ana sayfa — metrik, demo garaj, ikon kimliği. */

import {
  currentYearMonth,
  inYearMonth,
  litersPer100km,
  sumField,
  toNumber,
} from "./logic.js";

export const DEFAULT_HERO_SRC = "assets/hero-megane.png";
/** Repodaki doğru Megane yılı (facelift Phase 2 / kullanıcı onayı). */
export const DEMO_MEGANE_YEAR = "2012";
export const DEFAULT_HERO_INDEX = 0;
/** L→R sürükleyince (arabayı çevirme): ön-sağ → ön → ön-sol → sol → arka-sol → arka → arka-sağ → sağ. */
export const DEFAULT_HERO_GALLERY = [
  { id: "right-three-quarter", src: "assets/hero-megane.png" },
  { id: "front", src: "assets/hero-megane-front.png" },
  { id: "left-three-quarter", src: "assets/hero-megane-left-q.png" },
  { id: "left-side", src: "assets/hero-megane-left.png" },
  { id: "rear-left-quarter", src: "assets/hero-megane-rear-left-q.png" },
  { id: "rear", src: "assets/hero-megane-rear.png" },
  { id: "rear-right-quarter", src: "assets/hero-megane-rear-right-q.png" },
  { id: "right-side", src: "assets/hero-megane-right.png" },
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

/** Soldan sağa sürükleyince (doğal çevirme) gelen galeri id'leri. */
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
  /* Üst aksiyon — referans screenshot şekilleri */
  scan: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4H5a1 1 0 0 0-1 1v2"/><path d="M17 4h2a1 1 0 0 1 1 1v2"/><path d="M20 17v2a1 1 0 0 1-1 1h-2"/><path d="M4 17v2a1 1 0 0 0 1 1h2"/><path d="M7 12h10"/></svg>`,
  fuel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3.8h3.6c.7 0 1.3.5 1.5 1.2L15.2 10H8.4L9.5 5c.2-.7.8-1.2 1.5-1.2z"/><path d="M10.2 10v6.8"/><path d="M13.6 10v2.6c0 1 .5 1.8 1.4 2.2l1.8.8"/><path d="M14.8 7.6c1 .5 1.8 1.1 2.4 1.9"/><path d="M7.8 17.2c.35-.9 1.1-1.4 2.1-1.4.9 0 1.6.4 2 1.1"/><path d="M6.2 19.2c.55.7 1.35 1.1 2.25 1.1"/><path d="M5.4 16.8c-.45.25-.8.7-1 1.2"/><path d="M4.8 18.6c.45.45 1 .7 1.55.65"/></svg>`,
  card: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.8 9.2 17.2 5.4a1.6 1.6 0 0 1 2 .9l1.5 5.4a1.6 1.6 0 0 1-.9 2L6.4 17.5a1.6 1.6 0 0 1-2-.9L2.9 11.2a1.6 1.6 0 0 1 .9-2z"/><path d="M5.2 11.1h3.2"/><path d="M4.6 13.2h4"/><path d="M14.8 9.8h3.4"/></svg>`,
  gauge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4a8 8 0 1 0 7.5 10.7"/><path d="M12 4v8l6.2 2.4"/><path d="M16.8 5.2v2.2"/><path d="M15.7 6.3h2.2"/></svg>`,
  /* Alt aksiyon */
  dipstick: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.2 15.8 15.5 8.5"/><path d="M14.2 7.2 16.8 4.6c.5-.5 1.3-.5 1.8 0l.8.8c.5.5.5 1.3 0 1.8L16.8 9.8"/><path d="M9.5 17.1 6.9 19.7c-.5.5-1.3.5-1.8 0l-.8-.8c-.5-.5-.5-1.3 0-1.8L7.1 14.5"/><path d="M7.8 8.5 15.5 16.2"/><path d="M7.2 7.9 5.4 6.1"/><path d="M16.6 17.3 18.4 19.1"/></svg>`,
  chassis: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.8 9.8h11.8"/><path d="M6 9.8V7.6h9.4v2.2"/><path d="M6.6 13.2h8.8"/><path d="M7.4 9.8v3.4"/><path d="M10.8 9.8v3.4"/><path d="M14.2 9.8v3.4"/><path d="M7 13.2 5.9 15.8"/><path d="M14.8 13.2 15.9 15.8"/><path d="M8.4 15.8h6"/><path d="M16.6 14.4h2.2a1.5 1.5 0 0 1 1.5 1.5v1.8c0 .4-.2.8-.5 1l-2.2 1.2-2.2-1.2a1.2 1.2 0 0 1-.5-1v-1.8a1.5 1.5 0 0 1 1.5-1.5h.2"/><path d="M18.2 16.2v1.6"/><path d="M18.2 18.6v.2"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="10.2" width="10.5" height="8.6" rx="2"/><path d="M8.4 10.2V8a3.3 3.3 0 0 1 6.6 0v2.2"/><circle cx="18.2" cy="17.6" r="3.1"/><path d="M18.2 16.2v2.8"/><path d="M16.8 17.6h2.8"/></svg>`,
  list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4.5h9.5a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 19V6a1.5 1.5 0 0 1 1.5-1.5z"/><path d="M9.5 3.8h6"/><path d="M9.2 10.2 10.4 11.4 12.8 9"/><path d="M9.2 14.2 10.4 15.4 12.8 13"/><path d="M9.2 18.1 10.4 19.3 12.8 16.9"/><path d="M14.2 10.5h2.6"/><path d="M14.2 14.5h2.6"/><path d="M14.2 18.4h2.6"/></svg>`,
  /* Alt nav — ince çizgi */
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11 12 4l8 7"/><path d="M7 10.2V19h10v-8.8"/></svg>`,
  car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.2 15.2h11.6"/><path d="M7.2 15.2 8.6 10.8A2 2 0 0 1 10.5 9.5h3a2 2 0 0 1 1.9 1.3l1.4 4.4"/><circle cx="8.4" cy="16.6" r="1.15"/><circle cx="15.6" cy="16.6" r="1.15"/><path d="M9.8 11.2h4.4"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 16V11a5.5 5.5 0 1 1 11 0v5"/><path d="M5.5 16h13"/><path d="M10.5 18.4a1.5 1.5 0 0 0 3 0"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 18h16"/><path d="M6 14.5 10 10l3 2.5 5.5-6"/><path d="M16.2 6.5h2.8v2.8"/></svg>`,
  sliders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.1"/><path d="M12 3.8v2.2"/><path d="M12 18v2.2"/><path d="M4.9 7.1 6.5 8.6"/><path d="M17.5 15.4 19.1 17"/><path d="M3.8 12h2.2"/><path d="M18 12h2.2"/><path d="M4.9 16.9 6.5 15.4"/><path d="M17.5 8.6 19.1 7.1"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.2 8.2h2.8l1.35-1.7h7.3l1.35 1.7h2.8a1.1 1.1 0 0 1 1.1 1.1v8.4a1.1 1.1 0 0 1-1.1 1.1H4.2a1.1 1.1 0 0 1-1.1-1.1v-8.4a1.1 1.1 0 0 1 1.1-1.1z"/><circle cx="12" cy="13.2" r="3"/></svg>`,
  bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.2 17.6h5.6"/><path d="M10.2 20.2h3.6"/><path d="M8.2 14.6a5.8 5.8 0 1 1 7.6 0c-.7.7-1.1 1.45-1.2 2.25H9.4c-.1-.8-.5-1.55-1.2-2.25z"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 6.5 9 12l5.5 5.5"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 6.5 15 12l-5.5 5.5"/></svg>`,
};

export function iconSvg(name) {
  return ICONS[name] || "";
}
