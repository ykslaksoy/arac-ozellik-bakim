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
  ORBIT_SLOT_COUNT,
  ORBIT_SLOTS,
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
  isMegane3Vehicle,
  loopedHeroSlides,
  nextHeroIndex,
  dragRightHeroIds,
  homeMetrics,
  homeVehicle,
  maybeSeedDemo,
  metricCards,
  normalizeOrbitSlots,
  orbitFillStatus,
  tabActive,
  validateOrbitSlots,
} from "../js/home.js";

test("demo garaj: 2 araç, Megane plakası, mock metrikler", () => {
  const state = demoState(new Date("2026-09-11T12:00:00"));
  assert.equal(state.vehicles.length, 2);
  assert.equal(state.vehicles[0].plaka, HERO_PLATE);
  assert.equal(state.vehicles[0].yil, DEMO_MEGANE_YEAR);
  assert.equal(DEMO_MEGANE_YEAR, "2012");
  assert.equal(homeVehicle(state).plaka, HERO_PLATE);
  assert.equal(isMegane3Vehicle(state.vehicles[0]), true);
  assert.equal(isMegane3Vehicle(state.vehicles[1]), false);

  const m = homeMetrics(state, new Date("2026-09-11T12:00:00"));
  assert.equal(m.fuelCost, 5600);
  assert.equal(m.fuelLitres, 64.2);
  assert.equal(m.expenseCost, 2830);
  assert.equal(m.expenseCount, 4);
  assert.equal(Number(m.consumption.toFixed(1)), 5.7);
  assert.equal(m.lastServiceKm, 12540);
  assert.equal(m.remainingKm, 15000);
  assert.equal(m.vehicleCount, 2);
});

test("metrik kartları kilitli mock metinlerini üretir", () => {
  const cards = metricCards(
    homeMetrics(demoState(new Date("2026-09-11")), new Date("2026-09-11")),
  );
  assert.equal(cards[0].value, "5.600 TL");
  assert.equal(cards[0].hint, "64,2 L");
  assert.equal(cards[1].value, "2.830 TL");
  assert.equal(cards[1].hint, "4 işlem");
  assert.equal(cards[2].value, "5,7 L");
  assert.equal(cards[2].hint, "Uzun dönem");
  assert.equal(cards[3].value, "12.540 km");
  assert.equal(cards[3].hint, "15.000 kaldı");
});

test("hero: model/yıl/motor/EDC yazısı yok, varsayılan Megane görseli", () => {
  assert.equal(heroCaptionHidden(), true);
  assert.equal(heroImageSrc({}), DEFAULT_HERO_SRC);
  assert.equal(heroImageSrc({}, DEFAULT_HERO_INDEX), DEFAULT_HERO_SRC);
});

