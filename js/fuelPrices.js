/**
 * Güncel TR pompa fiyatları.
 *
 * Kaynak sırası (net, değiştirme):
 *   1) EPDK      → /api/fuel-epdk  (turkpidya EPDK ortalamaları)
 *   2) Opet      → /api/fuel-opet  (api.opet.com.tr, İstanbul plaka 34)
 *   3) TPO       → /api/fuel-tpo   (Türkiye Petrolleri / TPPD HTML)
 *   4) FALLBACK  → sabit son bilinen ulusal ortalamalar
 *
 * ucuzyakitbul KULLANILMAZ (kaldırıldı).
 * Tarayıcıdan CORS’suz erişim için vercel.json rewrite → /api/fuel-*.
 */

export const FUEL_PRICE_CACHE_KEY = "aob-fuel-prices-v2";
export const FUEL_PRICE_TTL_MS = 6 * 60 * 60 * 1000;

/** Kaynak sırası — test ve dokümantasyon için sabit. */
export const FUEL_PRICE_SOURCE_ORDER = ["epdk", "opet", "tpo", "fallback"];

/** Son bilinen ulusal ortalama (sabit yedek; 2026-09-12). */
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

const SOURCES = [
  { id: "epdk", url: "/api/fuel-epdk", kind: "json", parse: parseEpdk },
  { id: "opet", url: "/api/fuel-opet", kind: "json", parse: parseOpet },
  { id: "tpo", url: "/api/fuel-tpo", kind: "html", parse: parseTpoHtml },
];

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

function avg(nums) {
  const list = (nums || []).filter((n) => Number.isFinite(n) && n > 0);
  if (!list.length) return null;
  return list.reduce((a, b) => a + b, 0) / list.length;
}

function parseTrNumber(raw) {
  if (raw == null) return null;
  const s = String(raw)
    .trim()
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.]/g, "");
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** 1) EPDK — turkpidya city averages. */
function parseEpdk(data) {
  const cities = data?.cities || {};
  const dieselVals = [];
  const gasVals = [];
  for (const city of Object.values(cities)) {
    if (city?.motorin?.avg != null) dieselVals.push(Number(city.motorin.avg));
    if (city?.benzin95?.avg != null) gasVals.push(Number(city.benzin95.avg));
  }
  if (!dieselVals.length && !gasVals.length) return null;
  return {
    diesel: round2(avg(dieselVals) ?? FALLBACK_FUEL_PRICES.diesel),
    gasoline: round2(avg(gasVals) ?? FALLBACK_FUEL_PRICES.gasoline),
    lpg: FALLBACK_FUEL_PRICES.lpg,
    currency: "TRY",
    unit: "TL/L",
    source: data?.source || "epdk:turkpidya",
    asOf: data?.price_date || data?.last_updated?.slice?.(0, 10) || null,
    live: true,
  };
}

/**
 * 2) Opet — api.opet.com.tr district prices.
 * productCode: A100 benzin, A128 motorin/mazot, A110 LPG (ademilter/akaryakit-fiyatlari).
 */
function parseOpet(data) {
  const rows = Array.isArray(data) ? data : Array.isArray(data?.prices) ? data.prices : [];
  if (!rows.length) return null;

  const dieselVals = [];
  const gasVals = [];
  const lpgVals = [];

  for (const row of rows) {
    const products = Array.isArray(row?.prices) ? row.prices : [];
    for (const p of products) {
      const code = String(p?.productCode || "").toUpperCase();
      const name = String(p?.productName || "").toLowerCase();
      const amount = Number(p?.amount);
      if (!Number.isFinite(amount) || amount <= 0) continue;
      if (code === "A128" || /motorin|diesel|mazot/.test(name)) dieselVals.push(amount);
      else if (code === "A100" || /benzin|kursunsuz|kurşunsuz/.test(name)) gasVals.push(amount);
      else if (code === "A110" || /lpg|otogaz/.test(name)) lpgVals.push(amount);
    }
  }

  if (!dieselVals.length && !gasVals.length) return null;
  return {
    diesel: round2(avg(dieselVals) ?? FALLBACK_FUEL_PRICES.diesel),
    gasoline: round2(avg(gasVals) ?? FALLBACK_FUEL_PRICES.gasoline),
    lpg: round2(avg(lpgVals) ?? FALLBACK_FUEL_PRICES.lpg),
    currency: "TRY",
    unit: "TL/L",
    source: "opet:api.opet.com.tr",
    asOf: null,
    live: true,
  };
}

/**
 * 3) TPO — Türkiye Petrolleri (TPPD) il fiyat tablosu (HTML).
 * Kolonlar: İlçe | Kurşunsuz | Gazyağı | Motorin | Motorin | … | Gaz
 */
function parseTpoHtml(html) {
  if (!html || typeof html !== "string") return null;
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRe = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
  const dieselVals = [];
  const gasVals = [];

  let rowMatch;
  while ((rowMatch = rowRe.exec(html))) {
    const cells = [];
    let cellMatch;
    const rowHtml = rowMatch[1];
    while ((cellMatch = cellRe.exec(rowHtml))) {
      const text = cellMatch[1]
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&#\d+;/g, "")
        .trim();
      cells.push(text);
    }
    if (cells.length < 4) continue;
    if (/ilce|ilçe|kurşunsuz|kursunsuz/i.test(cells[0])) continue;
    const gasoline = parseTrNumber(cells[1]);
    const diesel = parseTrNumber(cells[3]) ?? parseTrNumber(cells[4]);
    if (gasoline) gasVals.push(gasoline);
    if (diesel) dieselVals.push(diesel);
  }

  if (!dieselVals.length && !gasVals.length) return null;
  return {
    diesel: round2(avg(dieselVals) ?? FALLBACK_FUEL_PRICES.diesel),
    gasoline: round2(avg(gasVals) ?? FALLBACK_FUEL_PRICES.gasoline),
    lpg: FALLBACK_FUEL_PRICES.lpg,
    currency: "TRY",
    unit: "TL/L",
    source: "tpo:tppd.com.tr",
    asOf: null,
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
  for (const src of SOURCES) {
    try {
      const res = await fetchImpl(src.url, {
        headers: { Accept: src.kind === "html" ? "text/html,*/*" : "application/json" },
        cache: "no-store",
      });
      if (!res.ok) continue;
      let prices = null;
      if (src.kind === "html") {
        const html = await res.text();
        prices = src.parse(html);
      } else {
        const data = await res.json();
        prices = src.parse(data);
      }
      if (prices) return { ...prices, sourceId: src.id };
    } catch {
      /* try next source */
    }
  }
  return { ...FALLBACK_FUEL_PRICES, sourceId: "fallback" };
}

/** Cache → network (EPDK→Opet→TPO) → fallback. */
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

/** Test helpers — parse functions exposed for unit coverage. */
export const __test__ = { parseEpdk, parseOpet, parseTpoHtml, parseTrNumber };
