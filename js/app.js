import {
  loadState,
  saveState,
  uid,
  exportJson,
  importJson,
  clearAll,
} from "./storage.js";
import {
  MARKALAR,
  MASRAF_KALEMLERI,
  costPerKm,
  csvFilename,
  currentYearMonth,
  formatTrPlate,
  inYearMonth,
  isValidTrPlate,
  litersPer100km,
  monthlyCsv,
  monthlySnapshot,
  sumField,
} from "./logic.js";
import {
  DEFAULT_HERO_INDEX,
  HINT_KEY,
  HOME_ACTIONS_BOTTOM,
  HOME_ACTIONS_TOP,
  TAB_ITEMS,
  clampHeroIndex,
  heroImageSrc,
  heroSlides,
  heroVisualIndex,
  homeMetrics,
  homeVehicle,
  iconSvg,
  loopedHeroSlides,
  maybeSeedDemo,
  metricCards,
  tabActive,
  userHeroPhotos,
} from "./home.js";

const YAKIT = ["Benzin", "Dizel", "LPG", "Hibrit", "Elektrik"];
const BAKIM_TUR = [
  "Yağ",
  "Filtre",
  "Lastik",
  "Muayene",
  "Fren",
  "Akü",
  "Diğer",
];

let state = loadState();
let dialogMode = null;
let editId = null;
let heroSlideIndex = DEFAULT_HERO_INDEX;
let filterVehicleId = "";
let filterMonth = currentYearMonth();

const app = document.getElementById("app");
const dialog = document.getElementById("formDialog");
const form = document.getElementById("entityForm");
const dialogTitle = document.getElementById("dialogTitle");
const dialogFields = document.getElementById("dialogFields");
const tabbar = document.getElementById("tabbar");

maybeSeedDemo(state, saveState);

function persist() {
  saveState(state);
}

function currentPath() {
  const hash = location.hash.replace(/^#/, "") || "/";
  return hash.split("?")[0] || "/";
}

function renderTabbar(path) {
  tabbar.replaceChildren();
  for (const item of TAB_ITEMS) {
    const link = el("a", {
      href: item.href,
      "data-nav": "",
      "data-route": item.route,
      className: tabActive(path, item.route) ? "active" : "",
    });
    link.innerHTML = iconSvg(item.icon);
    link.append(el("span", { text: item.label }));
    if (item.badge && state.vehicles.length) {
      link.append(el("span", { className: "tab-badge", text: String(state.vehicles.length) }));
    }
    tabbar.append(link);
  }
}

function route() {
  const path = currentPath();
  maybeSeedDemo(state, saveState);
  renderTabbar(path);
  app.replaceChildren();
  app.classList.toggle("page-home", path === "/");
  app.style.animation = "none";
  void app.offsetWidth;
  app.style.animation = "";

  if (path === "/") renderHome();
  else if (path === "/araclar") renderVehicles();
  else if (path === "/bakim") renderMaintenance();
  else if (path === "/yakit") renderFuel();
  else if (path === "/masraf") renderExpenses();
  else if (path === "/ozet") renderSummary();
  else if (path === "/hatirlaticilar") renderReminders();
  else if (path === "/ayarlar") renderSettings();
  else if (path === "/tara") renderPlaceholder("Tara", "Plaka veya evrak taraması yakında. Viewfinder ile belge çekeceksiniz.");
  else if (path === "/ariza") renderPlaceholder("Arıza", "Arıza kayıtları yakında. OBD bağlantısı yok; kodları elle girebilirsiniz.");
  else if (path === "/gizli") renderPlaceholder("Gizli özellik", "Gizli özellik listesi yakında. Bu ekran yalnızca yer tutucudur.");
  else if (path === "/ekspertiz") renderPlaceholder("Ekspertiz", "Ekspertiz notları yakında. Hasar ve ekspertiz kaydı burada tutulacak.");
  else if (path === "/performans") renderPlaceholder("Performans", "Tüketim ve masraf eğrisi yakında. Özet sayfasındaki veriler korunur.");
  else renderHome();
}

function vehicleById(id) {
  return state.vehicles.find((v) => v.id === id);
}

function vehicleLabel(id) {
  const v = vehicleById(id);
  if (!v) return "—";
  return `${v.plaka} · ${v.marka} ${v.model}`.trim();
}

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("tr-TR");
}

function fmtMoney(n, digits = 2) {
  if (n === "" || n == null || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(n));
}

function fmtRate(n, suffix) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return `${Number(n).toLocaleString("tr-TR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  })} ${suffix}`;
}

function rowsForVehicle(rows, vehicleId = filterVehicleId) {
  if (!vehicleId) return rows;
  return rows.filter((row) => row.vehicleId === vehicleId);
}

