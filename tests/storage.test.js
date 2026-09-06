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

const { loadState, saveState, importJson, exportJson, clearAll } = await import(
  "../js/storage.js"
);

test("yedek JSON yakıt ve masrafı korur", () => {
  const state = {
    vehicles: [{ id: "v1", plaka: "34 ABC 123", marka: "Renault", model: "Clio" }],
    maintenances: [],
    reminders: [],
    fuels: [{ id: "f1", vehicleId: "v1", tarih: "2026-09-01", km: 20000, litre: 40, ucret: 2000 }],
    expenses: [{ id: "e1", vehicleId: "v1", tarih: "2026-09-05", kalem: "Otopark", ucret: 80 }],
  };
  saveState(state);
  const loaded = loadState();
  assert.equal(loaded.fuels.length, 1);
  assert.equal(loaded.expenses[0].kalem, "Otopark");

  const restored = importJson(exportJson(loaded));
  assert.equal(restored.vehicles[0].plaka, "34 ABC 123");
  assert.equal(restored.fuels[0].litre, 40);
  assert.equal(restored.expenses[0].ucret, 80);

  clearAll();
  assert.equal(loadState().fuels.length, 0);
});
