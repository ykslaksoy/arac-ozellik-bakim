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
  /* logo-icon-reference.jpg — duotone illustrated set */
  /* Tara: köşe çerçeve + parmak izi sırtları + tarama çubuğu */
  scan: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.8 3.4H5A1.6 1.6 0 0 0 3.4 5v2.8" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/><path d="M16.2 3.4H19A1.6 1.6 0 0 1 20.6 5v2.8" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/><path d="M20.6 16.2V19A1.6 1.6 0 0 1 19 20.6h-2.8" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/><path d="M3.4 16.2V19A1.6 1.6 0 0 0 5 20.6h2.8" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/><path d="M12 6.6c-2.55 1.15-4.15 2.95-4.15 5.15 0 2.55 1.8 4.25 4.15 4.25s4.15-1.7 4.15-4.25c0-2.2-1.6-4-4.15-5.15Z" fill="currentColor" fill-opacity=".1"/><path d="M12 6.9c-2.35 1.05-3.8 2.7-3.8 4.75 0 2.3 1.65 3.85 3.8 3.85s3.8-1.55 3.8-3.85c0-2.05-1.45-3.7-3.8-4.75" stroke="currentColor" stroke-width="1.15" stroke-linecap="round"/><path d="M12 8.55c-1.55.75-2.45 1.85-2.45 3.15 0 1.55 1.05 2.55 2.45 2.55s2.45-1 2.45-2.55c0-1.3-.9-2.4-2.45-3.15" stroke="currentColor" stroke-width="1.15" stroke-linecap="round"/><path d="M12 10.15c-.85.45-1.3 1.05-1.3 1.75 0 .9.55 1.45 1.3 1.45s1.3-.55 1.3-1.45c0-.7-.45-1.3-1.3-1.75" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/><path d="M9.2 12.2h5.6" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><path d="M12 11.35v1.7" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/></svg>`,
  /* Yakıt: pompa tabancası + iki yaprak */
  fuel: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.1 3.5h5.2c.95 0 1.7.7 1.85 1.62L17.1 11H8.2l.95-5.88A1.9 1.9 0 0 1 9.1 3.5Z" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/><path d="M10.8 11v7.6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M14.2 6.2h1.55" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M16.4 11.2c.15 1.35.85 2.45 1.95 3.15l1.55.95" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.1 14.4c1.35-1.55 3.55-1.7 5-.25.45.45.75 1.05.85 1.7" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M4.2 17.2c1.05 1.35 2.7 1.75 4.2 1.15" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M6.05 19.55c.7-1.15 1.95-1.55 3.1-1.05" fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/><path d="M8.55 18.05c.45-.85 1.35-1.2 2.2-.75" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M5.55 16.05c.55-.95 1.55-1.25 2.45-.75" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.15" stroke-linejoin="round"/></svg>`,
  /* Masraf: hafif eğik kart + çip + logo daireleri */
  card: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.4 7.1 19.2 4.55a2.1 2.1 0 0 1 2.4 1.75l1.15 9.95a2.1 2.1 0 0 1-1.75 2.35L5.2 21.15A2.1 2.1 0 0 1 2.8 19.4L1.65 9.45A2.1 2.1 0 0 1 3.4 7.1Z" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/><path d="M2.2 10.35 21.1 7.35" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M4.55 12.2 7.95 11.65 8.55 14.05 5.15 14.6Z" fill="currentColor" fill-opacity=".42"/><circle cx="16.6" cy="16.55" r="1.55" fill="currentColor" fill-opacity=".28" stroke="currentColor" stroke-width="1.15"/><circle cx="18.55" cy="16.9" r="1.55" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.15"/></svg>`,
  /* Özet: pasta dilimleri + sağ üstte % */
  gauge: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11.2" cy="12.6" r="7.35" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="1.55"/><path d="M11.2 5.25a7.35 7.35 0 0 1 7.35 7.35H11.2V5.25Z" fill="currentColor" fill-opacity=".46"/><path d="M11.2 12.6 16.85 16.95A7.35 7.35 0 0 1 11.2 19.95V12.6Z" fill="currentColor" fill-opacity=".24"/><path d="M11.2 12.6 5.55 15.95A7.35 7.35 0 0 1 11.2 5.25v7.35Z" fill="currentColor" fill-opacity=".14"/><circle cx="17.55" cy="4.55" r="1.15" stroke="currentColor" stroke-width="1.35"/><circle cx="20.35" cy="7.35" r="1.15" stroke="currentColor" stroke-width="1.35"/><path d="M16.85 7.95 21.05 3.75" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/></svg>`,
  /* Bakım: açık ağız anahtar × düz tornavida */
  dipstick: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.2 5.1c1.35 0 2.4.95 2.5 2.25L4.35 9.7C3.05 9.55 2.2 8.45 2.3 7.15A2.85 2.85 0 0 1 4.2 5.1Z" fill="currentColor" fill-opacity=".28" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/><path d="M6.2 7.7 14.9 16.4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M14.1 15.6 16.05 19.4l2.15-.85-1.05-2.85" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/><path d="M19.4 4.5 9.2 14.7l-1.45 3.85 3.85-1.45L21.8 7.0" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M17.55 6.35 15.7 8.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M19.95 8.75c.95.2 1.65 1.05 1.65 2.05 0 1.15-.95 2.05-2.1 2.05-.55 0-1.05-.2-1.4-.55" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  /* Arıza: motor bloğu + kalkan ! */
  chassis: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.9 10.1h11.4" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><path d="M4.2 10.1V7.7h8.8v2.4" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><path d="M5 13.7h8.4M5.9 10.1v3.6M9.1 10.1v3.6M12.3 10.1v3.6" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M5.5 13.7 4.4 16.8M12.9 13.7 14 16.8M6.7 16.8h5.6" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M3.6 8.35h1.35M12.7 8.35h1.35" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M15.85 12.35h2.55c.95 0 1.75.8 1.75 1.75v2.15c0 .55-.28 1.05-.72 1.35l-2.3 1.35-2.3-1.35a1.6 1.6 0 0 1-.73-1.35v-2.15c0-.95.8-1.75 1.75-1.75Z" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M17.15 14.55v2.15M17.15 17.95v.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  /* Gizli: kilit gövdesi + sağ alt + rozeti */
  lock: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4.1" y="9.1" width="11.6" height="9.6" rx="2.4" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-width="1.6"/><path d="M7 9.1V6.75a3.7 3.7 0 0 1 7.4 0V9.1" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/><circle cx="9.9" cy="14.1" r="1.25" fill="currentColor" fill-opacity=".5"/><path d="M9.9 15.15v1.85" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/><circle cx="18.35" cy="17.85" r="3.55" fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-width="1.45"/><path d="M18.35 16.05v3.6M16.55 17.85h3.6" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/></svg>`,
  /* Ekspertiz: pano + üç tik satırı */
  list: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.3 3.9h9.4A1.85 1.85 0 0 1 18.55 5.75v13.3A1.85 1.85 0 0 1 16.7 20.9H7.3A1.85 1.85 0 0 1 5.45 19.05V5.75A1.85 1.85 0 0 1 7.3 3.9Z" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.55"/><path d="M9.2 3.15h5.6c.55 0 1 .45 1 1v.85h-7.6V4.15c0-.55.45-1 1-1Z" fill="currentColor" fill-opacity=".28" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M8.15 9.55 9.7 11.1 12.85 7.95" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.15 13.85 9.7 15.4 12.85 12.25" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.15 18.15 9.7 19.7 12.85 16.55" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.55 10.35h2.7M14.55 14.65h2.7M14.55 18.95h2.7" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/></svg>`,
  /* Alt nav — referans outline set */
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.6 11.2 12 3.9l8.4 7.3"/><path d="M6.4 10.4V19.2h11.2V10.4"/><path d="M9.8 19.2v-5.5h4.4v5.5"/></svg>`,
  /* Araçlarım: önden araç silüeti */
  car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.2 10.4 8.8 7.1h6.4l1.6 3.3"/><path d="M5.4 13.1h13.2"/><path d="M6.2 13.1 5.1 17h13.8l-1.1-3.9"/><path d="M8 17v1.9M16 17v1.9"/><path d="M7.4 13.1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1Z" fill="currentColor"/><path d="M16.6 13.1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1Z" fill="currentColor"/><path d="M9.6 10.4h4.8"/><path d="M10.3 14.85h3.4"/><path d="M6.6 11.55h-1M18.4 11.55h1"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.2 15.9V10.3a5.8 5.8 0 0 1 11.6 0v5.6"/><path d="M4.8 15.9h14.4"/><path d="M10.2 18.35a1.8 1.8 0 0 0 3.6 0"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 18.5h17"/><path d="M5.4 14.2 9.9 9.5l3.4 2.8L19 5.4"/><path d="M15.9 5.4h3.1v3.1"/></svg>`,
  sliders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.2" fill="currentColor" fill-opacity=".12"/><path d="M12 3.3v2.35M12 18.35v2.35M4.45 6.75l1.65 1.65M17.9 15.6l1.65 1.65M3.3 12h2.35M18.35 12h2.35M4.45 17.25l1.65-1.65M17.9 8.4l1.65-1.65"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.2 8.2h2.8l1.35-1.7h7.3l1.35 1.7h2.8a1.1 1.1 0 0 1 1.1 1.1v8.4a1.1 1.1 0 0 1-1.1 1.1H4.2a1.1 1.1 0 0 1-1.1-1.1v-8.4a1.1 1.1 0 0 1 1.1-1.1z"/><circle cx="12" cy="13.2" r="3"/></svg>`,
  bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.2 17.6h5.6"/><path d="M10.2 20.2h3.6"/><path d="M8.2 14.6a5.8 5.8 0 1 1 7.6 0c-.7.7-1.1 1.45-1.2 2.25H9.4c-.1-.8-.5-1.55-1.2-2.25z"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 6.5 9 12l5.5 5.5"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 6.5 15 12l-5.5 5.5"/></svg>`,
};

export function iconSvg(name) {
  return ICONS[name] || "";
}
