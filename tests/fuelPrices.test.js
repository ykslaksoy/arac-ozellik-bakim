import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FALLBACK_FUEL_PRICES,
  FUEL_PRICE_SOURCE_ORDER,
  __test__,
  applyPumpPricesToDemoFuels,
  estimateFillCost,
  fetchLiveFuelPrices,
  formatPumpHint,
  loadFuelPrices,
} from "../js/fuelPrices.js";
import { demoState } from "../js/home.js";

const { parseEpdk, parseOpet, parseTpoHtml } = __test__;

test("kaynak sırası: EPDK → Opet → TPO → fallback; ucuzyakitbul yok", () => {
  assert.deepEqual(FUEL_PRICE_SOURCE_ORDER, ["epdk", "opet", "tpo", "fallback"]);
  assert.equal(FALLBACK_FUEL_PRICES.live, false);
  assert.ok(FALLBACK_FUEL_PRICES.diesel > 50);
  assert.doesNotMatch(FALLBACK_FUEL_PRICES.source, /ucuzyakitbul/i);
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
  const next = applyPumpPricesToDemoFuels(state, {
    ...FALLBACK_FUEL_PRICES,
    diesel: 90,
    live: true,
  });
  assert.notEqual(next, state);
  assert.equal(next.fuels[0].ucret, Math.round(litres0 * 90));
  assert.equal(next.fuels[1].ucret, Math.round(litres1 * 90));
  assert.match(next.fuels[0].not, /90,00/);
});

test("parseEpdk EPDK şehir ortalamalarını üretir", () => {
  const parsed = parseEpdk({
    source: "EPDK",
    price_date: "2026-09-01",
    cities: {
      ankara: { motorin: { avg: 80 }, benzin95: { avg: 75 } },
      izmir: { motorin: { avg: 82 }, benzin95: { avg: 77 } },
    },
  });
  assert.equal(parsed.live, true);
  assert.equal(parsed.diesel, 81);
  assert.equal(parsed.gasoline, 76);
  assert.match(parsed.source, /EPDK|epdk/i);
});

test("parseOpet A128/A100 ürün kodlarından ortalama alır", () => {
  const parsed = parseOpet([
    {
      districtName: "Kadıköy",
      prices: [
        { productCode: "A100", productName: "Kurşunsuz 95", amount: 78.5 },
        { productCode: "A128", productName: "Motorin", amount: 88.0 },
        { productCode: "A110", productName: "LPG", amount: 35.0 },
      ],
    },
    {
      districtName: "Beşiktaş",
      prices: [
        { productCode: "A100", productName: "Kurşunsuz 95", amount: 79.5 },
        { productCode: "A128", productName: "Motorin", amount: 90.0 },
      ],
    },
  ]);
  assert.equal(parsed.live, true);
  assert.equal(parsed.diesel, 89);
  assert.equal(parsed.gasoline, 79);
  assert.match(parsed.source, /opet/i);
});

test("parseTpoHtml TPPD tablosundan motorin/benzin ortalaması çıkarır", () => {
  const html = `
    <table class="pricetable"><tbody>
      <tr><th>İLÇE</th><th>KURŞUNSUZ</th><th>GAZ</th><th>MOTORİN</th><th>MOTORİN</th></tr>
      <tr><td>ANADOLU</td><td>79,85</td><td>-</td><td>88,68</td><td>88,68</td></tr>
      <tr><td>AVRUPA</td><td>79,99</td><td>-</td><td>88,82</td><td>88,82</td></tr>
    </tbody></table>`;
  const parsed = parseTpoHtml(html);
  assert.equal(parsed.live, true);
  assert.equal(parsed.diesel, 88.75);
  assert.equal(parsed.gasoline, 79.92);
  assert.match(parsed.source, /tpo|tppd/i);
});

test("fetchLiveFuelPrices: EPDK birincil; sırayla Opet/TPO; en sonda fallback", async () => {
  const epdk = {
    source: "EPDK",
    price_date: "2026-09-01",
    cities: { ankara: { motorin: { avg: 81.5 }, benzin95: { avg: 76.5 } } },
  };
  const fetchImpl = async (url) => {
    if (String(url).includes("fuel-epdk")) {
      return { ok: true, json: async () => epdk, text: async () => "" };
    }
    if (String(url).includes("ucuzyakitbul") || String(url).includes("fuel-national")) {
      throw new Error("ucuzyakitbul must not be called");
    }
    return { ok: false, json: async () => ({}), text: async () => "" };
  };
  const live = await fetchLiveFuelPrices(fetchImpl);
  assert.equal(live.live, true);
  assert.equal(live.diesel, 81.5);
  assert.equal(live.sourceId, "epdk");

  const order = [];
  const orderedFetch = async (url) => {
    const u = String(url);
    if (u.includes("fuel-epdk")) {
      order.push("epdk");
      return { ok: false, json: async () => ({}), text: async () => "" };
    }
    if (u.includes("fuel-opet")) {
      order.push("opet");
      return { ok: false, json: async () => ({}), text: async () => "" };
    }
    if (u.includes("fuel-tpo")) {
      order.push("tpo");
      return {
        ok: true,
        json: async () => ({}),
        text: async () =>
          `<tr><td>X</td><td>80,00</td><td>-</td><td>90,00</td><td>90,00</td></tr>`,
      };
    }
    throw new Error(`unexpected url ${u}`);
  };
  const tpo = await fetchLiveFuelPrices(orderedFetch);
  assert.deepEqual(order, ["epdk", "opet", "tpo"]);
  assert.equal(tpo.sourceId, "tpo");
  assert.equal(tpo.diesel, 90);

  const down = await fetchLiveFuelPrices(async () => {
    throw new Error("network");
  });
  assert.equal(down.live, false);
  assert.equal(down.sourceId, "fallback");
  assert.equal(down.diesel, FALLBACK_FUEL_PRICES.diesel);
});

test("loadFuelPrices force ile ağı dener", async () => {
  const fetchImpl = async (url) => {
    if (String(url).includes("fuel-epdk")) {
      return {
        ok: true,
        json: async () => ({
          cities: { ankara: { motorin: { avg: 91 }, benzin95: { avg: 80 } } },
        }),
        text: async () => "",
      };
    }
    return { ok: false, json: async () => ({}), text: async () => "" };
  };
  const prices = await loadFuelPrices({ force: true, fetchImpl });
  assert.equal(prices.diesel, 91);
  assert.equal(prices.live, true);
  assert.equal(prices.fromCache, false);
});
