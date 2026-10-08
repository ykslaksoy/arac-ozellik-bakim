import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  MEGANE3_ICON_PROFILE_URL,
  filterFeatures,
  groupFeaturesByCategory,
  megane3ModelToken,
  searchFeaturesTurkish,
  vehicleMatchesProfile,
} from "../js/vehicleProfile.js";

const profile = JSON.parse(
  readFileSync(new URL(`../${MEGANE3_ICON_PROFILE_URL}`, import.meta.url), "utf8"),
);

const meganeIcon = {
  id: "v1",
  plaka: "34 ABC 12",
  marka: "Renault",
  model: "Megane 3",
  paket: "Icon",
};

test("Megane 3 Icon profili eşleşir", () => {
  assert.equal(vehicleMatchesProfile(profile, meganeIcon), true);
  assert.equal(megane3ModelToken("Megane 3 SW"), "megane3");
});

test("Clio profille eşleşmez", () => {
  assert.equal(
    vehicleMatchesProfile(profile, {
      marka: "Renault",
      model: "Clio",
      paket: "Icon",
    }),
    false,
  );
});

test("Megane 3 farklı paket eşleşmez", () => {
  assert.equal(
    vehicleMatchesProfile(profile, {
      marka: "Renault",
      model: "Megane 3",
      paket: "Touch",
    }),
    false,
  );
});

test("gizli özellik filtre ve gruplama", () => {
  const base = profile.gizli_ozellikler.map((f) => ({ ...f, _durum: "kapali" }));
  assert.equal(filterFeatures(base, { status: "kapali" }).length, 1);
  assert.equal(filterFeatures(base, { status: "acik" }).length, 0);
  const found = searchFeaturesTurkish(base, "kadran");
  assert.equal(found.length, 1);
  const groups = groupFeaturesByCategory(base);
  assert.equal(groups[0][0], "Gösterge Paneli");
});
