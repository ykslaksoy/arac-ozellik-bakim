/** Yakıt, masraf ve özet hesapları — OBD / CARFAX / GPS yok. */

export const MARKALAR = [
  "Alfa Romeo",
  "Audi",
  "BMW",
  "Chery",
  "Chevrolet",
  "Citroen",
  "Cupra",
  "Dacia",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Isuzu",
  "Jeep",
  "Kia",
  "Land Rover",
  "Lexus",
  "Mazda",
  "Mercedes-Benz",
  "MG",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Opel",
  "Peugeot",
  "Porsche",
  "Renault",
  "Seat",
  "Skoda",
  "SsangYong",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Togg",
  "Toyota",
  "Volkswagen",
  "Volvo",
  "Diğer",
];

export const MASRAF_KALEMLERI = [
  "Sigorta",
  "MTV",
  "Otopark",
  "Yıkama",
  "Lastik",
  "Köprü / otoyol",
  "Ceza",
  "Aksesuar",
  "Servis (bakım dışı)",
  "Diğer",
];

export function currentYearMonth(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function monthLabel(yearMonth) {
  const [y, m] = String(yearMonth || "").split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  if (Number.isNaN(d.getTime())) return yearMonth || "—";
  return d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
}

export function inYearMonth(isoDate, yearMonth) {
  return String(isoDate || "").startsWith(`${yearMonth}-`);
}

export function normalizePlate(raw) {
  return String(raw || "")
    .trim()
    .replace(/ı/g, "I")
    .replace(/i/g, "İ")
    .toLocaleUpperCase("tr-TR")
    .replace(/İ/g, "I")
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isValidTrPlate(raw) {
  const compact = normalizePlate(raw).replace(/\s/g, "");
  const match = compact.match(/^(0[1-9]|[1-7][0-9]|8[01])([A-Z]{1,3})(\d{2,4})$/);
  if (!match) return false;
  const letters = match[2].length;
  const digits = match[3].length;
  if (letters === 1) return digits === 4 || digits === 5;
  if (letters === 2) return digits === 3 || digits === 4;
  return digits === 2 || digits === 3;
}

export function formatTrPlate(raw) {
  const compact = normalizePlate(raw).replace(/\s/g, "");
  const match = compact.match(/^(\d{2})([A-Z]{1,3})(\d{2,5})$/);
  if (!match || !isValidTrPlate(compact)) return normalizePlate(raw);
  return `${match[1]} ${match[2]} ${match[3]}`;
}

export function toNumber(value) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function sumField(rows, field) {
  return (rows || []).reduce((sum, row) => {
    const n = toNumber(row?.[field]);
    return n == null ? sum : sum + n;
  }, 0);
}

function sortByKmThenDate(rows) {
  return [...(rows || [])].sort((a, b) => {
    const kmA = toNumber(a.km) ?? -1;
    const kmB = toNumber(b.km) ?? -1;
    if (kmA !== kmB) return kmA - kmB;
    return String(a.tarih || "").localeCompare(String(b.tarih || ""));
  });
}

/** Depo-depo: ilk dolum hariç litre / (son km − ilk km) × 100 */
export function litersPer100km(fuels) {
  const usable = (fuels || []).filter(
    (row) => (toNumber(row.km) ?? 0) > 0 && (toNumber(row.litre) ?? 0) > 0,
  );
  const sorted = sortByKmThenDate(usable);
  if (sorted.length < 2) return null;
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const distance = toNumber(last.km) - toNumber(first.km);
  if (!(distance > 0)) return null;
  const litres = sumField(sorted.slice(1), "litre");
  return (litres / distance) * 100;
}

export function kmSpan(rows) {
  const kms = (rows || [])
    .map((row) => toNumber(row.km))
    .filter((n) => n != null && n > 0);
  if (kms.length < 2) return null;
  const span = Math.max(...kms) - Math.min(...kms);
  return span > 0 ? span : null;
}

export function costPerKm(cost, km) {
  if (cost == null || !(km > 0)) return null;
  return Number(cost) / km;
}

export function fuelsForMonth(fuels, yearMonth, { includePriorFill = false } = {}) {
  const list = fuels || [];
  const inMonth = list.filter((row) => inYearMonth(row.tarih, yearMonth));
  if (!includePriorFill) return inMonth;
  const prior = list
    .filter((row) => String(row.tarih || "") < `${yearMonth}-01`)
    .sort((a, b) => String(a.tarih || "").localeCompare(String(b.tarih || "")));
  const lastPrior = prior[prior.length - 1];
  return lastPrior ? [lastPrior, ...inMonth] : inMonth;
}

export function monthlySnapshot({
  vehicle,
  fuels = [],
  expenses = [],
  maintenances = [],
  yearMonth,
}) {
  const monthFuels = fuelsForMonth(fuels, yearMonth);
  const monthExpenses = expenses.filter((row) => inYearMonth(row.tarih, yearMonth));
  const monthMaintenances = maintenances.filter((row) =>
    inYearMonth(row.tarih, yearMonth),
  );
  const fuelCost = sumField(monthFuels, "ucret");
  const expenseCost = sumField(monthExpenses, "ucret");
  const maintenanceCost = sumField(monthMaintenances, "ucret");
  const litres = sumField(monthFuels, "litre");
  const consumption = litersPer100km(fuelsForMonth(fuels, yearMonth, { includePriorFill: true }));
  const distance =
    kmSpan(monthFuels) ??
    kmSpan(fuelsForMonth(fuels, yearMonth, { includePriorFill: true })) ??
    kmSpan([...monthFuels, ...monthExpenses]);
  const operatingCost = fuelCost + expenseCost;
  return {
    vehicleId: vehicle?.id || "",
    vehicleLabel: vehicle
      ? `${vehicle.plaka} · ${vehicle.marka} ${vehicle.model}`.trim()
      : "Tüm araçlar",
    yearMonth,
    monthLabel: monthLabel(yearMonth),
    fuelCount: monthFuels.length,
    expenseCount: monthExpenses.length,
    litres,
    fuelCost,
    expenseCost,
    maintenanceCost,
    operatingCost,
    totalCost: operatingCost + maintenanceCost,
    consumption,
    distanceKm: distance,
    fuelPerKm: costPerKm(fuelCost, distance),
    expensePerKm: costPerKm(expenseCost, distance),
    costPerKm: costPerKm(operatingCost, distance),
    fuels: monthFuels,
    expenses: monthExpenses,
  };
}

function csvCell(value) {
  const text = value == null ? "" : String(value);
  if (/[;"\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function formatNumberTr(value, digits = 2) {
  if (value == null || Number.isNaN(Number(value))) return "";
  return Number(value).toLocaleString("tr-TR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function monthlyCsv(snapshot) {
  const lines = [
    ["Rapor", "Aylık yakıt + masraf özeti"],
    ["Araç", snapshot.vehicleLabel],
    ["Ay", snapshot.monthLabel],
    ["Yakıt (₺)", formatNumberTr(snapshot.fuelCost)],
    ["Masraf (₺)", formatNumberTr(snapshot.expenseCost)],
    ["İşletme toplam (₺)", formatNumberTr(snapshot.operatingCost)],
    ["Litre", formatNumberTr(snapshot.litres)],
    ["Ort. L/100km", formatNumberTr(snapshot.consumption)],
    ["Km (dönem)", snapshot.distanceKm == null ? "" : String(snapshot.distanceKm)],
    ["₺/km", formatNumberTr(snapshot.costPerKm)],
    [],
    ["Tür", "Tarih", "Km", "Litre", "Kalem", "Tutar (₺)", "Not"],
  ];

  for (const row of snapshot.fuels || []) {
    lines.push([
      "Yakıt",
      row.tarih || "",
      row.km ?? "",
      row.litre ?? "",
      "",
      row.ucret ?? "",
      row.not || "",
    ]);
  }
  for (const row of snapshot.expenses || []) {
    lines.push([
      "Masraf",
      row.tarih || "",
      row.km ?? "",
      "",
      row.kalem || "",
      row.ucret ?? "",
      row.not || "",
    ]);
  }

  return `${lines.map((line) => line.map(csvCell).join(";")).join("\r\n")}\r\n`;
}

export function csvFilename(snapshot) {
  const plate = normalizePlate(snapshot.vehicleLabel.split("·")[0] || "arac")
    .replace(/\s+/g, "-")
    .toLowerCase();
  return `ozet-${plate || "arac"}-${snapshot.yearMonth}.csv`;
}