function daysUntil(iso) {
  if (!iso) return null;
  const target = new Date(`${iso}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

function reminderStatus(r) {
  const vehicle = vehicleById(r.vehicleId);
  const byDate = daysUntil(r.tarih);
  let byKm = null;
  if (r.hedefKm != null && r.hedefKm !== "" && vehicle) {
    byKm = Number(r.hedefKm) - Number(vehicle.km || 0);
  }
  const overdue =
    (byDate != null && byDate < 0) || (byKm != null && byKm < 0);
  const soon =
    !overdue &&
    ((byDate != null && byDate <= 30) || (byKm != null && byKm <= 1000));
  return { byDate, byKm, overdue, soon };
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "className") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (v !== undefined && v !== null) {
      node.setAttribute(k, v);
    }
  });
  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

function sectionHead(title, subtitle, action) {
  return el("div", { className: "section-head" }, [
    el("div", {}, [
      el("h1", { text: title }),
      subtitle ? el("p", { text: subtitle }) : null,
    ]),
    action || null,
  ]);
}

function emptyState(text) {
  return el("div", { className: "empty", text });
}

function actionRow(items) {
  const row = el("nav", { className: "action-row" });
  for (const item of items) {
    const link = el("a", { href: item.href, "data-nav": "" });
    const ico = el("span", { className: "action-ico" });
    ico.innerHTML = iconSvg(item.icon);
    link.append(ico, el("span", { text: item.label }));
    row.append(link);
  }
  return row;
}

function paintHeroDots(dots, index, length) {
  dots.replaceChildren();
  for (let i = 0; i < length; i += 1) {
    dots.append(
      el("button", {
        type: "button",
        className: `hero-dot${i === index ? " active" : ""}`,
        "aria-label": `Fotoğraf ${i + 1}`,
        onClick: () => {
          heroSlideIndex = i;
          const track = dots.parentElement?.querySelector(".hero-track");
          const stage = dots.parentElement?.querySelector(".hero-stage");
          if (track) setHeroTrack(track, i, length, { stage });
          paintHeroDots(dots, i, length);
        },
      }),
    );
  }
}

function heroStageWidth(stage) {
  return stage?.clientWidth || 0;
}

function sizeHeroSlides(stage, track) {
  const w = heroStageWidth(stage);
  if (!w) return 0;
  for (const slide of track.children) {
    slide.style.flex = `0 0 ${w}px`;
    slide.style.width = `${w}px`;
    slide.style.minWidth = `${w}px`;
  }
  return w;
}

function setHeroTrack(track, index, length, options = {}) {
  const { instant = false, visual, stage } = options;
  const host = stage || track.parentElement;
  const w = sizeHeroSlides(host, track);
  const v = visual == null ? heroVisualIndex(index, length) : visual;
  if (instant) track.style.transition = "none";
  track.style.transform = w
    ? `translate3d(${-v * w}px, 0, 0)`
    : `translateX(${-v * 100}%)`;
  if (instant) {
    void track.offsetWidth;
    track.style.transition = "";
  }
}

function bindHeroCarousel(stage, track, dots, length) {
  let startX = 0;
  let dragging = false;
  let origin = 0;

  const go = (index) => {
    const prev = heroSlideIndex;
    const next = clampHeroIndex(index, length);
    heroSlideIndex = next;
    if (length > 1 && prev === 0 && next === length - 1) {
      setHeroTrack(track, next, length, { stage, visual: 0 });
    } else if (length > 1 && prev === length - 1 && next === 0) {
      setHeroTrack(track, next, length, { stage, visual: length + 1 });
    } else {
      setHeroTrack(track, next, length, { stage });
    }
    paintHeroDots(dots, heroSlideIndex, length);
  };

  track.addEventListener("transitionend", (e) => {
    if (e.target !== track || (e.propertyName && e.propertyName !== "transform")) return;
    setHeroTrack(track, heroSlideIndex, length, { stage, instant: true });
  });

  stage.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".foto-chip, .hero-dots, .hero-nav, button")) return;
    dragging = true;
    startX = e.clientX;
    origin = heroSlideIndex;
    stage.classList.add("is-dragging");
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const w = heroStageWidth(stage) || 1;
    const visual = heroVisualIndex(origin, length);
    track.style.transform = `translate3d(${-(visual * w) - dx}px, 0, 0)`;
  });
  const end = (e) => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("is-dragging");
    const dx = e.clientX - startX;
    // Sola kaydır = sonraki açı (+1); sağa kaydır = önceki (-1)
    if (dx < -40) go(origin + 1);
    else if (dx > 40) go(origin - 1);
    else go(origin);
  };
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);

  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(heroSlideIndex + 1);
    if (e.key === "ArrowLeft") go(heroSlideIndex - 1);
  });

  stage._heroGo = go;

  if (typeof ResizeObserver === "function") {
    const ro = new ResizeObserver(() => {
      setHeroTrack(track, heroSlideIndex, length, { stage, instant: true });
    });
    ro.observe(stage);
  }
}

async function readCompressedPhoto(file) {
  if (!file) return null;
  try {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode();
    const max = 1400;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    alert("Görsel yüklenemedi. JPG veya PNG deneyin.");
    return null;
  }
}

function persistVehiclePatch(id, patch) {
  state.vehicles = state.vehicles.map((v) => (v.id === id ? { ...v, ...patch } : v));
  persist();
}

function renderHome() {
  const vehicle = homeVehicle(state);
  const cards = metricCards(homeMetrics(state));
  const showHint = localStorage.getItem(HINT_KEY) !== "1";
  const slides = heroSlides(vehicle);
  heroSlideIndex = clampHeroIndex(heroSlideIndex, slides.length);

  const track = el("div", { className: "hero-track" });
  for (const src of loopedHeroSlides(slides)) {
    const slide = el("div", { className: "hero-slide" });
    slide.append(
      el("img", {
        className: "hero-photo",
        src,
        alt: "",
        draggable: "false",
      }),
    );
    track.append(slide);
  }

  const prevBtn = el("button", {
    type: "button",
    className: "hero-nav hero-nav-prev",
    "aria-label": "Önceki açı",
  });
  prevBtn.innerHTML = iconSvg("chevronLeft");
  const nextBtn = el("button", {
    type: "button",
    className: "hero-nav hero-nav-next",
    "aria-label": "Sonraki açı",
  });
  nextBtn.innerHTML = iconSvg("chevronRight");

  const stage = el("div", {
    className: "hero-stage",
    tabindex: "0",
    "aria-label": "Arabayı oklarla veya sürükleyerek çevirin",
  }, [track, prevBtn, nextBtn]);

  const dots = el("div", { className: "hero-dots" });
  paintHeroDots(dots, heroSlideIndex, slides.length);
  bindHeroCarousel(stage, track, dots, slides.length);

  let navLock = false;
  const goPrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navLock) return;
    navLock = true;
    stage._heroGo?.(heroSlideIndex - 1);
    setTimeout(() => {
      navLock = false;
    }, 260);
  };
  const goNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navLock) return;
    navLock = true;
    stage._heroGo?.(heroSlideIndex + 1);
    setTimeout(() => {
      navLock = false;
    }, 260);
  };
  // pointerdown: touch/pen/mouse (bazı otomasyon click üretmez)
  prevBtn.addEventListener("pointerdown", goPrev);
  nextBtn.addEventListener("pointerdown", goNext);
  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);

  const foto = el("label", { className: "foto-chip" });
  foto.innerHTML = `${iconSvg("camera")}<span>Foto</span>`;
  foto.append(
    el("input", {
      type: "file",
      accept: "image/*",
      onChange: async (e) => {
        const dataUrl = await readCompressedPhoto(e.target.files?.[0]);
        e.target.value = "";
        if (!dataUrl || !vehicle) return;
        const fotos = userHeroPhotos(vehicle).filter((src) => src !== dataUrl);
        fotos.push(dataUrl);
        persistVehiclePatch(vehicle.id, { foto: dataUrl, fotos });
        heroSlideIndex = heroSlides({ ...vehicle, foto: dataUrl, fotos }).length - 1;
        route();
      },
    }),
  );

  const hero = el("section", { className: "hero-card" }, [
    stage,
    dots,
    foto,
  ]);

  const home = el("div", { className: "home" }, [hero]);

  if (showHint) {
    const hint = el("div", { className: "home-hint" });
    const copy = el("p");
    copy.innerHTML = `${iconSvg("bulb")}<span>İpucu · Oklar veya sürükleme ile çevirin</span>`;
    hint.append(
      copy,
      el("button", {
        type: "button",
        text: "Anladım",
        onClick: () => {
          localStorage.setItem(HINT_KEY, "1");
          hint.remove();
        },
      }),
    );
    home.append(hint);
  }

  home.append(
    actionRow(HOME_ACTIONS_TOP),
    el("div", { className: "metric-strip" }, cards.map((card) =>
      el("div", { className: "metric" }, [
        el("span", { className: "metric-label", text: card.label }),
        el("span", { className: "metric-value", text: card.value }),
        el("span", { className: "metric-hint", text: card.hint }),
      ]),
    )),
    actionRow(HOME_ACTIONS_BOTTOM),
  );

  app.append(home);
  setHeroTrack(track, heroSlideIndex, slides.length, { stage, instant: true });
}

function renderPlaceholder(title, text) {
  app.append(
    el("div", { className: "page-pad" }, [
      sectionHead(title, text),
    ]),
  );
}

function stat(label, value) {
  return el("div", { className: "stat" }, [
    el("span", { className: "stat-label", text: label }),
    el("span", { className: "stat-value", text: value }),
  ]);
}

function renderVehicles() {
  app.append(
    sectionHead(
      "Araçlarım",
      "Plaka, özellikler ve güncel kilometre",
      el("button", {
        type: "button",
        className: "btn btn-primary",
        text: "Yeni araç",
        onClick: () => openVehicleForm(),
      }),
    ),
  );

  if (!state.vehicles.length) {
    app.append(emptyState("Henüz araç yok. İlk aracınızı ekleyin."));
    return;
  }

  const list = el("div", { className: "list list-vehicles" });
  for (const v of state.vehicles) {
    const thumbSrc = heroImageSrc(v);
    const thumb = el("div", { className: "item-thumb-wrap" }, [
      el("img", {
        className: "item-thumb",
        src: thumbSrc,
        alt: "",
        loading: "lazy",
      }),
    ]);
    const titleBits = [v.marka, v.model].filter(Boolean).join(" ");
    list.append(
      el("article", { className: "item item-vehicle" }, [
        thumb,
        el("div", { className: "item-body" }, [
          el("h3", { className: "item-title", text: v.plaka || "Plakasız" }),
          titleBits
            ? el("p", { className: "item-subtitle", text: titleBits })
            : null,
          el("p", {
            className: "item-meta",
            text: [v.yil || null, v.yakit || null, `${Number(v.km || 0).toLocaleString("tr-TR")} km`]
              .filter(Boolean)
              .join(" · "),
          }),
          v.renk || v.motor || v.sasi
            ? el("p", {
                className: "item-meta item-meta-soft",
                text: [v.renk && `Renk ${v.renk}`, v.motor && `Motor ${v.motor}`, v.sasi && `Şasi ${v.sasi}`]
                  .filter(Boolean)
                  .join(" · "),
              })
            : null,
        ]),
        el("div", { className: "item-actions" }, [
          el("button", {
            type: "button",
            className: "btn btn-ghost btn-sm",
            text: "Düzenle",
            onClick: () => openVehicleForm(v),
          }),
          el("button", {
            type: "button",
            className: "btn btn-danger btn-sm",
            text: "Sil",
            onClick: () => deleteVehicle(v.id),
          }),
        ]),
      ]),
    );
  }
  app.append(list);
}

function renderMaintenance() {
  app.append(
    sectionHead(
      "Bakım",
      "Yağ, filtre, lastik, muayene ve diğer kayıtlar",
      el("button", {
        type: "button",
        className: "btn btn-primary",
        text: "Bakım ekle",
        onClick: () => openMaintenanceForm(),
        disabled: state.vehicles.length ? null : "true",
      }),
    ),
  );

  if (!state.vehicles.length) {
    app.append(emptyState("Önce bir araç ekleyin."));
    return;
  }

  const rows = [...state.maintenances].sort((a, b) =>
    String(b.tarih).localeCompare(String(a.tarih)),
  );

  if (!rows.length) {
    app.append(emptyState("Bakım kaydı yok."));
    return;
  }

  const list = el("div", { className: "list" });
  for (const m of rows) {
    list.append(
      el("article", { className: "item" }, [
        el("div", {}, [
          el("h3", { className: "item-title", text: m.tur }),
          el("p", {
            className: "item-meta",
            text: `${vehicleLabel(m.vehicleId)} · ${fmtDate(m.tarih)} · ${Number(m.km || 0).toLocaleString("tr-TR")} km · ${fmtMoney(m.ucret)}`,
          }),
          m.not ? el("p", { className: "item-meta", text: m.not }) : null,
          m.sonrakiTarih || m.sonrakiKm
            ? el("span", {
                className: "badge",
                text: `Sonraki: ${m.sonrakiTarih ? fmtDate(m.sonrakiTarih) : ""}${m.sonrakiTarih && m.sonrakiKm ? " / " : ""}${m.sonrakiKm ? `${Number(m.sonrakiKm).toLocaleString("tr-TR")} km` : ""}`,
              })
            : null,
        ]),
        el("div", { className: "item-actions" }, [
          el("button", {
            type: "button",
            className: "btn btn-ghost btn-sm",
            text: "Düzenle",
            onClick: () => openMaintenanceForm(m),
          }),
          el("button", {
            type: "button",
            className: "btn btn-danger btn-sm",
            text: "Sil",
            onClick: () => {
              state.maintenances = state.maintenances.filter((x) => x.id !== m.id);
              persist();
              route();
            },
          }),
        ]),
      ]),
    );
  }
  app.append(list);
}

function reminderItem(r, s = reminderStatus(r)) {
  let badge = null;
  if (s.overdue) badge = el("span", { className: "badge danger", text: "Gecikti" });
  else if (s.soon) badge = el("span", { className: "badge warn", text: "Yaklaşıyor" });

  const bits = [];
  if (r.tarih) bits.push(fmtDate(r.tarih));
  if (r.hedefKm != null && r.hedefKm !== "") {
    bits.push(`${Number(r.hedefKm).toLocaleString("tr-TR")} km`);
  }

  return el("article", { className: "item" }, [
    el("div", {}, [
      el("h3", { className: "item-title", text: r.baslik }),
      el("p", {
        className: "item-meta",
        text: `${vehicleLabel(r.vehicleId)} · ${bits.join(" · ") || "Tarih/km yok"}`,
      }),
      badge,
    ]),
    el("div", { className: "item-actions" }, [
      el("button", {
        type: "button",
        className: "btn btn-ghost btn-sm",
        text: "Düzenle",
        onClick: () => openReminderForm(r),
      }),
      el("button", {
        type: "button",
        className: "btn btn-danger btn-sm",
        text: "Sil",
        onClick: () => {
          state.reminders = state.reminders.filter((x) => x.id !== r.id);
          persist();
          route();
        },
      }),
    ]),
  ]);
}

function renderReminders() {
  app.append(
    sectionHead(
      "Hatırlatıcılar",
      "Muayene, sigorta, yağ — tarihe veya km’ye göre",
      el("button", {
        type: "button",
        className: "btn btn-primary",
        text: "Hatırlatıcı ekle",
        onClick: () => openReminderForm(),
        disabled: state.vehicles.length ? null : "true",
      }),
    ),
  );

  if (!state.vehicles.length) {
    app.append(emptyState("Önce bir araç ekleyin."));
    return;
  }

  if (!state.reminders.length) {
    app.append(emptyState("Hatırlatıcı yok."));
    return;
  }

  const list = el("div", { className: "list" });
  const sorted = [...state.reminders].sort((a, b) =>
    String(a.tarih || "9999").localeCompare(String(b.tarih || "9999")),
  );
  for (const r of sorted) list.append(reminderItem(r));
  app.append(list);
}

function renderSettings() {
  app.append(
    sectionHead("Ayarlar", "Yedekleme, içe aktarma ve veri temizliği"),
    el("div", { className: "settings-block" }, [
      el("p", {
        text: "Tüm veri bu tarayıcının localStorage alanındadır (araç, bakım, yakıt, masraf, hatırlatıcı). Sunucuya veya üçüncü tarafa gitmez.",
      }),
      el("div", { className: "cta-row", style: "margin:1rem 0" }, [
        el("button", {
          type: "button",
          className: "btn btn-primary",
          text: "JSON yedekle",
          onClick: downloadBackup,
        }),
        el(
          "label",
          { className: "btn btn-ghost", style: "cursor:pointer" },
          [
            "JSON yükle",
            el("input", {
              type: "file",
              accept: "application/json,.json",
              style: "display:none",
              onChange: onImportFile,
            }),
          ],
        ),
        el("button", {
          type: "button",
          className: "btn btn-danger",
          text: "Tüm veriyi sil",
          onClick: () => {
            if (!confirm("Tüm araç, bakım, yakıt, masraf ve hatırlatıcılar silinsin mi?")) return;
            clearAll();
            state = loadState();
            route();
          },
        }),
      ]),
      el("p", {
        className: "mono",
        text: "Önerilen repo: github.com/ykslaksoy/arac-ozellik-bakim",
      }),
    ]),
  );
}

function downloadBackup() {
  const blob = new Blob([exportJson(state)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `arac-ozellik-bakim-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function onImportFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    state = importJson(text);
    persist();
    route();
  } catch {
    alert("JSON okunamadı. Geçerli bir yedek seçin.");
  } finally {
    e.target.value = "";
  }
}

