import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_HERO_GALLERY,
  DEFAULT_HERO_INDEX,
  DEFAULT_HERO_SRC,
  HERO_PLATE,
  HOME_ACTIONS_BOTTOM,
  HOME_ACTIONS_TOP,
  ICONS,
  OBD_PILL,
  TAB_ITEMS,
  demoState,
  formatKm,
  formatLitres,
  formatRemainingKm,
  formatWholeTl,
  clampHeroIndex,
  HERO_LEFT_IDS,
  heroCaptionHidden,
  heroImageSrc,
  heroSlides,
  heroTrackOffset,
  heroVisualIndex,
  loopedHeroSlides,
  nextHeroIndex,
  swipeLeftHeroIds,
  homeMetrics,
  homeVehicle,
  maybeSeedDemo,
  metricCards,
  tabActive,
} from "../js/home.js";

test("demo garaj: 2 araç, Megane plakası, mock metrikler", () => {
  const state = demoState(new Date("2026-09-11T12:00:00"));
  assert.equal(state.vehicles.length, 2);
  assert.equal(state.vehicles[0].plaka, HERO_PLATE);
  assert.equal(homeVehicle(state).plaka, HERO_PLATE);

  const m = homeMetrics(state, new Date("2026-09-11T12:00:00"));
  assert.equal(m.fuelCost, 1250);
  assert.equal(m.fuelLitres, 61.2);
  assert.equal(m.expenseCost, 2480);
  assert.equal(m.expenseCount, 4);
  assert.equal(Number(m.consumption.toFixed(1)), 6.4);
  assert.equal(m.lastServiceKm, 12540);
  assert.equal(m.remainingKm, 15000);
  assert.equal(m.vehicleCount, 2);
});

test("metrik kartları kilitli mock metinlerini üretir", () => {
  const cards = metricCards(
    homeMetrics(demoState(new Date("2026-09-11")), new Date("2026-09-11")),
  );
  assert.equal(cards[0].value, "1.250 TL");
  assert.equal(cards[0].hint, "61,2 L");
  assert.equal(cards[1].value, "2.480 TL");
  assert.equal(cards[1].hint, "4 işlem");
  assert.equal(cards[2].value, "6,4 L");
  assert.equal(cards[2].hint, "Uzun dönem");
  assert.equal(cards[3].value, "12.540 km");
  assert.equal(cards[3].hint, "15.000 kaldı");
});

test("hero: model/yıl/motor/EDC yazısı yok, varsayılan Megane görseli", () => {
  assert.equal(heroCaptionHidden(), true);
  assert.equal(heroImageSrc({}), DEFAULT_HERO_SRC);
  assert.equal(heroImageSrc({}, DEFAULT_HERO_INDEX), DEFAULT_HERO_SRC);
});

test("hero galeri: sağ + sol açılar, sola kaydırma, döngü", () => {
  assert.ok(DEFAULT_HERO_GALLERY.length >= 5);
  assert.deepEqual(
    DEFAULT_HERO_GALLERY.map((s) => s.id),
    [
      "front",
      "right-three-quarter",
      "left-three-quarter",
      "left-side",
      "rear-quarter",
      "rear",
    ],
  );
  const srcs = DEFAULT_HERO_GALLERY.map((s) => s.src);
  assert.equal(new Set(srcs).size, srcs.length);
  assert.ok(srcs.includes("assets/hero-megane-left-q.png"));
  assert.ok(srcs.includes("assets/hero-megane-side.png"));
  assert.deepEqual(HERO_LEFT_IDS, ["left-three-quarter", "left-side"]);
  assert.deepEqual(swipeLeftHeroIds(DEFAULT_HERO_INDEX), HERO_LEFT_IDS);
  assert.equal(
    heroImageSrc({}, nextHeroIndex(DEFAULT_HERO_INDEX, srcs.length, 1)),
    "assets/hero-megane-left-q.png",
  );
  assert.equal(
    heroImageSrc({}, nextHeroIndex(DEFAULT_HERO_INDEX, srcs.length, 2)),
    "assets/hero-megane-side.png",
  );

  const builtIn = heroSlides({});
  assert.equal(builtIn.length, 6);
  assert.equal(builtIn[0], "assets/hero-megane-front.png");
  assert.equal(builtIn[1], DEFAULT_HERO_SRC);
  assert.ok(builtIn.every((src) => src.startsWith("assets/hero-megane")));
  const looped = loopedHeroSlides(builtIn);
  assert.equal(looped.length, 8);
  assert.equal(looped[0], builtIn[5]);
  assert.equal(looped[7], builtIn[0]);
  assert.ok(looped.every(Boolean));
  assert.equal(heroVisualIndex(0, 6), 1);
  assert.equal(heroVisualIndex(1, 6), 2);
  assert.equal(heroTrackOffset(0, 6), -100);
  assert.equal(heroTrackOffset(1, 6), -200);
  assert.equal(nextHeroIndex(0, 6, -1), 5);

  const withUser = heroSlides({
    foto: "data:image/jpeg;base64,aa",
    fotos: ["data:image/jpeg;base64,bb"],
  });
  assert.equal(withUser.length, 8);
  assert.equal(withUser[6], "data:image/jpeg;base64,aa");
  assert.equal(withUser[7], "data:image/jpeg;base64,bb");
  assert.equal(clampHeroIndex(-1, 6), 5);
  assert.equal(nextHeroIndex(5, 6, 1), 0);
  assert.equal(heroImageSrc({ foto: "data:image/jpeg;base64,xx" }, 6), "data:image/jpeg;base64,xx");
});

test("OBD pill bağlı değil; halka/overlay yok", () => {
  assert.equal(OBD_PILL.connected, false);
  assert.equal(OBD_PILL.label, "Bağlı değil");
  assert.equal(OBD_PILL.overlay, false);
  assert.equal(OBD_PILL.ring, false);
});

test("Tara viewfinder ikonu; yakıt pompası değil", () => {
  assert.equal(HOME_ACTIONS_TOP[0].icon, "scan");
  assert.match(ICONS.scan, /M4 8V6/);
  assert.doesNotMatch(ICONS.scan, /15\.5 7\.5/);
  assert.match(ICONS.fuel, /15\.5 7\.5/);
});

test("orta ızgara ve alt nav etiketleri kilitli", () => {
  assert.deepEqual(
    HOME_ACTIONS_TOP.map((a) => a.label),
    ["Tara", "Yakıt", "Masraf", "Özet"],
  );
  assert.deepEqual(
    HOME_ACTIONS_BOTTOM.map((a) => a.label),
    ["Bakım", "Arıza", "Gizli özellik", "Ekspertiz"],
  );
  assert.deepEqual(
    TAB_ITEMS.map((a) => a.label),
    ["Ana sayfa", "Araçlarım", "Hatırlatıcı", "Performans", "Ayarlar"],
  );
  assert.equal(TAB_ITEMS[1].badge, true);
  assert.equal(tabActive("/", "/"), true);
  assert.equal(tabActive("/araclar", "/"), false);
});

test("boş state demo ile doldurulur", () => {
  const state = { vehicles: [], fuels: [], expenses: [], maintenances: [], reminders: [] };
  maybeSeedDemo(state);
  assert.equal(state.vehicles.length, 2);
});

test("sayı biçimleri", () => {
  assert.equal(formatWholeTl(1250), "1.250 TL");
  assert.equal(formatLitres(61.2), "61,2 L");
  assert.equal(formatKm(12540), "12.540 km");
  assert.equal(formatRemainingKm(15000), "15.000 kaldı");
});
