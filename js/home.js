/** Kilitli dikey ana sayfa — metrik, demo garaj, ikon kimliği. */

import {
  currentYearMonth,
  inYearMonth,
  litersPer100km,
  sumField,
  toNumber,
} from "./logic.js";

/**
 * Renault Megane III Sport Tourer — parçalı kaput, plaka 34 MKB 421.
 * Orbit dosyaları `assets/orbit-m3-*.jpg` (eski hero-megane-* ile senkron).
 */
export const DEMO_MEGANE_YEAR = "2012";
/**
 * Saat yönünün tersi turntable — arabanın solu/sağı:
 * 1 ön → 2 sol çapraz → 3 sol → 4 sol arka çapraz → 5 arka →
 * 6 arka sağ çapraz → 7 sağ → 8 sağ ön çapraz → (ön).
 * Sağ ok / sola kaydırma = +1. Varsayılan index = ön.
 */
export const DEFAULT_HERO_GALLERY = [
  { id: "front", src: "assets/orbit-m3-0-front.jpg", label: "Önden", guide: "Tam karşıdan çekim" },
  {
    id: "left-three-quarter",
    src: "assets/orbit-m3-1-front-left.jpg",
    label: "Sol çapraz",
    guide: "Ön-sol 45°",
  },
  { id: "left-side", src: "assets/orbit-m3-2-left.jpg", label: "Soldan", guide: "Tam sol profil" },
  {
    id: "rear-left-quarter",
    src: "assets/orbit-m3-3-rear-left.jpg",
    label: "Sol arka çapraz",
    guide: "Arka-sol 45°",
  },
  { id: "rear", src: "assets/orbit-m3-4-rear.jpg", label: "Arkadan", guide: "Tam arkadan çekim" },
  {
    id: "rear-right-quarter",
    src: "assets/orbit-m3-5-rear-right.jpg",
    label: "Arka sağ çapraz",
    guide: "Arka-sağ 45°",
  },
  { id: "right-side", src: "assets/orbit-m3-6-right.jpg", label: "Sağdan", guide: "Tam sağ profil" },
  {
    id: "right-three-quarter",
    src: "assets/orbit-m3-7-front-right.jpg",
    label: "Sağ ön çapraz",
    guide: "Ön-sağ 45°",
  },
];
export const ORBIT_SLOT_COUNT = DEFAULT_HERO_GALLERY.length;
/** Varsayılan: önden çekim (açı #1). */
export const DEFAULT_HERO_INDEX = 0;
export const DEFAULT_HERO_SRC = DEFAULT_HERO_GALLERY[DEFAULT_HERO_INDEX].src;
export const HERO_LEFT_IDS = ["rear-left-quarter", "left-side", "left-three-quarter"];
export const HERO_ORBIT_IDS = DEFAULT_HERO_GALLERY.map((slide) => slide.id);
export const HERO_PLATE = "34 MKB 421";
export const ORBIT_SLOTS = DEFAULT_HERO_GALLERY.map((slide, index) => ({
  index,
  id: slide.id,
  label: `${index + 1} · ${slide.label}`,
  shortLabel: slide.label,
  guide: slide.guide,
  src: slide.src,
}));
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
  const prev = new Date(now);
  prev.setDate(1);
  prev.setMonth(prev.getMonth() - 1);
  const prevYm = currentYearMonth(prev);
  /* Kullanıcı: 1156 km / 55,71 L → ~4,82 L/100km; tutar ~87,22 TL/L motorin */
  const tripKm = 1156;
  const tripLitres = 55.71;
  const pumpTl = 87.22;
  const endKm = 12540;
  const startKm = endKm - tripKm;
  return {
    vehicles: [
      {
        id: "demo-megane",
        plaka: HERO_PLATE,
        marka: "Renault",
        model: "Megane 3 SW",
        yil: DEMO_MEGANE_YEAR,
        yakit: "Dizel",
        km: endKm,
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
        tarih: `${prevYm}-22`,
        km: startKm,
        litre: 48.5,
        /* önceki ay referans dolum (tüketim hesabında litre sayılmaz) */
        ucret: Math.round(48.5 * pumpTl),
        not: `Pompa ~${pumpTl.toFixed(2).replace(".", ",")} TL/L`,
      },
      {
        id: "df2",
        vehicleId: "demo-megane",
        tarih: `${ym}-18`,
        km: endKm,
        litre: tripLitres,
        /* canlı fiyat gelince applyPumpPricesToDemoFuels günceller */
        ucret: Math.round(tripLitres * pumpTl),
        not: `Pompa ~${pumpTl.toFixed(2).replace(".", ",")} TL/L · ${tripKm} km`,
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

export function isMegane3Vehicle(vehicle) {
  if (!vehicle) return false;
  if (vehicle.id === "demo-megane" || vehicle.plaka === HERO_PLATE) return true;
  const blob = `${vehicle.marka || ""} ${vehicle.model || ""}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return /megane\s*(3|iii)/.test(blob);
}

/** 8 slotluk orbit dizisi (boş string = eksik). */
export function normalizeOrbitSlots(vehicle) {
  const raw = Array.isArray(vehicle?.orbit) ? vehicle.orbit : [];
  return Array.from({ length: ORBIT_SLOT_COUNT }, (_, i) => {
    const src = raw[i];
    return typeof src === "string" && src ? src : "";
  });
}

export function orbitFillStatus(slots) {
  const list = Array.isArray(slots) ? slots : normalizeOrbitSlots({ orbit: slots });
  const emptyIndexes = [];
  let filled = 0;
  for (let i = 0; i < ORBIT_SLOT_COUNT; i++) {
    if (list[i]) filled += 1;
    else emptyIndexes.push(i);
  }
  return {
    filled,
    missing: ORBIT_SLOT_COUNT - filled,
    complete: filled === ORBIT_SLOT_COUNT,
    emptyIndexes,
    excess: Math.max(0, list.length - ORBIT_SLOT_COUNT),
  };
}

/** Tam 8 açı yoksa hata mesajı; fazla öğe de reddedilir. */
export function validateOrbitSlots(slots, { allowEmpty = false } = {}) {
  const list = Array.isArray(slots) ? [...slots] : [];
  if (list.length > ORBIT_SLOT_COUNT) {
    return {
      ok: false,
      message: `En fazla ${ORBIT_SLOT_COUNT} fotoğraf. ${list.length - ORBIT_SLOT_COUNT} fazla seçildi.`,
    };
  }
  const normalized = Array.from({ length: ORBIT_SLOT_COUNT }, (_, i) => list[i] || "");
  const status = orbitFillStatus(normalized);
  if (status.complete) {
    return { ok: true, message: `${ORBIT_SLOT_COUNT} açı hazır`, slots: normalized, status };
  }
  if (allowEmpty && status.filled === 0) {
    return { ok: true, message: "Varsayılan orbit", slots: normalized, status };
  }
  const missingLabels = status.emptyIndexes
    .map((i) => ORBIT_SLOTS[i]?.shortLabel || `${i + 1}`)
    .join(", ");
  return {
    ok: false,
    message: `${status.missing} açı eksik (adet ${ORBIT_SLOT_COUNT} olmalı): ${missingLabels}`,
    slots: normalized,
    status,
  };
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

/**
 * Megane III → yerleşik 8 açı otomatik.
 * Kullanıcı orbit’i tam 8 ise onu kullanır; kısmi set orbit’e geçmez.
 */
export function heroSlides(vehicle) {
  const custom = normalizeOrbitSlots(vehicle);
  if (orbitFillStatus(custom).complete) return custom;
  if (isMegane3Vehicle(vehicle) || !vehicle) {
    return DEFAULT_HERO_GALLERY.map((slide) => slide.src);
  }
  const legacy = userHeroPhotos(vehicle);
  if (legacy.length) return legacy;
  return [];
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
    maximumFractionDigits: 2,
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
  /* logo-icon-reference-new.jpg — üst/alt aksiyon + nav birebir */
  /* Tara: köşe bracket + yatay tarama kıvrımları */
  scan: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 3.5H5.2A1.7 1.7 0 0 0 3.5 5.2V8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M16 3.5h2.8A1.7 1.7 0 0 1 20.5 5.2V8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M20.5 16v2.8a1.7 1.7 0 0 1-1.7 1.7H16" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M3.5 16v2.8A1.7 1.7 0 0 0 5.2 20.5H8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M7.2 9.2c1.6-.9 3.2-1.35 4.8-1.35s3.2.45 4.8 1.35" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M6.6 12c2-.95 3.9-1.4 5.4-1.4s3.4.45 5.4 1.4" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/><path d="M7.2 14.8c1.6-.85 3.2-1.25 4.8-1.25s3.2.4 4.8 1.25" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M9.4 12h5.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  /* Yakıt: tabanca + 3 yaprak */
  fuel: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.6 3.6h5.4c1 0 1.8.75 1.95 1.72L17.2 11H7.5l1.05-5.68A2 2 0 0 1 8.6 3.6Z" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/><path d="M10.6 11v8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M14.1 6.3h1.7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M16.3 11.2c.2 1.4.95 2.55 2.15 3.25l1.6 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.8 14.1c1.45-1.5 3.7-1.55 5.15.05.4.45.7 1 .8 1.6" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M4 17c1.1 1.35 2.85 1.7 4.4 1.05" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M5.9 19.5c.75-1.1 2-1.45 3.2-.9" fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/><path d="M8.5 18c.5-.85 1.45-1.15 2.35-.65" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M5.4 16c.6-.95 1.65-1.2 2.6-.65" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.15" stroke-linejoin="round"/></svg>`,
  /* Masraf: kart + şerit + çip + çift daire */
  card: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.8" y="5.4" width="18.4" height="13.2" rx="2.4" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="1.55"/><path d="M2.8 9.1h18.4" stroke="currentColor" stroke-width="1.75"/><rect x="5" y="11.4" width="3.5" height="2.5" rx=".45" fill="currentColor" fill-opacity=".42"/><circle cx="16.3" cy="16.3" r="1.55" fill="currentColor" fill-opacity=".28" stroke="currentColor" stroke-width="1.1"/><circle cx="18.35" cy="16.55" r="1.55" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-width="1.1"/></svg>`,
  /* Özet: pasta + ayrık dilimde % */
  gauge: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="12.5" r="7.2" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="1.55"/><path d="M11 5.3a7.2 7.2 0 0 1 7.2 7.2H11V5.3Z" fill="currentColor" fill-opacity=".48"/><path d="M11 12.5 16.5 16.7A7.2 7.2 0 0 1 11 19.7V12.5Z" fill="currentColor" fill-opacity=".24"/><path d="M11 12.5 5.5 15.7A7.2 7.2 0 0 1 11 5.3v7.2Z" fill="currentColor" fill-opacity=".14"/><circle cx="17.7" cy="4.7" r="1.2" stroke="currentColor" stroke-width="1.35"/><circle cx="20.4" cy="7.4" r="1.2" stroke="currentColor" stroke-width="1.35"/><path d="M16.95 8 21.15 3.8" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/></svg>`,
  /* Bakım: anahtar × tornavida */
  dipstick: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.1 5c1.4 0 2.45 1 2.55 2.35L4.25 9.75C2.9 9.6 2.05 8.45 2.15 7.1A2.9 2.9 0 0 1 4.1 5Z" fill="currentColor" fill-opacity=".3" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/><path d="M6.1 7.7 15 16.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M14.2 15.8 16.2 19.7l2.2-.9-1.1-2.9" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/><path d="M19.5 4.4 9.1 14.8l-1.5 4 4-1.5L21.9 6.9" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M17.6 6.3 15.7 8.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M20 8.7c1 .2 1.7 1.1 1.7 2.1 0 1.2-1 2.1-2.15 2.1-.55 0-1.05-.2-1.4-.55" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  /* Arıza: motor + kalkan ! */
  chassis: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.8 10h11.6" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><path d="M4.1 10V7.5h9v2.5" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><path d="M4.9 13.7h8.6M5.8 10v3.7M9.1 10v3.7M12.4 10v3.7" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M5.4 13.7 4.3 16.9M13 13.7l1.1 3.2M6.6 16.9h5.8" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M3.5 8.2h1.4M12.8 8.2h1.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M15.9 12.2h2.6c1 0 1.8.8 1.8 1.8v2.2c0 .55-.28 1.05-.75 1.35l-2.35 1.4-2.35-1.4a1.65 1.65 0 0 1-.75-1.35v-2.2c0-1 .8-1.8 1.8-1.8Z" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M17.2 14.5v2.2M17.2 17.95v.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  /* Gizli: kilit + */
  lock: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="9" width="11.8" height="9.8" rx="2.5" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-width="1.6"/><path d="M6.9 9V6.7a3.8 3.8 0 0 1 7.6 0V9" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/><circle cx="9.9" cy="14.1" r="1.3" fill="currentColor" fill-opacity=".5"/><path d="M9.9 15.2v1.9" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/><circle cx="18.4" cy="17.9" r="3.6" fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-width="1.45"/><path d="M18.4 16.1v3.6M16.6 17.9h3.6" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/></svg>`,
  /* Ekspertiz: pano + tikler */
  list: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.2 3.8h9.6A1.9 1.9 0 0 1 18.7 5.7v13.5a1.9 1.9 0 0 1-1.9 1.9H7.2a1.9 1.9 0 0 1-1.9-1.9V5.7A1.9 1.9 0 0 1 7.2 3.8Z" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.55"/><path d="M9.1 3h5.8c.55 0 1 .45 1 1v.9H8.1V4c0-.55.45-1 1-1Z" fill="currentColor" fill-opacity=".28" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M8 9.5 9.6 11.1 12.9 7.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 13.9 9.6 15.5 12.9 12.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 18.3 9.6 19.9 12.9 16.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.6 10.3h2.8M14.6 14.7h2.8M14.6 19.1h2.8" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/></svg>`,
  /* Nav outline */
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 11.1 12 3.7l8.5 7.4"/><path d="M6.3 10.3V19h11.4v-8.7"/><path d="M9.7 19v-5.4h4.6V19"/></svg>`,
  /* Araçlarım: önden araç */
  car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.1 10.3 8.8 7h6.4l1.7 3.3"/><path d="M5.2 13h13.6"/><path d="M6.1 13 5 17.1h14l-1.1-4.1"/><path d="M8 17.1v1.9M16 17.1v1.9"/><circle cx="7.5" cy="13" r="1" fill="currentColor"/><circle cx="16.5" cy="13" r="1" fill="currentColor"/><path d="M9.5 10.3h5"/><path d="M10.2 14.9h3.6"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.1 15.8V10.2a5.9 5.9 0 0 1 11.8 0v5.6"/><path d="M4.6 15.8h14.8"/><path d="M10.1 18.3a1.9 1.9 0 0 0 3.8 0"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.4 18.6h17.2"/><path d="M5.3 14.3 9.7 9.6l3.5 2.9L19.1 5.3"/><path d="M15.9 5.3h3.2v3.2"/></svg>`,
  /* Ayarlar: klasik dişli */
  sliders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.15" fill="currentColor" fill-opacity=".12"/><path d="M12 3.4v2.1M12 18.5v2.1M4.6 6.9l1.5 1.5M17.9 15.6l1.5 1.5M3.4 12h2.1M18.5 12h2.1M4.6 17.1l1.5-1.5M17.9 8.4l1.5-1.5"/><path d="M9.2 4.6 10 6.3M14 6.3l.8-1.7M19.4 9.2 17.7 10M17.7 14l1.7.8M14.8 19.4 14 17.7M10 17.7l-.8 1.7M4.6 14.8 6.3 14M6.3 10 4.6 9.2"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.2 8.2h2.8l1.35-1.7h7.3l1.35 1.7h2.8a1.1 1.1 0 0 1 1.1 1.1v8.4a1.1 1.1 0 0 1-1.1 1.1H4.2a1.1 1.1 0 0 1-1.1-1.1v-8.4a1.1 1.1 0 0 1 1.1-1.1z"/><circle cx="12" cy="13.2" r="3"/></svg>`,
  bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.2 17.6h5.6"/><path d="M10.2 20.2h3.6"/><path d="M8.2 14.6a5.8 5.8 0 1 1 7.6 0c-.7.7-1.1 1.45-1.2 2.25H9.4c-.1-.8-.5-1.55-1.2-2.25z"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 6.5 9 12l5.5 5.5"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 6.5 15 12l-5.5 5.5"/></svg>`,
};

export function iconSvg(name) {
  return ICONS[name] || "";
}
