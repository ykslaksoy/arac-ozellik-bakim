import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MARKALAR,
  MASRAF_KALEMLERI,
  currentYearMonth,
  formatTrPlate,
  isValidTrPlate,
  litersPer100km,
  costPerKm,
  monthlySnapshot,
  monthlyCsv,
  csvFilename,
} from "../js/logic.js";

test("TR plaka: geçerli biçimler", () => {
  assert.equal(isValidTrPlate("34 ABC 123"), true);
  assert.equal(isValidTrPlate("34abc123"), true);
  assert.equal(isValidTrPlate("06 A 1234"), true);
  assert.equal(isValidTrPlate("81 AB 1234"), true);
  assert.equal(isValidTrPlate("01 AAA 12"), true);
  assert.equal(formatTrPlate("34abc123"), "34 ABC 123");
});

test("TR plaka: geçersiz biçimler", () => {
  assert.equal(isValidTrPlate("99 ABC 123"), false);
  assert.equal(isValidTrPlate("ABC 123"), false);
  assert.equal(isValidTrPlate("34"), false);
  assert.equal(isValidTrPlate("34 ABCD 12"), false);
  assert.equal(isValidTrPlate(""), false);
});

test("marka ve masraf listeleri dolu", () => {
  assert.ok(MARKALAR.includes("Togg"));
  assert.ok(MARKALAR.includes("Renault"));
  assert.ok(MASRAF_KALEMLERI.includes("Otopark"));
  assert.ok(MASRAF_KALEMLERI.includes("Sigorta"));
});

test("L/100km depo-depo hesaplanır", () => {
  const fuels = [
    { tarih: "2026-09-01", km: 10000, litre: 40, ucret: 1800 },
    { tarih: "2026-09-10", km: 10500, litre: 35, ucret: 1600 },
    { tarih: "2026-09-20", km: 11000, litre: 35, ucret: 1600 },
  ];
  const value = litersPer100km(fuels);
  assert.ok(value != null);
  assert.equal(Number(value.toFixed(2)), 7);
});

test("tek dolumda L/100km yok", () => {
  assert.equal(litersPer100km([{ km: 10000, litre: 40 }]), null);
});

test("₺/km ve aylık özet + CSV", () => {
  assert.equal(costPerKm(800, 400), 2);

  const snapshot = monthlySnapshot({
    vehicle: { id: "v1", plaka: "34 ABC 123", marka: "Renault", model: "Clio" },
    yearMonth: "2026-09",
    fuels: [
      { tarih: "2026-09-01", km: 20000, litre: 40, ucret: 2000, not: "İlk" },
      { tarih: "2026-09-18", km: 20500, litre: 35, ucret: 1750, not: "" },
    ],
    expenses: [
      { tarih: "2026-09-05", km: 20100, kalem: "Otopark", ucret: 150, not: "AVM" },
      { tarih: "2026-08-01", km: 19800, kalem: "Yıkama", ucret: 400, not: "eski ay" },
    ],
    maintenances: [],
  });

  assert.equal(snapshot.fuelCount, 2);
  assert.equal(snapshot.expenseCount, 1);
  assert.equal(snapshot.fuelCost, 3750);
  assert.equal(snapshot.expenseCost, 150);
  assert.equal(snapshot.operatingCost, 3900);
  assert.equal(snapshot.distanceKm, 500);
  assert.equal(snapshot.costPerKm, 7.8);
  assert.equal(Number(snapshot.consumption.toFixed(2)), 7);

  const csv = monthlyCsv(snapshot);
  assert.match(csv, /Yakıt \(₺\);3\.750,00/);
  assert.match(csv, /Masraf \(₺\);150,00/);
  assert.match(csv, /Otopark/);
  assert.match(csv, /Yakıt;2026-09-18;20500;35;;1750;/);
  assert.match(csv, /Yakıt;2026-09-01;20000;40;;2000;İlk/);
  assert.doesNotMatch(csv, /eski ay/);
  assert.equal(csvFilename(snapshot), "ozet-34-abc-123-2026-09.csv");
  assert.equal(
    csvFilename({ vehicleLabel: "Tüm araçlar", yearMonth: "2026-09" }),
    "ozet-tum-araclar-2026-09.csv",
  );
});

test("currentYearMonth biçimi YYYY-MM", () => {
  assert.match(currentYearMonth(new Date("2026-09-06T12:00:00Z")), /^\d{4}-\d{2}$/);
});
