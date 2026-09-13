import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_HERO_GALLERY,
  DEFAULT_HERO_INDEX,
  DEFAULT_HERO_SRC,
  DEMO_MEGANE_YEAR,
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
  HERO_ORBIT_IDS,
  heroCaptionHidden,
  heroImageSrc,
  heroSlides,
  heroTrackOffset,
  heroVisualIndex,
  loopedHeroSlides,
  nextHeroIndex,
  dragRightHeroIds,
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
  assert.equal(state.vehicles[0].yil, DEMO_MEGANE_YEAR);
  assert.equal(DEMO_MEGANE_YEAR, "2012");
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

test("hero galeri: saat yönü ön → yan → arka; varsayılan paneled ön-sağ", () => {
  assert.equal(DEFAULT_HERO_INDEX, 1);
  assert.equal(DEFAULT_HERO_GALLERY[DEFAULT_HERO_INDEX].src, DEFAULT_HERO_SRC);
  assert.deepEqual(HERO_ORBIT_IDS, [
    "front",
    "right-three-quarter",
    "right-side",
    "rear-right-quarter",
    "rear",
    "rear-left-quarter",
    "left-side",
    "left-three-quarter",
  ]);
  assert.deepEqual(
    DEFAULT_HERO_GALLERY.map((s) => s.src),
    [
      "assets/hero-megane-front.png",
      "assets/hero-megane.png",
      "assets/hero-megane-right.png",
      "assets/hero-megane-rear-right-q.png",
      "assets/hero-megane-rear.png",
      "assets/hero-megane-rear-left-q.png",
      "assets/hero-megane-left.png",
      "assets/hero-megane-left-q.png",
    ],
  );
  const srcs = DEFAULT_HERO_GALLERY.map((s) => s.src);
  assert.equal(new Set(srcs).size, 8);
  assert.ok(HERO_LEFT_IDS.every((id) => HERO_ORBIT_IDS.includes(id)));
  // +1 from default (ön-sağ) → sağ yan → arka-sağ
  assert.deepEqual(dragRightHeroIds(DEFAULT_HERO_INDEX), [
    "right-side",
    "rear-right-quarter",
  ]);
  assert.equal(nextHeroIndex(0, 8, 1), 1);
  assert.equal(nextHeroIndex(0, 8, -1), 7);
  assert.equal(nextHeroIndex(7, 8, 1), 0);
  assert.equal(DEFAULT_HERO_GALLERY[0].id, "front");
  assert.equal(DEFAULT_HERO_GALLERY[1].id, "right-three-quarter");
  assert.equal(DEFAULT_HERO_GALLERY[2].id, "right-side");
  assert.equal(DEFAULT_HERO_GALLERY[4].id, "rear");
  assert.equal(DEFAULT_HERO_GALLERY[7].id, "left-three-quarter");

  const builtIn = heroSlides({});
  assert.equal(builtIn.length, 8);
  assert.equal(builtIn[DEFAULT_HERO_INDEX], DEFAULT_HERO_SRC);
  assert.ok(builtIn.every((src) => src.startsWith("assets/hero-megane")));
  const looped = loopedHeroSlides(builtIn);
  assert.equal(looped.length, 10);
  assert.equal(looped[0], builtIn[7]);
  assert.equal(looped[9], builtIn[0]);
  assert.ok(looped.every(Boolean));
  assert.equal(heroVisualIndex(0, 8), 1);
  assert.equal(heroTrackOffset(0, 8), -100);
  assert.equal(heroTrackOffset(1, 8), -200);

  const withUser = heroSlides({
    foto: "data:image/jpeg;base64,aa",
    fotos: ["data:image/jpeg;base64,bb"],
  });
  assert.equal(withUser.length, 10);
  assert.equal(withUser[8], "data:image/jpeg;base64,aa");
  assert.equal(withUser[9], "data:image/jpeg;base64,bb");
  assert.equal(clampHeroIndex(-1, 8), 7);
  assert.equal(heroImageSrc({ foto: "data:image/jpeg;base64,xx" }, 8), "data:image/jpeg;base64,xx");
});

test("OBD pill bağlı değil; halka/overlay yok", () => {
  assert.equal(OBD_PILL.connected, false);
  assert.equal(OBD_PILL.label, "Bağlı değil");
  assert.equal(OBD_PILL.overlay, false);
  assert.equal(OBD_PILL.ring, false);
});

test("Referans ikon şekilleri: scan frame, yakıt nozül, pasta özet", () => {
  assert.equal(HOME_ACTIONS_TOP[0].icon, "scan");
  assert.match(ICONS.scan, /M7\.2 4\.2H5\.2/);
  assert.match(ICONS.scan, /M8\.2 12h7\.6/);
  assert.doesNotMatch(ICONS.scan, /circle cx="12"/);
  assert.match(ICONS.fuel, /fill-opacity="\.16"/);
  assert.match(ICONS.fuel, /M10\.4 10\.2v7\.2/);
  assert.match(ICONS.card, /circle cx="17\.4"/);
  assert.match(ICONS.gauge, /M16\.8 5\.1v2\.1/);
  assert.match(ICONS.dipstick, /M8\.4 16\.2/);
  assert.match(ICONS.chassis, /M16\.4 14\.2/);
  assert.match(ICONS.lock, /M18 15\.9v3/);
  assert.match(ICONS.list, /M8\.8 10 10 11\.2/);
  assert.match(ICONS.sliders, /circle cx="12" cy="12"/);
  assert.match(ICONS.chevronLeft, /14\.5 6\.5/);
  assert.match(ICONS.chevronRight, /9\.5 6\.5/);
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