function vehicleOptions(includeAll = false) {
  const options = state.vehicles.map((v) => ({
    value: v.id,
    label: `${v.plaka} · ${v.marka} ${v.model}`,
  }));
  return includeAll ? [{ value: "", label: "Tüm araçlar" }, ...options] : options;
}

function plateField(value) {
  const wrap = field("Plaka", "plaka", {
    required: true,
    value: value || "",
    placeholder: "34 ABC 123",
  });
  const input = wrap.querySelector("#plaka");
  const hint = el("span", {
    className: "hint",
    text: "Türkiye plakası. Örn. 34 ABC 123",
  });
  wrap.append(hint);
  const refresh = () => {
    if (input.value.trim()) input.value = formatTrPlate(input.value);
    const ok = !input.value.trim() || isValidTrPlate(input.value);
    input.classList.toggle("invalid", !ok);
    hint.textContent = ok
      ? "Türkiye plakası. Örn. 34 ABC 123"
      : "Geçersiz plaka. İl kodu 01–81 olmalıdır.";
    hint.classList.toggle("error", !ok);
  };
  input.addEventListener("blur", refresh);
  return wrap;
}

function brandField(value) {
  const wrap = field("Marka", "marka", {
    required: true,
    value: value || "",
    placeholder: "Listeden seçin veya yazın",
  });
  const input = wrap.querySelector("#marka");
  input.setAttribute("list", "markaList");
  const list = el("datalist", { id: "markaList" });
  for (const brand of MARKALAR) list.append(el("option", { value: brand }));
  wrap.append(list);
  return wrap;
}

