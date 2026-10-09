/**
 * Public VehicleProfile JSON loader ve araç eşleştirme (BYOD zip yok).
 */

import { HERO_PLATE, isMegane3Vehicle } from "./home.js";

export const MEGANE3_ICON_PROFILE_URL = "data/vehicles/renault-megane-3-icon-uds.json";
export const FEATURE_STATE_KEY = "aob-profile-features-v1";

/** @type {Promise<Record<string, unknown>> | null} */
let profileLoadPromise = null;

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function megane3ModelToken(model) {
  const blob = normalizeText(model).replace(/\s+/g, " ");
  if (!blob.includes("megane")) return null;
  if (/\bmegane\s*(3|iii)\b/.test(blob)) return "megane3";
  if (/\bmegane\b/.test(blob) && /\b(3|iii|sw)\b/.test(blob)) return "megane3";
  return null;
}

/**
 * @param {Record<string, unknown>} profile
 * @param {{ marka?: string; model?: string; paket?: string; trim?: string; plaka?: string; id?: string } | null | undefined} vehicle
 */
export function vehicleMatchesProfile(profile, vehicle) {
  if (!profile?.meta_data || !vehicle) return false;
  const meta = profile.meta_data;
  if (normalizeText(meta.marka) !== normalizeText(vehicle.marka)) return false;
  if (!megane3ModelToken(meta.model) || !megane3ModelToken(vehicle.model)) {
    if (!isMegane3Vehicle(vehicle)) return false;
  }
  const trim = normalizeText(vehicle.paket || vehicle.trim);
  const targetTrim = normalizeText(meta.paket);
  if (trim) return trim === targetTrim;
  return (
    isMegane3Vehicle(vehicle) ||
    vehicle.id === "demo-megane" ||
    vehicle.plaka === HERO_PLATE
  );
}

export function profileDisplayLine(profile) {
  const m = profile?.meta_data;
  if (!m) return "";
  return [m.marka, m.model, m.paket].filter(Boolean).join(" · ");
}

export function loadFeatureStateMap() {
  try {
    const raw = localStorage.getItem(FEATURE_STATE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveFeatureStateMap(map) {
  localStorage.setItem(FEATURE_STATE_KEY, JSON.stringify(map));
}

/**
 * @param {string} vehicleId
 * @param {string} ozellikId
 * @param {'acik'|'kapali'} durum
 */
export function setFeatureState(vehicleId, ozellikId, durum) {
  const map = loadFeatureStateMap();
  const perVehicle = { ...(map[vehicleId] || {}) };
  perVehicle[ozellikId] = durum;
  map[vehicleId] = perVehicle;
  saveFeatureStateMap(map);
  return durum;
}

/**
 * @param {string} vehicleId
 * @param {{ ozellik_id: string; varsayilan_durum?: string }} feature
 */
export function getFeatureState(vehicleId, feature) {
  const map = loadFeatureStateMap();
  const stored = map[vehicleId]?.[feature.ozellik_id];
  if (stored === "acik" || stored === "kapali") return stored;
  const def = feature.varsayilan_durum;
  return def === "acik" ? "acik" : "kapali";
}

export function filterFeatures(features, { status = "tumu", query = "" } = {}) {
  const q = normalizeText(query);
  return (features || []).filter((f) => {
    const state = f._durum;
    if (status === "acik" && state !== "acik") return false;
    if (status === "kapali" && state !== "kapali") return false;
    if (!q) return true;
    const hay = normalizeText(`${f.isim_tr} ${f.aciklama_tr} ${f.kategori}`);
    return hay.includes(q);
  });
}

export function groupFeaturesByCategory(features) {
  const groups = new Map();
  for (const f of features || []) {
    const cat = f.kategori || "Diğer";
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat).push(f);
  }
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0], "tr"));
}

export function searchFeaturesTurkish(features, query) {
  return filterFeatures(features, { status: "tumu", query });
}

export async function fetchVehicleProfile(url = MEGANE3_ICON_PROFILE_URL) {
  if (!profileLoadPromise) {
    profileLoadPromise = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Profil yüklenemedi (${res.status})`);
        return res.json();
      })
      .catch((err) => {
        profileLoadPromise = null;
        throw err;
      });
  }
  return profileLoadPromise;
}

/**
 * @param {{ marka?: string; model?: string; paket?: string; trim?: string; plaka?: string; id?: string } | null | undefined} vehicle
 */
export async function resolveProfileForVehicle(vehicle) {
  const profile = await fetchVehicleProfile();
  if (!vehicleMatchesProfile(profile, vehicle)) return null;
  return profile;
}

export function resetProfileCache() {
  profileLoadPromise = null;
}
