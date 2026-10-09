/**
 * Kamu metadata yükleyici — klasör yapısı _index.json + trims.json üzerinden genişler.
 * UI katmanı yalnızca modul_tr ve marka/model/paket bağlamı kullanır.
 */

const INDEX_PATH = "metadata/_index.json";
const ECU_SET_BASE = "metadata/ecu-sets/";

/**
 * @param {import('./vehicleMetadata.js').MetadataIndex} indexDoc
 * @param {Record<string, object>} trimsByPath
 */
export function expandCatalogFromIndex(indexDoc, trimsByPath) {
  const packages = [];
  for (const brand of indexDoc.brands || []) {
    for (const model of brand.models || []) {
      const trimsDoc = trimsByPath[model.trimsPath];
      if (!trimsDoc) continue;
      for (const trim of trimsDoc.trims || []) {
        packages.push({
          brandSlug: brand.slug,
          brandLabel: brand.label,
          modelSlug: model.slug,
          modelLabel: trimsDoc.displayName || model.slug,
          trimId: trim.id,
          trimLabel: trim.label,
          yearFrom: trim.yearFrom,
          yearTo: trim.yearTo,
          featurePackId: trim.featurePackId,
          ecuSetId: trim.ecuSetId,
          profilePath: trim.profilePath,
        });
      }
    }
  }
  return packages;
}

/**
 * ECU set dokümanından kullanıcıya güvenli modül listesi (OEM kısaltması / dosya adı yok).
 * @param {{ modules?: Array<{ modul_id: string, modul_tr: string }> }} ecuSetDoc
 */
export function userVisibleModules(ecuSetDoc) {
  if (!ecuSetDoc?.modules) return [];
  return ecuSetDoc.modules.map((m) => ({
    modul_id: m.modul_id,
    modul_tr: m.modul_tr,
  }));
}

/**
 * Uzman görünümü — varsayılan UI'da kullanılmaz.
 */
export function expertModuleDetails(ecuSetDoc) {
  if (!ecuSetDoc?.modules) return [];
  return ecuSetDoc.modules.map((m) => ({
    modul_id: m.modul_id,
    modul_tr: m.modul_tr,
    id_hex: m.id_hex ?? null,
  }));
}

export function ecuSetJsonPath(ecuSetId) {
  return `${ECU_SET_BASE}${ecuSetId}.json`;
}

export async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Metadata yüklenemedi: ${url}`);
  return res.json();
}

/**
 * @returns {Promise<Array<import('./vehicleMetadata.js').CatalogPackage>>}
 */
export async function loadCatalog() {
  const index = await fetchJson(INDEX_PATH);
  const trimsByPath = {};
  for (const brand of index.brands || []) {
    for (const model of brand.models || []) {
      trimsByPath[model.trimsPath] = await fetchJson(model.trimsPath);
    }
  }
  return expandCatalogFromIndex(index, trimsByPath);
}

export async function loadEcuSet(ecuSetId) {
  return fetchJson(ecuSetJsonPath(ecuSetId));
}

export async function loadProfile(profilePath) {
  return fetchJson(profilePath);
}

/**
 * Garajdaki araç kaydından eşleşen katalog paketini bulur (basit marka/model).
 * @param {{ marka?: string, model?: string }} vehicle
 * @param {Array} catalog
 */
export function matchCatalogPackage(vehicle, catalog) {
  if (!vehicle || !catalog?.length) return catalog[0] || null;
  const marka = String(vehicle.marka || "").toLowerCase();
  const model = String(vehicle.model || "").toLowerCase();
  const hit =
    catalog.find(
      (p) =>
        marka.includes("renault") &&
        model.includes("megane") &&
        p.trimId === "icon",
    ) ||
    catalog.find((p) => marka.includes(p.brandSlug) && model.includes("megane")) ||
    catalog[0];
  return hit || null;
}
