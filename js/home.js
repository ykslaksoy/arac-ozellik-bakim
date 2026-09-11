/** Kilitli dikey ana sayfa — metrik, demo garaj, ikon kimliği. */

import {
  currentYearMonth,
  inYearMonth,
  litersPer100km,
  sumField,
  toNumber,
} from "./logic.js";

export const DEFAULT_HERO_SRC = "assets/hero-megane.png";
export const DEFAULT_HERO_INDEX = 1;
export const DEFAULT_HERO_GALLERY = [
  { id: "front", src: "assets/hero-megane-front.png" },
  { id: "three-quarter", src: "assets/hero-megane.png" },
  { id: "side", src: "assets/hero-megane-side.png" },
  { id: "rear-quarter", src: "assets/hero-megane-rear-q.png" },
  { id: "rear", src: "assets/hero-megane-rear.png" },
];
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
        yil: "2012",
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

export function clampHeroIndex(index, length) {
  if (!length) return 0;
  const n = Number(index);
  if (!Number.isFinite(n)) return 0;
  return ((Math.trunc(n) % length) + length) % length;
}

export function nextHeroIndex(index, length, delta = 1) {
  return clampHeroIndex((Number(index) || 0) + delta, length);
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
  scan: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8V6a2 2 0 0 1 2-2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M20 16v2a2 2 0 0 1-2 2h-2"/><path d="M8 20H6a2 2 0 0 1-2-2v-2"/></svg>`,
  fuel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V8.5A2.5 2.5 0 0 1 6.5 6H11a2.5 2.5 0 0 1 2.5 2.5V20"/><path d="M3 20h12"/><path d="M7 10h4"/><path d="M15.5 7.5l2.2 2.2a2 2 0 0 1 .6 1.4V18a2 2 0 0 0 2 2h.3"/><path d="M17.5 9.5V6.8a1 1 0 0 1 .3-.7l1.4-1.4"/></svg>`,
  card: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></svg>`,
  gauge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.2 18.2A8 8 0 1 1 18.8 18.2"/><path d="M12 12l4-2"/></svg>`,
  dipstick: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 5h8"/><path d="M12 5v10"/><path d="M9 19a3 3 0 0 0 6 0c0-2-3-4-3-4s-3 2-3 4z"/></svg>`,
  chassis: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13h14"/><path d="M7 13V9h10v4"/><circle cx="7" cy="16.5" r="1.6"/><circle cx="17" cy="16.5" r="1.6"/><path d="M4 13l-1 3"/><path d="M20 13l1 3"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`,
  list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 7h11"/><path d="M8 12h11"/><path d="M8 17h11"/><circle cx="4.5" cy="7" r=".8" fill="currentColor"/><circle cx="4.5" cy="12" r=".8" fill="currentColor"/><circle cx="4.5" cy="17" r=".8" fill="currentColor"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5"/><path d="M6.5 10.5V19h11v-8.5"/></svg>`,
  car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15h16"/><path d="M5 15 7 9.5A2 2 0 0 1 8.8 8h6.4A2 2 0 0 1 17 9.5L19 15"/><circle cx="7.5" cy="16.5" r="1.4"/><circle cx="16.5" cy="16.5" r="1.4"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 16V11a6 6 0 1 1 12 0v5"/><path d="M5 16h14"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19h16"/><path d="M5 15l4-4 3 2 6-7"/></svg>`,
  sliders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/><circle cx="8" cy="7" r="1.6" fill="currentColor"/><circle cx="14" cy="12" r="1.6" fill="currentColor"/><circle cx="10" cy="17" r="1.6" fill="currentColor"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.2"/></svg>`,
  bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M8 15a6 6 0 1 1 8 0c-.8.8-1.2 1.6-1.3 2.5H9.3C9.2 16.6 8.8 15.8 8 15z"/></svg>`,
};

export function iconSvg(name) {
  return ICONS[name] || "";
}
