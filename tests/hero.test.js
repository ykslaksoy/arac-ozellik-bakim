import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_CAR_COLOR,
  applyCarPalette,
  carPalette,
  heroCaption,
  heroMode,
  luminance,
  normalizeHex,
  resolveVehicleColor,
  rgbToHex,
  silhouetteMarkup,
} from "../js/hero.js";

test("renk: boş ve bilinmeyen varsayılana düşer", () => {
  assert.equal(resolveVehicleColor(""), DEFAULT_CAR_COLOR);
  assert.equal(resolveVehicleColor("   "), DEFAULT_CAR_COLOR);
  assert.equal(resolveVehicleColor("xyzzy"), DEFAULT_CAR_COLOR);
});

test("renk: Türkçe ad, hex ve rgb çözülür", () => {
  assert.equal(resolveVehicleColor("kırmızı"), "#b42318");
  assert.equal(resolveVehicleColor("Metalik Mavi"), "#1d4e89");
  assert.equal(resolveVehicleColor("#c00"), "#cc0000");
  assert.equal(resolveVehicleColor("#0F6B5C"), "#0f6b5c");
  assert.equal(resolveVehicleColor("rgb(12, 34, 56)"), rgbToHex(12, 34, 56));
});

test("hex kısaltması ve parlaklık", () => {
  assert.equal(normalizeHex("#abc"), "#aabbcc");
  assert.ok(luminance("#ffffff") > luminance("#111111"));
});

test("palet gövde rengini korur", () => {
  const palette = carPalette("Siyah");
  assert.equal(palette.body, resolveVehicleColor("Siyah"));
  assert.match(palette.hi, /^#[0-9a-f]{6}$/);
  assert.match(palette.lo, /^#[0-9a-f]{6}$/);
});

test("hero: foto varsa foto, yoksa silüet", () => {
  assert.equal(heroMode(null), "silhouette");
  assert.equal(heroMode({}), "silhouette");
  assert.equal(heroMode({ foto: "" }), "silhouette");
  assert.equal(heroMode({ foto: "data:image/jpeg;base64,xx" }), "photo");
});

test("hero başlığı marka/model/plaka kullanır", () => {
  assert.equal(heroCaption(null).title, "Garajın");
  const cap = heroCaption({
    marka: "Renault",
    model: "Clio",
    plaka: "34 ABC 123",
    yil: 2018,
    km: 42000,
  });
  assert.equal(cap.title, "Renault Clio");
  assert.match(cap.meta, /34 ABC 123/);
  assert.match(cap.meta, /42\.000 km/);
});

test("silüet SVG gövde ve tekerlek içerir", () => {
  const svg = silhouetteMarkup("t1");
  assert.match(svg, /viewBox="0 0 860 340"/);
  assert.match(svg, /id="t1-body"/);
  assert.match(svg, /var\(--car-body\)/);
  assert.match(svg, /car-wheel/);
});

test("applyCarPalette CSS değişkeni yazar", () => {
  const style = new Map();
  const fake = {
    style: {
      setProperty(k, v) {
        style.set(k, v);
      },
    },
  };
  applyCarPalette(fake, "Beyaz");
  assert.equal(style.get("--car-body"), resolveVehicleColor("Beyaz"));
  assert.ok(style.get("--car-hi"));
});
