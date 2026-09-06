const KEY = "aob-v1";

const defaultState = () => ({
  vehicles: [],
  maintenances: [],
  reminders: [],
  fuels: [],
  expenses: [],
});

function normalizeState(parsed) {
  return {
    vehicles: Array.isArray(parsed?.vehicles) ? parsed.vehicles : [],
    maintenances: Array.isArray(parsed?.maintenances) ? parsed.maintenances : [],
    reminders: Array.isArray(parsed?.reminders) ? parsed.reminders : [],
    fuels: Array.isArray(parsed?.fuels) ? parsed.fuels : [],
    expenses: Array.isArray(parsed?.expenses) ? parsed.expenses : [],
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return normalizeState(JSON.parse(raw));
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function exportJson(state) {
  return JSON.stringify(state, null, 2);
}

export function importJson(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object") throw new Error("Geçersiz dosya");
  return normalizeState(parsed);
}

export function clearAll() {
  localStorage.removeItem(KEY);
}