function vehicleFilter(onChange = route) {
  const wrap = field("Araç", "filterVehicle", {
    type: "select",
    options: vehicleOptions(true),
  });
  const select = wrap.querySelector("#filterVehicle");
  select.value = filterVehicleId;
  select.addEventListener("change", () => {
    filterVehicleId = select.value;
    onChange();
  });
  return wrap;
}

function maybeBumpVehicleKm(vehicleId, km) {
  const value = Number(km);
  if (!vehicleId || !Number.isFinite(value) || value <= 0) return;
  state.vehicles = state.vehicles.map((v) => {
    if (v.id !== vehicleId) return v;
    if (Number(v.km || 0) >= value) return v;
    return { ...v, km: value };
  });
}

function renderFuel() {
  ensureVehicleFilter();
  const rows = rowsForVehicle(state.fuels).sort((a, b) =>
    String(b.tarih).localeCompare(String(a.tarih)),
  );
  const avg = litersPer100km(rowsForVehicle(state.fuels));

  app.append(
    sectionHead(
      "Yakıt",
      "Litre, tutar, km ve tarih. Ortalama depo-depo L/100 km hesaplanır.",
      el("button", {
        type: "button",
        className: "btn btn-primary",
        text: "Yakıt ekle",
        onClick: () => openFuelForm(),
        disabled: state.vehicles.length ? null : "true",
      }),
    ),
    el("div", { className: "filters" }, [
      vehicleFilter(),
      stat("Kayıt", String(rows.length)),
      stat("Ortalama", fmtRate(avg, "L/100 km")),
      stat("Toplam", fmtMoney(sumField(rows, "ucret"))),
    ]),
  );

  if (!state.vehicles.length) {
    app.append(emptyState("Önce bir araç ekleyin."));
    return;
  }
  if (!rows.length) {
    app.append(emptyState("Yakıt kaydı yok. İlk dolumu ekleyin."));
    return;
  }

  const list = el("div", { className: "list" });
  for (const row of rows) {
    list.append(
      el("article", { className: "item" }, [
        el("div", {}, [
          el("h3", {
            className: "item-title",
            text: `${Number(row.litre).toLocaleString("tr-TR")} L · ${fmtMoney(row.ucret)}`,
          }),
          el("p", {
            className: "item-meta",
            text: `${vehicleLabel(row.vehicleId)} · ${fmtDate(row.tarih)} · ${Number(row.km || 0).toLocaleString("tr-TR")} km`,
          }),
          row.not ? el("p", { className: "item-meta", text: row.not }) : null,
        ]),
        el("div", { className: "item-actions" }, [
          el("button", {
            type: "button",
            className: "btn btn-ghost btn-sm",
            text: "Düzenle",
            onClick: () => openFuelForm(row),
          }),
          el("button", {
            type: "button",
            className: "btn btn-danger btn-sm",
            text: "Sil",
            onClick: () => {
              state.fuels = state.fuels.filter((x) => x.id !== row.id);
              persist();
              route();
            },
          }),
        ]),
      ]),
    );
  }
  app.append(list);
}

