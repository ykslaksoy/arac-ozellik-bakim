import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("hero-photo tam araç: contain, merkez, ölçek kırpması yok", () => {
  const css = readFileSync(new URL("../css/styles.css", import.meta.url), "utf8");
  const block = css.match(/\.hero-photo\s*\{[^}]+\}/s);
  assert.ok(block, ".hero-photo rule missing");
  const rule = block[0];
  assert.match(rule, /object-fit:\s*contain/);
  assert.match(rule, /object-position:\s*center;/);
  assert.doesNotMatch(rule, /object-fit:\s*cover/);
  assert.doesNotMatch(rule, /transform:\s*scale\(/);
});
