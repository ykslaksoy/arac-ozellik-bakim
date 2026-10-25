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

const {
  BYOD_STORAGE_KEY,
  recordDataSourceConsent,
  saveFingerprint,
  hasImportedDatabase,
  getByodDataStatus,
  getDataSourceConsent,
  clearByodDatabase,
  sha256Hex,
} = await import("../js/byodDatabase.js");

test("onay olmadan parmak izi kaydedilemez", () => {
  clearByodDatabase();
  const result = saveFingerprint({
    fileName: "ecu.zip",
    fingerprintSha256: "abc123",
  });
  assert.equal(result.ok, false);
  assert.equal(result.error, "USER_CONSENT_REQUIRED");
  assert.equal(hasImportedDatabase(), false);
});

test("onay sonrası parmak izi ve durum", async () => {
  clearByodDatabase();
  const consent = recordDataSourceConsent(true);
  assert.equal(consent.ok, true);
  assert.ok(consent.consentedAt);

  const fp = "deadbeef".repeat(8);
  const saved = saveFingerprint({
    fileName: "my-ecu-archive.zip",
    fingerprintSha256: fp,
    importedAt: "2026-10-09T12:00:00.000Z",
  });
  assert.equal(saved.ok, true);
  assert.equal(hasImportedDatabase(), true);

  const status = getByodDataStatus();
  assert.equal(status.consent.accepted, true);
  assert.equal(status.import.imported, true);
  assert.equal(status.import.fileName, "my-ecu-archive.zip");
  assert.equal(status.import.fingerprintSha256, fp);

  const raw = localStorage.getItem(BYOD_STORAGE_KEY);
  assert.ok(raw);
  const parsed = JSON.parse(raw);
  assert.equal(parsed.imported, true);
});

test("onay kaldırıldığında consent temizlenir", () => {
  recordDataSourceConsent(true);
  recordDataSourceConsent(false);
  assert.equal(getDataSourceConsent().accepted, false);
});

test("sha256Hex tutarlı", async () => {
  const enc = new TextEncoder();
  const hex = await sha256Hex(enc.encode("test").buffer);
  assert.equal(hex.length, 64);
  assert.match(hex, /^[0-9a-f]+$/);
});