test("hero galeri: sol dönüş ön → sol çapraz → … → sağ ön; Megane otomatik", () => {
  assert.equal(ORBIT_SLOT_COUNT, 8);
  assert.equal(ORBIT_SLOTS.length, 8);
  assert.equal(DEFAULT_HERO_INDEX, 0);
  assert.equal(DEFAULT_HERO_GALLERY[DEFAULT_HERO_INDEX].src, DEFAULT_HERO_SRC);
  assert.equal(DEFAULT_HERO_SRC, "assets/orbit-m3-0-front.png");
  assert.equal(DEFAULT_HERO_GALLERY[0].id, "front");
  assert.deepEqual(HERO_ORBIT_IDS, [
    "front",
    "left-three-quarter",
    "left-side",
    "rear-left-quarter",
    "rear",
    "rear-right-quarter",
    "right-side",
    "right-three-quarter",
  ]);
  assert.deepEqual(
    DEFAULT_HERO_GALLERY.map((s) => s.src),
    [
      "assets/orbit-m3-0-front.png",
      "assets/orbit-m3-1-front-left.png",
      "assets/orbit-m3-2-left.png",
      "assets/orbit-m3-3-rear-left.png",
      "assets/orbit-m3-4-rear.png",
      "assets/orbit-m3-5-rear-right.png",
      "assets/orbit-m3-6-right.png",
      "assets/orbit-m3-7-front-right.png",
    ],
  );
  assert.deepEqual(
    ORBIT_SLOTS.map((s) => s.shortLabel),
    [
      "Önden",
      "Sol çapraz",
      "Soldan",
      "Sol arka çapraz",
      "Arkadan",
      "Arka sağ çapraz",
      "Sağdan",
      "Sağ ön çapraz",
    ],
  );
  const srcs = DEFAULT_HERO_GALLERY.map((s) => s.src);
  assert.equal(new Set(srcs).size, 8);
  assert.ok(HERO_LEFT_IDS.every((id) => HERO_ORBIT_IDS.includes(id)));
  // +1 from default (ön) → sol çapraz → sol
  assert.deepEqual(dragRightHeroIds(DEFAULT_HERO_INDEX), [
    "left-three-quarter",
    "left-side",
  ]);
  const tour = [];
  let i = 0;
  for (let step = 0; step < 8; step++) {
    tour.push(DEFAULT_HERO_GALLERY[i].id);
    i = nextHeroIndex(i, 8, 1);
  }
  assert.deepEqual(tour, HERO_ORBIT_IDS);
  assert.equal(nextHeroIndex(0, 8, 1), 1);
  assert.equal(nextHeroIndex(0, 8, -1), 7);
  assert.equal(nextHeroIndex(7, 8, 1), 0);
  assert.equal(DEFAULT_HERO_GALLERY[0].id, "front");
  assert.equal(DEFAULT_HERO_GALLERY[1].id, "left-three-quarter");
  assert.equal(DEFAULT_HERO_GALLERY[2].id, "left-side");
  assert.equal(DEFAULT_HERO_GALLERY[4].id, "rear");
  assert.equal(DEFAULT_HERO_GALLERY[7].id, "right-three-quarter");

  const megane = {
    id: "demo-megane",
    plaka: HERO_PLATE,
    marka: "Renault",
    model: "Megane 3 SW",
  };
  const builtIn = heroSlides(megane);
  assert.equal(builtIn.length, 8);
  assert.equal(builtIn[DEFAULT_HERO_INDEX], DEFAULT_HERO_SRC);
  assert.ok(builtIn.every((src) => src.startsWith("assets/orbit-m3-")));
  const looped = loopedHeroSlides(builtIn);
  assert.equal(looped.length, 10);
  assert.equal(looped[0], builtIn[7]);
  assert.equal(looped[9], builtIn[0]);
  assert.ok(looped.every(Boolean));
  assert.equal(heroVisualIndex(0, 8), 1);
  assert.equal(heroTrackOffset(0, 8), -100);
  assert.equal(heroTrackOffset(1, 8), -200);

  const custom = Array.from({ length: 8 }, (_, n) => `data:image/jpeg;base64,c${n}`);
  const withOrbit = heroSlides({ ...megane, orbit: custom });
  assert.deepEqual(withOrbit, custom);
  const partial = heroSlides({ ...megane, orbit: custom.slice(0, 3) });
  assert.deepEqual(partial, builtIn);
  assert.equal(clampHeroIndex(-1, 8), 7);

  const clio = { marka: "Renault", model: "Clio" };
  assert.deepEqual(heroSlides(clio), []);
  assert.deepEqual(
    heroSlides({ ...clio, foto: "data:image/jpeg;base64,xx" }),
    ["data:image/jpeg;base64,xx"],
  );
});

test("orbit yükleme: tam 8 gerekli, eksik/fazla reddedilir", () => {
  assert.equal(normalizeOrbitSlots({}).length, 8);
  assert.equal(orbitFillStatus(normalizeOrbitSlots({})).missing, 8);
  const eight = Array.from({ length: 8 }, (_, i) => `img-${i}`);
  assert.equal(validateOrbitSlots(eight).ok, true);
  assert.match(validateOrbitSlots(eight.slice(0, 5)).message, /3 açı eksik/);
  assert.match(validateOrbitSlots([...eight, "extra"]).message, /fazla/);
  assert.equal(validateOrbitSlots([], { allowEmpty: true }).ok, true);
});

test("OBD pill bağlı değil; halka/overlay yok", () => {
  assert.equal(OBD_PILL.connected, false);
  assert.equal(OBD_PILL.label, "Bağlı değil");
  assert.equal(OBD_PILL.overlay, false);
  assert.equal(OBD_PILL.ring, false);
});

test("Referans ikon şekilleri: scan frame, yakıt nozül, pasta özet", () => {
  assert.equal(HOME_ACTIONS_TOP[0].icon, "scan");
  assert.match(ICONS.scan, /M8 3\.8H5\.4/);
  assert.doesNotMatch(ICONS.scan, /circle/);
  assert.match(ICONS.fuel, /fill-opacity="\.16"/);
  assert.match(ICONS.fuel, /L15\.1 11H6\.9/);
  assert.match(ICONS.card, /rect x="2\.9"/);
  assert.match(ICONS.card, /M11\.2 12\.4h6\.4|h6\.4/);
  assert.match(ICONS.gauge, /%/);
  assert.match(ICONS.gauge, /M12 4a8 8/);
  assert.match(ICONS.dipstick, /M14\.2 4\.6 19\.4 9\.8/);
  assert.match(ICONS.chassis, /M3\.8 10\.3h11\.2/);
  assert.match(ICONS.chassis, /16\.85 16\.55|17\.7 17\.45|19\.15 15\.85/);
  assert.match(ICONS.lock, /M18\.1 15\.9v3\.2|h3\.2/);
  assert.match(ICONS.list, /9\.8 10\.9|12\.5 8\.2/);
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
