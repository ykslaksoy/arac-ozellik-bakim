/**
 * BYOD ECU veritabanı — yalnızca cihazda saklama ve kullanıcı onayı.
 * Zip içeriği bu modülde parse edilmez (ileriki faz).
 */

export const BYOD_STORAGE_KEY = "aob-byod-database-v1";

const CONSENT_KEY = "aob-byod-legal-consent-v1";

function readRecord() {
  try {
    const raw = localStorage.getItem(BYOD_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function writeRecord(record) {
  localStorage.setItem(BYOD_STORAGE_KEY, JSON.stringify(record));
}

/**
 * Kullanıcının veri kaynağı onayını kaydeder.
 * @param {boolean} accepted
 */
export function recordDataSourceConsent(accepted) {
  if (!accepted) {
    localStorage.removeItem(CONSENT_KEY);
    return { ok: false, consentedAt: null };
  }
  const consentedAt = new Date().toISOString();
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ accepted: true, consentedAt }),
  );
  return { ok: true, consentedAt };
}

/**
 * @returns {{ accepted: boolean, consentedAt: string | null }}
 */
export function getDataSourceConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return { accepted: false, consentedAt: null };
    const parsed = JSON.parse(raw);
    if (!parsed?.accepted) return { accepted: false, consentedAt: null };
    return {
      accepted: true,
      consentedAt: parsed.consentedAt || null,
    };
  } catch {
    return { accepted: false, consentedAt: null };
  }
}

/**
 * İçe aktarma meta verisini kaydeder (zip binary bu fazda saklanmaz).
 * @param {{ fileName: string, fingerprintSha256: string, importedAt?: string }} meta
 */
export function saveFingerprint(meta) {
  const consent = getDataSourceConsent();
  if (!consent.accepted) {
    return { ok: false, error: "USER_CONSENT_REQUIRED" };
  }
  if (!meta?.fileName || !meta?.fingerprintSha256) {
    return { ok: false, error: "INVALID_META" };
  }
  const importedAt = meta.importedAt || new Date().toISOString();
  const record = {
    imported: true,
    fileName: String(meta.fileName),
    fingerprintSha256: String(meta.fingerprintSha256),
    importedAt,
  };
  writeRecord(record);
  return { ok: true, record };
}

export function hasImportedDatabase() {
  const record = readRecord();
  return Boolean(record?.imported && record?.fingerprintSha256);
}

/**
 * @returns {{
 *   standardsSummary: string,
 *   consent: { accepted: boolean, consentedAt: string | null },
 *   import: { imported: boolean, fileName: string | null, fingerprintSha256: string | null, importedAt: string | null }
 * }}
 */
export function getByodDataStatus() {
  const record = readRecord();
  const consent = getDataSourceConsent();
  return {
    standardsSummary:
      "ECU arşivleri repoda dağıtılmaz; kaynağınızdan yalnızca cihazınıza aktarın.",
    consent,
    import: {
      imported: Boolean(record?.imported),
      fileName: record?.fileName ?? null,
      fingerprintSha256: record?.fingerprintSha256 ?? null,
      importedAt: record?.importedAt ?? null,
    },
  };
}

export function clearByodDatabase() {
  localStorage.removeItem(BYOD_STORAGE_KEY);
  localStorage.removeItem(CONSENT_KEY);
}

/**
 * Zip dosyası için SHA-256 (tarayıcı veya Node test ortamı).
 * @param {ArrayBuffer} buffer
 */
export async function sha256Hex(buffer) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle?.digest) {
    const { createHash } = await import("node:crypto");
    return createHash("sha256").update(Buffer.from(buffer)).digest("hex");
  }
  const hash = await subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * @param {File | { name: string, arrayBuffer: () => Promise<ArrayBuffer> }} file
 */
export async function fingerprintZipFile(file) {
  const buffer = await file.arrayBuffer();
  const fingerprintSha256 = await sha256Hex(buffer);
  return {
    fileName: file.name || "database.zip",
    fingerprintSha256,
    importedAt: new Date().toISOString(),
  };
}
