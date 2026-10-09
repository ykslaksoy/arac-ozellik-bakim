import { uid } from "./storage.js";

export const PROFILE_FEATURES_KEY = "aob-profile-features-v1";

/** @typedef {{ ozellik_id: string, isim_tr: string, kategori?: string, aciklama_tr?: string, is_standard_for_trim?: boolean, beyin_adresi_hex?: string, istek_kodu_hex?: string, aktif_deger_hex?: string, pasif_deger_hex?: string, kaynak?: string, enabled?: boolean }} ProfileFeature */

/**
 * @typedef {{
 *   featureStates: Record<string, boolean>,
 *   revealedNonStandardIds: string[],
 *   manualFeatures: ProfileFeature[],
 *   showUnsupportedPool: boolean,
 *   arizaKayitlari: Array<{ id: string, kod: string, aciklama_tr?: string, tarih?: string, kaynak?: string }>
 * }} VehicleFeatureProfile
 */

export function defaultVehicleFeatureProfile() {
  return {
    featureStates: {},
    revealedNonStandardIds: [],
    manualFeatures: [],
    showUnsupportedPool: false,
    arizaKayitlari: [],
  };
}

function isPlainObject(v) {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

/**
 * Legacy: { [vehicleId]: { [featureId]: boolean } }
 * New: { vehicles: { [vehicleId]: VehicleFeatureProfile } }
 */
export function migrateProfileStore(raw) {
  if (!isPlainObject(raw)) {
    return { vehicles: {} };
  }

  if (isPlainObject(raw.vehicles)) {
    const vehicles = {};
    for (const [vehicleId, bucket] of Object.entries(raw.vehicles)) {
      vehicles[vehicleId] = normalizeVehicleBucket(bucket);
    }
    return { vehicles };
  }

  const vehicles = {};
  for (const [vehicleId, bucket] of Object.entries(raw)) {
    if (!isPlainObject(bucket)) continue;
    vehicles[vehicleId] = normalizeVehicleBucket(bucket);
  }
  return { vehicles };
}

function normalizeVehicleBucket(bucket) {
  const base = defaultVehicleFeatureProfile();
  if (!isPlainObject(bucket)) return base;

  if (isPlainObject(bucket.featureStates)) {
    base.featureStates = { ...bucket.featureStates };
  } else {
    const reserved = new Set([
      "featureStates",
      "revealedNonStandardIds",
      "manualFeatures",
      "showUnsupportedPool",
      "arizaKayitlari",
    ]);
    for (const [k, v] of Object.entries(bucket)) {
      if (reserved.has(k)) continue;
      if (typeof v === "boolean") base.featureStates[k] = v;
    }
  }

  if (Array.isArray(bucket.revealedNonStandardIds)) {
    base.revealedNonStandardIds = bucket.revealedNonStandardIds.filter((id) => typeof id === "string");
  }
  if (Array.isArray(bucket.manualFeatures)) {
    base.manualFeatures = bucket.manualFeatures.filter((f) => f && typeof f.ozellik_id === "string");
  }
  if (typeof bucket.showUnsupportedPool === "boolean") {
    base.showUnsupportedPool = bucket.showUnsupportedPool;
  }
  if (Array.isArray(bucket.arizaKayitlari)) {
    base.arizaKayitlari = bucket.arizaKayitlari.filter((r) => r && typeof r.kod === "string");
  }

  return base;
}

export function loadProfileStore() {
  try {
    const raw = localStorage.getItem(PROFILE_FEATURES_KEY);
    if (!raw) return { vehicles: {} };
    return migrateProfileStore(JSON.parse(raw));
  } catch {
    return { vehicles: {} };
  }
}

export function saveProfileStore(store) {
  localStorage.setItem(PROFILE_FEATURES_KEY, JSON.stringify(store));
}

export function getVehicleProfile(store, vehicleId) {
  if (!store.vehicles[vehicleId]) {
    store.vehicles[vehicleId] = defaultVehicleFeatureProfile();
  }
  return store.vehicles[vehicleId];
}

export function vehicleCatalogId(vehicle) {
  if (!vehicle) return null;
  if (vehicle.catalogId) return vehicle.catalogId;
  const blob = `${vehicle.marka || ""} ${vehicle.model || ""}`.toLowerCase();
  if (vehicle.id === "demo-megane" || /megane\s*3/.test(blob)) {
    return "renault-megane-3-icon-uds";
  }
  return null;
}

/**
 * @param {Array<ProfileFeature>} catalogFeatures
 * @param {VehicleFeatureProfile} profile
 */
export function buildUnifiedFeatureList(catalogFeatures, profile) {
  const revealed = new Set(profile.revealedNonStandardIds || []);
  const showPool = profile.showUnsupportedPool;

  const fromCatalog = (catalogFeatures || []).filter((f) => {
    if (f.is_standard_for_trim) return true;
    if (showPool) return true;
    return revealed.has(f.ozellik_id);
  });

  const manual = (profile.manualFeatures || []).map((f) => ({
    ...f,
    is_standard_for_trim: false,
    kaynak: f.kaynak || "manual",
  }));

  const byId = new Map();
  for (const f of fromCatalog) byId.set(f.ozellik_id, { ...f });
  for (const f of manual) byId.set(f.ozellik_id, { ...f });

  return [...byId.values()].map((f) => ({
    ...f,
    enabled: Boolean(profile.featureStates[f.ozellik_id]),
  }));
}

export function filterFeatureList(features, { tab = "all", query = "" } = {}) {
  const q = normalizeTrQuery(query);
  let list = features;

  if (tab === "on") list = list.filter((f) => f.enabled);
  else if (tab === "off") list = list.filter((f) => !f.enabled);

  if (!q) return list;

  return list.filter((f) => {
    const hay = normalizeTrQuery(
      [f.isim_tr, f.kategori, f.aciklama_tr, f.ozellik_id].filter(Boolean).join(" "),
    );
    return hay.includes(q);
  });
}

function normalizeTrQuery(s) {
  return String(s || "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function slugifyFeatureId(name) {
  const base = String(name || "ozellik")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
  return `manuel_${base || "ozellik"}_${uid().slice(0, 6)}`;
}

export function setFeatureEnabled(profile, featureId, enabled) {
  profile.featureStates[featureId] = Boolean(enabled);
}

export function revealNonStandardFeature(profile, featureId) {
  if (!profile.revealedNonStandardIds.includes(featureId)) {
    profile.revealedNonStandardIds.push(featureId);
  }
}

export const DTC_CLEAR_REQUEST_HEX = "14FFFFFF";
