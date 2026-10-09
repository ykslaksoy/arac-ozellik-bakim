import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const {
  expandCatalogFromIndex,
  userVisibleModules,
  expertModuleDetails,
} = await import("../js/vehicleMetadata.js");

test("indeks + trims paket listesi ve profilePath", async () => {
  const index = JSON.parse(await readFile("metadata/_index.json", "utf8"));
  const trimsPath = index.brands[0].models[0].trimsPath;
  const trims = JSON.parse(await readFile(trimsPath, "utf8"));
  const catalog = expandCatalogFromIndex(index, { [trimsPath]: trims });
  assert.ok(catalog.length >= 3);
  const icon = catalog.find((p) => p.trimId === "icon");
  assert.equal(icon.profilePath, "data/vehicles/renault/megane-3/icon/profile.json");
  assert.equal(icon.brandLabel, "Renault");
});

test("kullanıcı modül listesinde id_hex ve glob yok", async () => {
  const ecuSet = JSON.parse(
    await readFile("metadata/ecu-sets/renault-megane3-phase2-comfort.json", "utf8"),
  );
  const visible = userVisibleModules(ecuSet);
  assert.equal(visible.length, 3);
  assert.deepEqual(Object.keys(visible[0]).sort(), ["modul_id", "modul_tr"]);
  assert.equal(visible[1].modul_tr, "Gövde ve konfor");
  assert.ok(!JSON.stringify(visible).includes("UCH"));
  assert.ok(!JSON.stringify(visible).includes("742_"));
  const expert = expertModuleDetails(ecuSet);
  assert.ok(expert[0].id_hex);
});

test("icon profil örneği OEM kısaltması içermez", async () => {
  const profile = JSON.parse(
    await readFile("data/vehicles/renault/megane-3/icon/profile.json", "utf8"),
  );
  const blob = JSON.stringify(profile);
  assert.ok(!/UCH|BCM|beyin_adi|742_/i.test(blob));
  assert.equal(profile.commandSummaries[0].modul_tr, "Gösterge paneli");
});
