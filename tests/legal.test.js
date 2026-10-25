import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "Bytespider",
  "Applebot-Extended",
  "meta-externalagent",
];

test("robots.txt: genel izin, AI tarayıcıları engelli", () => {
  const robots = readFileSync(join(root, "robots.txt"), "utf8");
  assert.match(robots, /User-agent: \*\s*\nAllow: \//);
  for (const bot of AI_CRAWLERS) {
    assert.match(robots, new RegExp(`User-agent: ${bot}\\s*\\nDisallow: /`));
  }
  assert.doesNotMatch(robots, /User-agent: Googlebot[\s\S]*Disallow: \//);
});

test("kullanim-sartlari.html: zorunlu maddeler ve yürürlük tarihi", () => {
  const html = readFileSync(join(root, "kullanim-sartlari.html"), "utf8");
  assert.match(html, /20 Ekim 2026|2026-10-20/);
  assert.match(html, /bot|otomatik/i);
  assert.match(html, /harvest|toplayamaz/i);
  assert.match(html, /tersine mühendislik/i);
  assert.match(html, /rakip|benchmark|kıyaslamak/i);
  assert.match(html, /askıya alınabilir|sonlandırılabilir/i);
  assert.match(html, /Türkiye/);
  assert.match(html, /github\.com\/ykslaksoy\/arac-ozellik-bakim/);
});
