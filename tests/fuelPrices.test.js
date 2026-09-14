import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FALLBACK_FUEL_PRICES,
  applyPumpPricesToDemoFuels,
  estimateFillCost,
  fetchLiveFuelPrices,
  formatPumpHint,
  loadFuelPrices,
} from "../js/fuelPrices.js";
import { demoState } from "../js/home.js";

test("fallback pompa fiyatları tanımlı", () => {
  assert.equal(FALLBACK_FUEL_PRICES.live, false);
  assert.ok(FALLBACK_FUEL_PRICES.diesel > 50);
  assert.match(formatPumpHint(FALLBACK_FUEL_PRICES), /Motorin .* TL\/L \(tahmini\)/);
});

test("estimateFillCost litre × fiyat", () => {
  assert.equal(estimateFillCost(32.4, 87.22), 2826);
  assert.equal(estimateFillCost(31.8, 87.22), 2774);
  assert.equal(estimateFillCost("x", 87.22), null);
});

test("apply demo yakıt ücretlerini günceller", () => {
  const state = demoState(new Date("2026-09-11T12:00:00"));
  const litres0 = Number(state.fuels[0].litre);
  const litres1 = Number(state.fuels[1].litre);
  const next = applyPumpPricesToDemoFuels(state, { ...FALLBACK_FUEL_PRICES, diesel: 90, live: true });
  assert.notEqual(next, state);
  assert.equal(next.fuels[0].ucret, Math.round(litres0 * 90));
  assert.equal(next.fuels[1].ucret, Math.round(litres1 * 90));
  assert.match(next.fuels[0].not, /90,00/);
});

test("fetchLiveFuelPrices canlı parse veya fallback", async () => {
  const national = {
    prices: [
      { fuelType: "Motorin", price: 88.5, date: "2026-09-13T00:00:00.000Z" },
      { fuelType: "Benzin", price: 79.1, date: "2026-09-13T00:00:00.000Z" },
      { fuelType: "LPG", price: 35.0, date: "2026-09-13T00:00:00.000Z" },
    ],
  };
  const fetchImpl = async (url) => {
    if (String(url).includes("fuel-national")) {
      return { ok: true, json: async () => national };
    }
    return { ok: false, json: async () => ({}) };
  };
  const live = await fetchLiveFuelPrices(fetchImpl);
  assert.equal(live.live, true);
  assert.equal(live.diesel, 88.5);
  assert.equal(live.gasoline, 79.1);

  const down = await fetchLiveFuelPrices(async () => { throw new Error("network"); });
  assert.equal(down.live, false);
  assert.equal(down.diesel, FALLBACK_FUEL_PRICES.diesel);
});

test("loadFuelPrices force ile ağı dener", async () => {
  const fetchImpl = async () => ({
    ok: true,
    json: async () => ({
      prices: [
        { fuelType: "Motorin", price: 91.0, date: "2026-09-13" },
        { fuelType: "Benzin", price: 80.0, date: "2026-09-13" },
      ],
    }),
  });
  const prices = await loadFuelPrices({ force: true, fetchImpl });
  assert.equal(prices.diesel, 91);
  assert.equal(prices.live, true);
  assert.equal(prices.fromCache, false);
});