function renderExpenses() {
  ensureVehicleFilter();
  const rows = rowsForVehicle(state.expenses).sort((a, b) =>
    String(b.tarih).localeCompare(String(a.tarih)),
  );
  const fuels = rowsForVehicle(state.fuels);
  const distance = (() => {
    const kms = fuels.map((f) => Number(f.km)).filter((n) => n > 0);
    if (kms.length < 2) return null;
    const span = Math.max(...kms) - Math.min(...kms);
    return span > 0 ? span : null;
  })();
  const total = sumField(rows, "ucret");
  const perKm = costPerKm(total, distance);

  app.append(
    sectionHead(
      "Masraf",
      "Kalem ve tutar. ₺/km, yakıt km aralığına göre hesaplanır.",
      el("button", {
        type: "button",
        className: "btn btn-primary",
        text: "Masraf ekle",
        onClick: () => openExpenseForm(),
        disabled: state.vehicles.length ? null : "true",
      }),
    ),
    el("div", { className: "filters" }, [
      vehicleFilter(),
      stat("Kalem", String(rows.length)),
      stat("Toplam", fmtMoney(total)),
      stat("₺/km", fmtRate(perKm, "₺/km")),
    ]),
  );

  if (!state.vehicles.length) {
    app.append(emptyState("Önce bir araç ekleyin."));
    return;
  }
  if (!rows.length) {
    app.append(emptyState("Masraf kaydı yok."));
    return;
  }

  const list = el("div", { className: "list" });
  for (const row of rows) {
    list.append(
      el("article", { className: "item" }, [
        el("div", {}, [
          el("h3", { className: "item-title", text: `${row.kalem} · ${fmtMoney(row.ucret)}` }),
          el("p", {
            className: "item-meta",
            text: `${vehicleLabel(row.vehicleId)} · ${fmtDate(row.tarih)}${row.km ? ` · ${Number(row.km).toLocaleString("tr-TR")} km` : ""}`,
          }),
          row.not ? el("p", { className: "item-meta", text: row.not }) : null,
        ]),
        el("div", { className: "item-actions" }, [
          el("button", {
            type: "button",
            className: "btn btn-ghost btn-sm",
            text: "Düzenle",
            onClick: () => openExpenseForm(row),
          }),
          el("button", {
            type: "button",
            className: "btn btn-danger btn-sm",
            text: "Sil",
            onClick: () => {
              state.expenses = state.expenses.filter((x) => x.id !== row.id);
              persist();
              route();
            },
          }),
        ]),
      ]),
    );
  }
  app.append(list);
}

