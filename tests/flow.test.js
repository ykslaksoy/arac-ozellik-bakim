import { test } from "node:test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import {
  monthlySnapshot,
  monthlyCsv,
  litersPer100km,
  isValidTrPlate,
} from "../js/logic.js";

test("bir araç için Eylül yakıt+masraf özeti ve CSV okunur", () => {
  const vehicle = {
    id: "clio",
    plaka: "34 ABC 123",
    marka: "Renault",
    model: "Clio",
  };
  assert.equal(isValidTrPlate(vehicle.plaka), true);

  const fuels = [
    { id: "f1", vehicleId: "clio", tarih: "2026-09-02", km: 42000, litre: 42, ucret: 2100, not: "İlk dolum" },
    { id: "f2", vehicleId: "clio", tarih: "2026-09-16", km: 42600, litre: 40, ucret: 2000, not: "" },
    { id: "f3", vehicleId: "clio", tarih: "2026-09-28", km: 43200, litre: 39, ucret: 1950, not: "" },
  ];
  const expenses = [
    { id: "e1", vehicleId: "clio", tarih: "2026-09-08", km: 42250, kalem: "Otopark", ucret: 120, not: "AVM" },
    { id: "e2", vehicleId: "clio", tarih: "2026-09-20", km: 42800, kalem: "Yıkama", ucret: 350, not: "" },
  ];

  const snapshot = monthlySnapshot({
    vehicle,
    fuels,
    expenses,
    maintenances: [],
    yearMonth: "2026-09",
  });

  assert.equal(snapshot.fuelCount, 3);
  assert.equal(snapshot.expenseCount, 2);
  assert.equal(snapshot.fuelCost, 6050);
  assert.equal(snapshot.expenseCost, 470);
  assert.equal(snapshot.operatingCost, 6520);
  assert.equal(snapshot.distanceKm, 1200);
  assert.equal(Number(litersPer100km(fuels).toFixed(2)), 6.58);
  assert.ok(snapshot.costPerKm > 5);

  const csv = monthlyCsv(snapshot);
  assert.match(csv, /Aylık yakıt \+ masraf özeti/);
  assert.match(csv, /34 ABC 123/);
  assert.match(csv, /Otopark/);
  assert.match(csv, /Yıkama/);
  assert.match(csv, /Yakıt;2026-09-02;42000;42;;2100;İlk dolum/);

  writeFileSync("/tmp/ozet-34-abc-123-2026-09.csv", `\uFEFF${csv}`, "utf8");
});
