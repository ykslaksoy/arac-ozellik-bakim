/**
 * Güncel TR pompa fiyatları.
 * Tarayıcıdan CORS’suz erişim için vercel.json rewrite → /api/fuel-*
 * Kaynak yoksa FALLBACK kullanılır (son bilinen ulusal ortalamalar).
 */

export const FUEL_PRICE_CACHE_KEY = "aob-fuel-prices-v1";
export const FUEL_PRICE_TTL_MS = 6 * 60 * 60 * 1000;

/** Son bilinen ulusal ortalama (ucuzyakitbul, 2026-09-12). */
export const FALLBACK_FUEL_PRICES = {
  diesel: 87.22,
  gasoline: 78.23,
  lpg: 34.81,
  currency: "TRY",
  unit: "TL/L",
  source: "fallback",
  asOf: "2026-09-12",
  live: false,
};

const ENDPOINTS = [
  { url: "/api/fuel-national", parse: parseNational },
  { url: "/api/fuel-epdk", parse: parseEpdk },
];

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

function parseNational(data) {
  const rows = Array.isArray(data?.prices) ? data.prices : [];
  const find = (name) =>
    rows.find((r) => String(r.fuelType || "").toLowerCase().includes(name));
  const diesel = find("motorin") || find("dizel");
  const gasoline = find("benzin");
  const lpg = find("lpg");
  if (!diesel?.price && !gasoline?.price) return null;
  const asOf = diesel?.date || gasoline?.date || null;
  return {
    diesel: diesel?.price != null ? round2(diesel.price) : FALLBACK_FUEL_PRICES.diesel,
    gasoline: gasoline?.price != null ? round2(gasoline.price) : FALLBACK_FUEL_PRICES.gasoline,
    lpg: lpg?.price != null ? round2(lpg.price) : FALLBACK_FUEL_PRICES.lpg,
    currency: "TRY",
    unit: "TL/L",
    source: "ucuzyakitbul:/api/prices/national",
    asOf: asOf ? String(asOf).slice(0, 10) : null,
    live: true,
  };
}

function parseEpdk(data) {
  const cities = data?.cities || {};
  const dieselVals = [];
  const gasVals = [];
  for (const city of Object.values(cities)) {
    if (city?.motorin?.avg != null) dieselVals.push(Number(city.motorin.avg));
    if (city?.benzin95?.avg != null) gasVals.push(Number(city.benzin95.avg));
  }
  if (!dieselVals.length && !gasVals.length) return null;
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
  return {
    diesel: round2(avg(dieselVals) ?? FALLBACK_FUEL_PRICES.diesel),
    gasoline: round2(avg(gasVals) ?? FALLBACK_FUEL_PRICES.gasoline),
    lpg: FALLBACK_FUEL_PRICES.lpg,
    currency: "TRY",
    unit: "TL/L",
    source: data?.source || "turkpidya:EPDK",
    asOf: data?.price_date || data?.last_updated?.slice?.(0, 10) || null,
    live: true,
  };
}

export function readCachedFuelPrices(now = Date.now()) {
  try {
    const raw = localStorage.getItem(FUEL_PRICE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.prices || !parsed?.savedAt) return null;
    if (now - Number(parsed.savedAt) > FUEL_PRICE_TTL_MS) return null;
    return parsed.prices;
  } catch {
    return null;
  }
}

export function writeCachedFuelPrices(prices, now = Date.now()) {
  try {
    localStorage.setItem(
      FUEL_PRICE_CACHE_KEY,
      JSON.stringify({ savedAt: now, prices }),
    );
  } catch {
    /* ignore quota */
  }
}

export async function fetchLiveFuelPrices(fetchImpl = fetch) {
  for (const ep of ENDPOINTS) {
    try {
      const res = await fetchImpl(ep.url, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) continue;
      const data = await res.json();
      const prices = ep.parse(data);
      if (prices) return prices;
    } catch {
      /* try next */
    }
  }
  return { ...FALLBACK_FUEL_PRICES };
}

/** Cache → network → fallback. */
export async function loadFuelPrices(options = {}) {
  const { force = false, fetchImpl = fetch, now = Date.now() } = options;
  if (!force) {
    const cached = readCachedFuelPrices(now);
    if (cached) return { ...cached, fromCache: true };
  }
  const prices = await fetchLiveFuelPrices(fetchImpl);
  if (prices.live) writeCachedFuelPrices(prices, now);
  return { ...prices, fromCache: false };
}

export function estimateFillCost(litres, pricePerLitre) {
  const L = Number(litres);
  const p = Number(pricePerLitre);
  if (!Number.isFinite(L) || !Number.isFinite(p)) return null;
  return Math.round(L * p);
}

/**
 * Demo dolumlarının ücretini güncel pompa fiyatına göre yeniden hesaplar.
 * Yalnızca df1/df2 (seed) kayıtlarına dokunur.
 */
export function applyPumpPricesToDemoFuels(state, prices) {
  if (!state?.fuels?.length || !prices) return state;
  const diesel = Number(prices.diesel);
  if (!Number.isFinite(diesel) || diesel <= 0) return state;
  const note = `Pompa ~${diesel.toFixed(2).replace(".", ",")} TL/L`;
  let changed = false;
  const fuels = state.fuels.map((row) => {
    if (row.id !== "df1" && row.id !== "df2") return row;
    const next = estimateFillCost(row.litre, diesel);
    if (next == null) return row;
    if (next === row.ucret && row.not === note) return row;
    changed = true;
    return { ...row, ucret: next, not: note };
  });
  return changed ? { ...state, fuels } : state;
}

export function formatPumpHint(prices) {
  if (!prices?.diesel) return null;
  const tag = prices.live ? "güncel" : "tahmini";
  return `Motorin ${Number(prices.diesel).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} TL/L (${tag})`;
}