function ensureVehicleFilter() {
  if (!filterVehicleId && state.vehicles.length === 1) {
    filterVehicleId = state.vehicles[0].id;
  }
}

function currentSummary() {
  ensureVehicleFilter();
  const vehicle = filterVehicleId ? vehicleById(filterVehicleId) : null;
  const fuels = rowsForVehicle(state.fuels);
  const expenses = rowsForVehicle(state.expenses);
  const maintenances = rowsForVehicle(state.maintenances);
  return monthlySnapshot({
    vehicle,
    fuels,
    expenses,
    maintenances,
    yearMonth: filterMonth,
  });
}

function downloadMonthlyCsv(snapshot) {
  const blob = new Blob([`\uFEFF${monthlyCsv(snapshot)}`], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = csvFilename(snapshot);
  a.click();
  URL.revokeObjectURL(url);
}

function renderSummary() {
  if (!filterMonth) filterMonth = currentYearMonth();
  const snapshot = currentSummary();

  const monthField = field("Ay", "filterMonth", {
    type: "month",
    value: filterMonth,
  });
  const monthInput = monthField.querySelector("#filterMonth");
  monthInput.addEventListener("change", () => {
    filterMonth = monthInput.value || currentYearMonth();
    route();
  });

  app.append(
    sectionHead(
      "Aylık özet",
      "Seçilen ayın yakıt ve masrafı. CSV Excel (TR) için noktalı virgüllüdür.",
      el("button", {
        type: "button",
        className: "btn btn-primary",
        text: "CSV indir",
        onClick: () => downloadMonthlyCsv(snapshot),
        disabled: snapshot.fuelCount || snapshot.expenseCount ? null : "true",
      }),
    ),
    el("div", { className: "filters" }, [vehicleFilter(), monthField]),
    el("div", { className: "summary-grid" }, [
      stat("Yakıt", fmtMoney(snapshot.fuelCost)),
      stat("Masraf", fmtMoney(snapshot.expenseCost)),
      stat("Toplam", fmtMoney(snapshot.operatingCost)),
      stat("Litre", snapshot.litres ? snapshot.litres.toLocaleString("tr-TR") : "—"),
      stat("Ort. L/100 km", fmtRate(snapshot.consumption, "")),
      stat("₺/km", fmtRate(snapshot.costPerKm, "₺/km")),
    ]),
  );

  if (!state.vehicles.length) {
    app.append(emptyState("Önce bir araç ekleyin."));
    return;
  }

  if (!snapshot.fuelCount && !snapshot.expenseCount) {
    app.append(emptyState("Bu ay için yakıt veya masraf yok."));
    return;
  }

  const table = el("table", { className: "data" }, [
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Tür" }),
        el("th", { text: "Tarih" }),
        el("th", { text: "Km" }),
        el("th", { text: "Litre / kalem" }),
        el("th", { text: "Tutar" }),
      ]),
    ]),
  ]);
  const tbody = el("tbody");
  for (const row of snapshot.fuels) {
    tbody.append(
      el("tr", {}, [
        el("td", { text: "Yakıt" }),
        el("td", { text: fmtDate(row.tarih) }),
        el("td", { text: Number(row.km || 0).toLocaleString("tr-TR") }),
        el("td", { text: `${Number(row.litre).toLocaleString("tr-TR")} L` }),
        el("td", { text: fmtMoney(row.ucret) }),
      ]),
    );
  }
  for (const row of snapshot.expenses) {
    tbody.append(
      el("tr", {}, [
        el("td", { text: "Masraf" }),
        el("td", { text: fmtDate(row.tarih) }),
        el("td", { text: row.km ? Number(row.km).toLocaleString("tr-TR") : "—" }),
        el("td", { text: row.kalem || "—" }),
        el("td", { text: fmtMoney(row.ucret) }),
      ]),
    );
  }
  table.append(tbody);
  app.append(el("div", { className: "table-scroll" }, [table]));
}

function openFuelForm(row) {
  if (!state.vehicles.length) return;
  dialogMode = "fuel";
  editId = row?.id || null;
  dialogTitle.textContent = row ? "Yakıtı düzenle" : "Yakıt kaydı";
  dialogFields.replaceChildren(
    el("div", { className: "form-grid" }, [
      field("Araç", "vehicleId", {
        type: "select",
        required: true,
        options: vehicleOptions(),
      }),
      field("Tarih", "tarih", {
        type: "date",
        required: true,
        value: row?.tarih || new Date().toISOString().slice(0, 10),
      }),
      field("Km", "km", {
        type: "number",
        min: 0,
        required: true,
        value: row?.km ?? "",
      }),
      field("Litre", "litre", {
        type: "number",
        min: 0,
        step: "0.01",
        required: true,
        value: row?.litre ?? "",
      }),
      field("Tutar (₺)", "ucret", {
        type: "number",
        min: 0,
        step: "0.01",
        required: true,
        value: row?.ucret ?? "",
      }),
      field("Not", "not", { type: "textarea", full: true, value: row?.not || "" }),
    ]),
  );
  const vehicleSelect = dialogFields.querySelector("#vehicleId");
  vehicleSelect.value = row?.vehicleId || filterVehicleId || state.vehicles[0].id;
  dialog.showModal();
}

