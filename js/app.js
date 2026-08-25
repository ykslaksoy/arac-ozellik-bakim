import {
  loadState,
  saveState,
  uid,
  exportJson,
  importJson,
  clearAll,
} from "./storage.js";

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

const app = document.getElementById("app");
const dialog = document.getElementById("formDialog");
const form = document.getElementById("entityForm");
const dialogTitle = document.getElementById("dialogTitle");
const dialogFields = document.getElementById("dialogFields");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

function persist() {
  saveState(state);
}

function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const path = hash.split("?")[0] || "/";
  document.querySelectorAll("[data-route]").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === path);
  });
  mainNav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  app.replaceChildren();
  app.style.animation = "none";
  void app.offsetWidth;
  app.style.animation = "";

  if (path === "/") renderHome();
  else if (path === "/araclar") renderVehicles();
  else if (path === "/bakim") renderMaintenance();
  else if (path === "/hatirlaticilar") renderReminders();
  else if (path === "/ayarlar") renderSettings();
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

function fmtMoney(n) {
  if (n === "" || n == null || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(Number(n));
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

function renderHome() {
  const upcoming = state.reminders
    .map((r) => ({ r, s: reminderStatus(r) }))
    .filter(({ s }) => s.overdue || s.soon)
    .sort((a, b) => {
      const da = a.s.byDate ?? 9999;
      const db = b.s.byDate ?? 9999;
      return da - db;
    })
    .slice(0, 5);

  const totalKm = state.vehicles.reduce((sum, v) => sum + Number(v.km || 0), 0);

  app.append(
    el("section", { className: "hero" }, [
      el("h1", { className: "hero-brand", text: "Araç Özellik Bakım" }),
      el("p", {
        text: "Kendi aracınızın özelliklerini ve bakım geçmişini tek yerde tutun. Veriler bu cihazda saklanır.",
      }),
      el("div", { className: "cta-row" }, [
        el("a", { className: "btn btn-primary", href: "#/araclar", text: "Araç ekle" }),
        el("a", { className: "btn btn-ghost", href: "#/bakim", text: "Bakım kaydı" }),
      ]),
    ]),
    el("div", { className: "summary-grid" }, [
      stat("Araç", String(state.vehicles.length)),
      stat("Bakım kaydı", String(state.maintenances.length)),
      stat("Toplam km", totalKm ? totalKm.toLocaleString("tr-TR") : "—"),
    ]),
    el("h2", {
      style: "font-family:var(--font-display);letter-spacing:-0.03em;margin:0 0 0.75rem",
      text: "Yaklaşan hatırlatıcılar",
    }),
  );

  if (!upcoming.length) {
    app.append(emptyState("Yaklaşan hatırlatıcı yok. Hatırlatıcılar sayfasından ekleyebilirsiniz."));
    return;
  }

  const list = el("div", { className: "list" });
  for (const { r, s } of upcoming) {
    list.append(reminderItem(r, s));
  }
  app.append(list);
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

  const list = el("div", { className: "list" });
  for (const v of state.vehicles) {
    list.append(
      el("article", { className: "item" }, [
        el("div", {}, [
          el("h3", { className: "item-title", text: `${v.plaka}` }),
          el("p", {
            className: "item-meta",
            text: `${v.marka} ${v.model} · ${v.yil || "—"} · ${v.yakit || "—"} · ${Number(v.km || 0).toLocaleString("tr-TR")} km`,
          }),
          v.renk || v.motor || v.sasi
            ? el("p", {
                className: "item-meta",
                text: [v.renk && `Renk: ${v.renk}`, v.motor && `Motor: ${v.motor}`, v.sasi && `Şasi: ${v.sasi}`]
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
        text: "Uygulama verisi bu tarayıcının localStorage alanındadır. Kaynak kod senkronu için GitHub kullanın.",
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
            if (!confirm("Tüm araç, bakım ve hatırlatıcılar silinsin mi?")) return;
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
      field("Plaka", "plaka", { required: true, value: vehicle?.plaka || "" }),
      field("Marka", "marka", { required: true, value: vehicle?.marka || "" }),
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
  if (!confirm("Bu araç ve bağlı bakım/hatırlatıcılar silinsin mi?")) return;
  state.vehicles = state.vehicles.filter((v) => v.id !== id);
  state.maintenances = state.maintenances.filter((m) => m.vehicleId !== id);
  state.reminders = state.reminders.filter((r) => r.vehicleId !== id);
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
    const payload = {
      id: editId || uid(),
      plaka: data.plaka.toUpperCase(),
      marka: data.marka,
      model: data.model,
      yil: data.yil,
      yakit: data.yakit,
      km: data.km === "" ? 0 : Number(data.km),
      sasi: data.sasi,
      motor: data.motor,
      renk: data.renk,
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

navToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

window.addEventListener("hashchange", route);
route();
