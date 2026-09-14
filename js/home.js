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
 * Orbit dosyaları `assets/orbit-m3-*.png` (eski hero-megane-* ile senkron).
 */
export const DEMO_MEGANE_YEAR = "2012";
/**
 * Saat yönünün tersi turntable — arabanın solu/sağı:
 * 1 ön → 2 sol çapraz → 3 sol → 4 sol arka çapraz → 5 arka →
 * 6 arka sağ çapraz → 7 sağ → 8 sağ ön çapraz → (ön).
 * Sağ ok / sola kaydırma = +1. Varsayılan index = ön.
 */
export const DEFAULT_HERO_GALLERY = [
  { id: "front", src: "assets/orbit-m3-0-front.png", label: "Önden", guide: "Tam karşıdan çekim" },
  {
    id: "left-three-quarter",
    src: "assets/orbit-m3-1-front-left.png",
    label: "Sol çapraz",
    guide: "Ön-sol 45°",
  },
  { id: "left-side", src: "assets/orbit-m3-2-left.png", label: "Soldan", guide: "Tam sol profil" },
  {
    id: "rear-left-quarter",
    src: "assets/orbit-m3-3-rear-left.png",
    label: "Sol arka çapraz",
    guide: "Arka-sol 45°",
  },
  { id: "rear", src: "assets/orbit-m3-4-rear.png", label: "Arkadan", guide: "Tam arkadan çekim" },
  {
    id: "rear-right-quarter",
    src: "assets/orbit-m3-5-rear-right.png",
    label: "Arka sağ çapraz",
    guide: "Arka-sağ 45°",
  },
  { id: "right-side", src: "assets/orbit-m3-6-right.png", label: "Sağdan", guide: "Tam sağ profil" },
  {
    id: "right-three-quarter",
    src: "assets/orbit-m3-7-front-right.png",
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
  /* logo-icon-reference.jpg — kalın çizgi + hafif dolgu */
  /* Tara: köşe çerçeve + parmak izi */
  scan: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 3.6H5.2A1.6 1.6 0 0 0 3.6 5.2V8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 3.6h2.8A1.6 1.6 0 0 1 20.4 5.2V8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M20.4 16v2.8a1.6 1.6 0 0 1-1.6 1.6H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3.6 16v2.8A1.6 1.6 0 0 0 5.2 20.4H8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 7.2c-2.1 1.1-3.4 2.7-3.4 4.6 0 2.2 1.5 3.6 3.4 3.6s3.4-1.4 3.4-3.6c0-1.9-1.3-3.5-3.4-4.6Z" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.35"/><path d="M12 9.1c-1.15.7-1.85 1.55-1.85 2.55 0 1.2.8 1.95 1.85 1.95s1.85-.75 1.85-1.95c0-1-.7-1.85-1.85-2.55Z" stroke="currentColor" stroke-width="1.2"/><path d="M12 11.2v2.2" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>`,
  /* Yakıt: tabanca + yaprak */
  fuel: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.2 3.8h4.6c.85 0 1.55.6 1.72 1.42L15.4 10H7.5l.95-4.78A1.75 1.75 0 0 1 8.2 3.8Z" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/><path d="M10.2 10v8.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M14.8 10.2v2.3c0 1.05.55 2 1.45 2.5l1.9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5.4 15.2c1.05-1.35 2.9-1.55 4.15-.35.55.55.9 1.3.9 2.1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M4.3 17.6c.85 1.15 2.15 1.55 3.45 1.2" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M6.2 19.6c.55-.95 1.55-1.35 2.55-1.05" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/><path d="M8.1 18.2c.35-.7 1.1-1 1.8-.7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  /* Masraf: kart + çip */
  card: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.7" y="5.6" width="18.6" height="12.8" rx="2.4" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.6"/><path d="M2.7 9.2h18.6" stroke="currentColor" stroke-width="1.75"/><rect x="5" y="11.6" width="3.6" height="2.55" rx=".55" fill="currentColor" fill-opacity=".45"/><path d="M11 12.4h7M11 14.5h5.2M11 16.5h6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity=".55"/></svg>`,
  /* Özet: pasta + % */
  gauge: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.1" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="1.6"/><path d="M12 3.9a8.1 8.1 0 0 1 8.1 8.1H12V3.9Z" fill="currentColor" fill-opacity=".44"/><path d="M12 12 18.4 15.7A8.1 8.1 0 0 1 12 20.1V12Z" fill="currentColor" fill-opacity=".22"/><text x="7.9" y="13.5" fill="currentColor" font-size="5.4" font-weight="700" font-family="system-ui,sans-serif">%</text></svg>`,
  /* Bakım: anahtar × tornavida */
  dipstick: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.4 4.4 19.6 9.6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M16.2 6.2 8.1 14.3l-1.6 4.2 4.2-1.6 8.1-8.1" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M17.9 8 16 9.9" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/><path d="M6 5 12.6 11.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M4.9 3.9c1.15 0 2.05.8 2.15 1.9L4.7 8.1C3.6 8 2.85 7.1 2.9 5.95A2 2 0 0 1 4.9 3.9Z" fill="currentColor" fill-opacity=".3" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/><path d="M11.5 12.9 13.2 14.6" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/></svg>`,
  /* Arıza: motor + kalkan ! */
  chassis: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.6 10.2h10.8" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><path d="M4.9 10.2V8h8.2v2.2" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><path d="M5.6 13.5h7.8M6.4 10.2v3.3M9.4 10.2v3.3M12.4 10.2v3.3" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M6 13.5 5 16.2M12.8 13.5 13.8 16.2M7.4 16.2h5.2" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M16.1 12.8h2.3a1.75 1.75 0 0 1 1.75 1.75v2.05c0 .5-.25.95-.65 1.2l-2.2 1.2-2.2-1.2a1.45 1.45 0 0 1-.65-1.2v-2.05A1.75 1.75 0 0 1 16.1 12.8Z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M17.25 15.05v2.1M17.25 18.4v.35" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/></svg>`,
  /* Gizli: kilit + */
  lock: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4.5" y="9.4" width="11.2" height="9.2" rx="2.2" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.6"/><path d="M7.2 9.4V7.1a3.5 3.5 0 0 1 7 0v2.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="10.1" cy="14.2" r="1.2" fill="currentColor" fill-opacity=".45"/><path d="M10.1 15.15v1.75" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/><circle cx="18.2" cy="17.6" r="3.4" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="1.45"/><path d="M18.2 15.9v3.4M16.5 17.6h3.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  /* Ekspertiz: pano + tik */
  list: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 3.7h9A1.75 1.75 0 0 1 18.25 5.45v13.5A1.75 1.75 0 0 1 16.5 20.7h-9a1.75 1.75 0 0 1-1.75-1.75V5.45A1.75 1.75 0 0 1 7.5 3.7Z" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.55"/><path d="M9 3h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M8.3 9.5 9.7 10.9 12.6 8M8.3 13.7 9.7 15.1 12.6 12.2M8.3 17.9 9.7 19.3 12.6 16.4" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.2 10h2.5M14.2 14.2h2.5M14.2 18.3h2.5" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.7 11.1 12 4l8.3 7.1"/><path d="M6.5 10.3V19h11V10.3"/><path d="M10 19v-5.3h4V19"/></svg>`,
  car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10.1 8.5 7.2h7L17 10.1"/><path d="M5.2 13h13.6"/><path d="M6 13 5 16.5h14L18 13"/><path d="M8.1 16.5v1.8M15.9 16.5v1.8"/><circle cx="8.1" cy="13" r=".75" fill="currentColor"/><circle cx="15.9" cy="13" r=".75" fill="currentColor"/><path d="M10.4 14.5h3.2"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.3 15.7V10.4a5.7 5.7 0 0 1 11.4 0v5.3"/><path d="M5 15.7h14"/><path d="M10.3 18.2a1.7 1.7 0 0 0 3.4 0"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.7 18.3h16.6"/><path d="M5.5 14.3 9.8 9.8l3.3 2.7L18.8 5.8"/><path d="M15.9 5.8h2.9v2.9"/></svg>`,
  sliders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.1"/><path d="M12 3.5v2.2M12 18.3v2.2M4.6 6.9l1.55 1.55M17.85 15.55 19.4 17.1M3.5 12h2.2M18.3 12h2.2M4.6 17.1l1.55-1.55M17.85 8.45 19.4 6.9"/><circle cx="12" cy="12" r="3.1" fill="currentColor" fill-opacity=".1"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.2 8.2h2.8l1.35-1.7h7.3l1.35 1.7h2.8a1.1 1.1 0 0 1 1.1 1.1v8.4a1.1 1.1 0 0 1-1.1 1.1H4.2a1.1 1.1 0 0 1-1.1-1.1v-8.4a1.1 1.1 0 0 1 1.1-1.1z"/><circle cx="12" cy="13.2" r="3"/></svg>`,
  bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.2 17.6h5.6"/><path d="M10.2 20.2h3.6"/><path d="M8.2 14.6a5.8 5.8 0 1 1 7.6 0c-.7.7-1.1 1.45-1.2 2.25H9.4c-.1-.8-.5-1.55-1.2-2.25z"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 6.5 9 12l5.5 5.5"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 6.5 15 12l-5.5 5.5"/></svg>`,
};

export function iconSvg(name) {
  return ICONS[name] || "";
}