function openExpenseForm(row) {
  if (!state.vehicles.length) return;
  dialogMode = "expense";
  editId = row?.id || null;
  dialogTitle.textContent = row ? "Masrafı düzenle" : "Masraf kalemi";
  dialogFields.replaceChildren(
    el("div", { className: "form-grid" }, [
      field("Araç", "vehicleId", {
        type: "select",
        required: true,
        options: vehicleOptions(),
      }),
      field("Kalem", "kalem", {
        type: "select",
        required: true,
        options: MASRAF_KALEMLERI,
      }),
      field("Tarih", "tarih", {
        type: "date",
        required: true,
        value: row?.tarih || new Date().toISOString().slice(0, 10),
      }),
      field("Tutar (₺)", "ucret", {
        type: "number",
        min: 0,
        step: "0.01",
        required: true,
        value: row?.ucret ?? "",
      }),
      field("Km", "km", { type: "number", min: 0, value: row?.km ?? "" }),
      field("Not", "not", { type: "textarea", full: true, value: row?.not || "" }),
    ]),
  );
  dialogFields.querySelector("#vehicleId").value =
    row?.vehicleId || filterVehicleId || state.vehicles[0].id;
  if (row?.kalem) dialogFields.querySelector("#kalem").value = row.kalem;
  dialog.showModal();
}

function field(label, name, opts = {}) {
  const wrap = el("div", { className: `field${opts.full ? " full" : ""}` });
  wrap.append(el("label", { for: name, text: label }));
  let input;
  if (opts.type === "select") {
    input = el("select", { id: name, name });
    for (const o of opts.options || []) {
      input.append(el("option", { value: o.value ?? o, text: o.label ?? o }));
    }
  } else if (opts.type === "textarea") {
    input = el("textarea", { id: name, name });
  } else {
    input = el("input", {
      id: name,
      name,
      type: opts.type || "text",
      step: opts.step || undefined,
      list: opts.list || undefined,
      min: opts.min || undefined,
      required: opts.required ? "true" : undefined,
      placeholder: opts.placeholder || "",
    });
  }
  if (opts.value != null) input.value = opts.value;
  wrap.append(input);
  return wrap;
}

function openVehicleForm(vehicle) {
  dialogMode = "vehicle";
  editId = vehicle?.id || null;
  dialogTitle.textContent = vehicle ? "Aracı düzenle" : "Yeni araç";
  dialogFields.replaceChildren(
    el("div", { className: "form-grid" }, [
      plateField(vehicle?.plaka || ""),
      brandField(vehicle?.marka || ""),
      field("Model", "model", { required: true, value: vehicle?.model || "" }),
      field("Yıl", "yil", { type: "number", min: 1950, value: vehicle?.yil || "" }),
      field("Yakıt", "yakit", {
        type: "select",
        options: [{ value: "", label: "Seçin" }, ...YAKIT],
        value: vehicle?.yakit || "",
      }),
      field("Güncel km", "km", {
        type: "number",
        min: 0,
        value: vehicle?.km ?? "",
      }),
      field("Şasi no", "sasi", { value: vehicle?.sasi || "" }),
      field("Motor", "motor", { value: vehicle?.motor || "" }),
      field("Renk", "renk", { full: true, value: vehicle?.renk || "" }),
    ]),
  );
  const yakit = dialogFields.querySelector("#yakit");
  if (yakit && vehicle?.yakit) yakit.value = vehicle.yakit;
  dialog.showModal();
}

function openMaintenanceForm(row) {
  if (!state.vehicles.length) return;
  dialogMode = "maintenance";
  editId = row?.id || null;
  dialogTitle.textContent = row ? "Bakımı düzenle" : "Bakım kaydı";
  dialogFields.replaceChildren(
    el("div", { className: "form-grid" }, [
      field("Araç", "vehicleId", {
        type: "select",
        required: true,
        options: state.vehicles.map((v) => ({
          value: v.id,
          label: `${v.plaka} · ${v.marka} ${v.model}`,
        })),
      }),
      field("Tür", "tur", {
        type: "select",
        required: true,
        options: BAKIM_TUR,
      }),
      field("Tarih", "tarih", {
        type: "date",
        required: true,
        value: row?.tarih || new Date().toISOString().slice(0, 10),
      }),
      field("Km", "km", { type: "number", min: 0, value: row?.km ?? "" }),
      field("Ücret (₺)", "ucret", { type: "number", min: 0, value: row?.ucret ?? "" }),
      field("Sonraki bakım tarihi", "sonrakiTarih", {
        type: "date",
        value: row?.sonrakiTarih || "",
      }),
      field("Sonraki bakım km", "sonrakiKm", {
        type: "number",
        min: 0,
        value: row?.sonrakiKm ?? "",
      }),
      field("Not", "not", { type: "textarea", full: true, value: row?.not || "" }),
    ]),
  );
  if (row?.vehicleId) dialogFields.querySelector("#vehicleId").value = row.vehicleId;
  if (row?.tur) dialogFields.querySelector("#tur").value = row.tur;
  dialog.showModal();
}

