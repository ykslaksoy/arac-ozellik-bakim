import { test } from "node:test";
import assert from "node:assert/strict";

const memory = new Map();
globalThis.localStorage = {
  getItem(key) {
    return memory.has(key) ? memory.get(key) : null;
  },
  setItem(key, value) {
    memory.set(key, String(value));
  },
  removeItem(key) {
    memory.delete(key);
  },
};

const {
  migrateProfileStore,
  buildUnifiedFeatureList,
  filterFeatureList,
  loadProfileStore,
  saveProfileStore,
  getVehicleProfile,
  defaultVehicleFeatureProfile,
  vehicleCatalogId,
  PROFILE_FEATURES_KEY,
} = await import("../js/vehicleProfile.js");

const catalog = [
  { ozellik_id: "kadran_selamlama", isim_tr: "Kadran", is_standard_for_trim: true },
  { ozellik_id: "ses", isim_tr: "Ses", is_standard_for_trim: false, kategori: "Ses" },
  { ozellik_id: "joy", isim_tr: "Joy", is_standard_for_trim: false },
];

test("legacy profil migrate: özellik id → boolean", () => {
  const migrated = migrateProfileStore({
    "demo-megane": { kadran_selamlama: true, ses: false },
  });
  const p = migrated.vehicles["demo-megane"];
  assert.equal(p.featureStates.kadran_selamlama, true);
  assert.equal(p.featureStates.ses, false);
  assert.deepEqual(p.revealedNonStandardIds, []);
});

test("birleşik liste: varsayılan yalnızca trim standardı", () => {
  const profile = defaultVehicleFeatureProfile();
  const list = buildUnifiedFeatureList(catalog, profile);
  assert.equal(list.length, 1);
  assert.equal(list[0].ozellik_id, "kadran_selamlama");
});

test("havuz toggle ve revealed id ile non-standard görünür", () => {
  const profile = defaultVehicleFeatureProfile();
  profile.showUnsupportedPool = true;
  profile.featureStates.kadran_selamlama = true;
  let list = buildUnifiedFeatureList(catalog, profile);
  assert.equal(list.length, 3);

  profile.showUnsupportedPool = false;
  profile.revealedNonStandardIds = ["ses"];
  list = buildUnifiedFeatureList(catalog, profile);
  assert.equal(list.length, 2);
  const ids = list.map((f) => f.ozellik_id).sort();
  assert.deepEqual(ids, ["kadran_selamlama", "ses"]);
});

test("manuel özellikler listeye eklenir", () => {
  const profile = defaultVehicleFeatureProfile();
  profile.manualFeatures.push({
    ozellik_id: "manuel_test",
    isim_tr: "Test",
    kaynak: "manual",
  });
  const list = buildUnifiedFeatureList(catalog, profile);
  assert.ok(list.some((f) => f.ozellik_id === "manuel_test"));
});

test("Türkçe arama ve sekme filtresi", () => {
  const features = [
    { ozellik_id: "a", isim_tr: "Otomatik Kilit", enabled: true },
    { ozellik_id: "b", isim_tr: "Kadran", enabled: false },
  ];
  assert.equal(filterFeatureList(features, { tab: "on" }).length, 1);
  assert.equal(filterFeatureList(features, { query: "kilit" }).length, 1);
});

test("load/save round-trip yeni şema", () => {
  memory.clear();
  const store = { vehicles: { v1: defaultVehicleFeatureProfile() } };
  store.vehicles.v1.showUnsupportedPool = true;
  store.vehicles.v1.manualFeatures = [{ ozellik_id: "m1", isim_tr: "M" }];
  saveProfileStore(store);
  const loaded = loadProfileStore();
  assert.equal(loaded.vehicles.v1.showUnsupportedPool, true);
  assert.equal(loaded.vehicles.v1.manualFeatures.length, 1);
  assert.equal(localStorage.getItem(PROFILE_FEATURES_KEY).includes("showUnsupportedPool"), true);
});

test("megane demo araç katalog anahtarı", () => {
  assert.equal(
    vehicleCatalogId({ id: "demo-megane", marka: "Renault", model: "Megane 3 SW" }),
    "renault-megane-3-icon-uds",
  );
});