function openReminderForm(row) {
  if (!state.vehicles.length) return;
  dialogMode = "reminder";
  editId = row?.id || null;
  dialogTitle.textContent = row ? "Hatırlatıcıyı düzenle" : "Hatırlatıcı";
  dialogFields.replaceChildren(
    el("div", { className: "form-grid" }, [
      field("Başlık", "baslik", {
        required: true,
        placeholder: "Örn. Muayene",
        value: row?.baslik || "",
      }),
      field("Araç", "vehicleId", {
        type: "select",
        required: true,
        options: state.vehicles.map((v) => ({
          value: v.id,
          label: `${v.plaka} · ${v.marka} ${v.model}`,
        })),
      }),
      field("Tarih", "tarih", { type: "date", value: row?.tarih || "" }),
      field("Hedef km", "hedefKm", {
        type: "number",
        min: 0,
        value: row?.hedefKm ?? "",
      }),
    ]),
  );
  if (row?.vehicleId) dialogFields.querySelector("#vehicleId").value = row.vehicleId;
  dialog.showModal();
}

function deleteVehicle(id) {
  if (!confirm("Bu araç ve bağlı bakım, yakıt, masraf ve hatırlatıcılar silinsin mi?")) return;
  state.vehicles = state.vehicles.filter((v) => v.id !== id);
  state.maintenances = state.maintenances.filter((m) => m.vehicleId !== id);
  state.reminders = state.reminders.filter((r) => r.vehicleId !== id);
  state.fuels = state.fuels.filter((f) => f.vehicleId !== id);
  state.expenses = state.expenses.filter((e) => e.vehicleId !== id);
  persist();
  route();
}

function readForm() {
  const data = {};
  dialogFields.querySelectorAll("input, select, textarea").forEach((input) => {
    data[input.name] = input.value.trim();
  });
  return data;
}

form.addEventListener("submit", (e) => {
  const submitter = e.submitter;
  if (!submitter || submitter.value !== "save") {
    dialogMode = null;
    editId = null;
    return;
  }
  e.preventDefault();
  const data = readForm();

  if (dialogMode === "vehicle") {
    if (!data.plaka || !data.marka || !data.model) return;
    if (!isValidTrPlate(data.plaka)) {
      alert("Geçerli bir Türkiye plakası girin. Örn. 34 ABC 123");
      return;
    }
    const previous = editId ? state.vehicles.find((v) => v.id === editId) : null;
    const payload = {
      id: editId || uid(),
      plaka: formatTrPlate(data.plaka),
      marka: data.marka,
      model: data.model,
      yil: data.yil,
      yakit: data.yakit,
      km: data.km === "" ? 0 : Number(data.km),
      sasi: data.sasi,
      motor: data.motor,
      renk: data.renk,
      foto: previous?.foto || "",
    };
    if (editId) {
      state.vehicles = state.vehicles.map((v) => (v.id === editId ? payload : v));
    } else {
      state.vehicles.push(payload);
    }
  }

  if (dialogMode === "maintenance") {
    if (!data.vehicleId || !data.tur || !data.tarih) return;
    const payload = {
      id: editId || uid(),
      vehicleId: data.vehicleId,
      tur: data.tur,
      tarih: data.tarih,
      km: data.km === "" ? 0 : Number(data.km),
      ucret: data.ucret === "" ? "" : Number(data.ucret),
      sonrakiTarih: data.sonrakiTarih,
      sonrakiKm: data.sonrakiKm === "" ? "" : Number(data.sonrakiKm),
      not: data.not,
    };
    if (editId) {
      state.maintenances = state.maintenances.map((m) =>
        m.id === editId ? payload : m,
      );
    } else {
      state.maintenances.push(payload);
    }
  }

  if (dialogMode === "fuel") {
    if (!data.vehicleId || !data.tarih || data.km === "" || data.litre === "" || data.ucret === "") {
      return;
    }
    const payload = {
      id: editId || uid(),
      vehicleId: data.vehicleId,
      tarih: data.tarih,
      km: Number(data.km),
      litre: Number(data.litre),
      ucret: Number(data.ucret),
      not: data.not,
    };
    if (!(payload.km >= 0) || !(payload.litre > 0) || !(payload.ucret >= 0)) {
      alert("Km, litre ve tutar geçerli sayı olmalıdır.");
      return;
    }
    if (editId) {
      state.fuels = state.fuels.map((row) => (row.id === editId ? payload : row));
    } else {
      state.fuels.push(payload);
    }
    maybeBumpVehicleKm(payload.vehicleId, payload.km);
  }

  if (dialogMode === "expense") {
    if (!data.vehicleId || !data.kalem || !data.tarih || data.ucret === "") return;
    const payload = {
      id: editId || uid(),
      vehicleId: data.vehicleId,
      kalem: data.kalem,
      tarih: data.tarih,
      ucret: Number(data.ucret),
      km: data.km === "" ? "" : Number(data.km),
      not: data.not,
    };
    if (!(payload.ucret >= 0)) {
      alert("Tutar geçerli bir sayı olmalıdır.");
      return;
    }
    if (editId) {
      state.expenses = state.expenses.map((row) => (row.id === editId ? payload : row));
    } else {
      state.expenses.push(payload);
    }
    maybeBumpVehicleKm(payload.vehicleId, payload.km);
  }

  if (dialogMode === "reminder") {
    if (!data.baslik || !data.vehicleId) return;
    if (!data.tarih && data.hedefKm === "") {
      alert("Tarih veya hedef km girin.");
      return;
    }
    const payload = {
      id: editId || uid(),
      baslik: data.baslik,
      vehicleId: data.vehicleId,
      tarih: data.tarih,
      hedefKm: data.hedefKm === "" ? "" : Number(data.hedefKm),
    };
    if (editId) {
      state.reminders = state.reminders.map((r) => (r.id === editId ? payload : r));
    } else {
      state.reminders.push(payload);
    }
  }

  persist();
  dialog.close();
  dialogMode = null;
  editId = null;
  route();
});

window.addEventListener("hashchange", route);
route();
