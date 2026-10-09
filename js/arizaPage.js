import { OBD_PILL } from "./home.js";
import {
  DTC_CLEAR_REQUEST_HEX,
  getVehicleProfile,
  loadProfileStore,
  saveProfileStore,
  vehicleCatalogId,
} from "./vehicleProfile.js";
import { loadVehicleCatalog } from "./gizliPage.js";
import { uid } from "./storage.js";

function lookupDtc(sözlük, kod) {
  const key = String(kod || "").trim().toUpperCase();
  const hit = (sözlük || []).find((e) => String(e.kod || "").toUpperCase() === key);
  return hit?.aciklama_tr || "";
}

function openConfirmDialog(deps, { title, message, confirmLabel, danger, onConfirm }) {
  const dlg = deps.el("dialog", { className: "dialog confirm-dialog" });
  dlg.append(
    deps.el("form", { method: "dialog", className: "dialog-form" }, [
      deps.el("h2", { className: "dialog-title", text: title }),
      deps.el("p", { className: "hint", text: message }),
      deps.el("div", { className: "dialog-actions" }, [
        deps.el("button", {
          type: "submit",
          value: "cancel",
          className: "btn btn-ghost",
          text: "Vazgeç",
        }),
        deps.el("button", {
          type: "submit",
          value: "ok",
          className: danger ? "btn btn-danger" : "btn btn-primary",
          text: confirmLabel || "Onayla",
        }),
      ]),
    ]),
  );
  document.body.append(dlg);
  dlg.addEventListener("close", () => dlg.remove());
  dlg.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.submitter?.value === "ok") onConfirm?.();
    dlg.close();
  });
  dlg.showModal();
}

/**
 * @param {HTMLElement} app
 * @param {object} deps
 */
export async function renderArizaPage(app, deps) {
  const vehicle = deps.pickVehicle?.() || deps.state.vehicles[0];
  if (!vehicle) {
    app.append(deps.sectionHead("Arıza", "Önce bir araç ekleyin."));
    app.append(deps.emptyState("Araç listesi boş."));
    return;
  }

  let sözlük = [];
  const catalogId = vehicleCatalogId(vehicle);
  try {
    const catalog = catalogId ? await loadVehicleCatalog(catalogId) : null;
    sözlük = catalog?.diagnostik_sozlugu || [];
  } catch {
    sözlük = [];
  }

  const store = loadProfileStore();
  const profile = getVehicleProfile(store, vehicle.id);

  const mount = () => {
    app.replaceChildren();
    app.append(
      deps.sectionHead(
        "Arıza",
        `${vehicle.plaka} · profilde saklanan DTC kayıtları`,
        deps.el("button", {
          type: "button",
          className: "btn btn-primary btn-sm",
          text: "Kod ekle",
          onClick: () => openAddFault(deps, { profile, store, sözlük, rerender: mount }),
        }),
      ),
    );

    const rows = profile.arizaKayitlari || [];
    if (!rows.length) {
      app.append(deps.emptyState("Kayıtlı arıza kodu yok. Elle ekleyebilir veya OBD okuma simüle edebilirsiniz."));
      return;
    }

    const table = deps.el("table", { className: "data" });
    table.append(
      deps.el("thead", {}, [
        deps.el("tr", {}, [
          deps.el("th", { text: "Kod" }),
          deps.el("th", { text: "Açıklama" }),
          deps.el("th", { text: "Tarih" }),
          deps.el("th", { text: "" }),
        ]),
      ]),
    );
    const tbody = deps.el("tbody");
    for (const row of rows) {
      const aciklama = row.aciklama_tr || lookupDtc(sözlük, row.kod);
      tbody.append(
        deps.el("tr", {}, [
          deps.el("td", { text: row.kod }),
          deps.el("td", { text: aciklama || "—" }),
          deps.el("td", { text: row.tarih || "—" }),
          deps.el("td", {}, [
            deps.el("button", {
              type: "button",
              className: "btn btn-danger btn-sm",
              text: "Sil (DTC)",
              onClick: () => confirmClearDtc(deps, { profile, store, row, rerender: mount }),
            }),
          ]),
        ]),
      );
    }
    table.append(tbody);
    app.append(deps.el("div", { className: "table-scroll page-pad" }, [table]));

    app.append(
      deps.el("p", {
        className: "hint page-pad",
        text: `Güvenli silme isteği: ${DTC_CLEAR_REQUEST_HEX} (onay sonrası${OBD_PILL.connected ? "" : ", simülasyon"}).`,
      }),
    );
  };

  mount();
}

function confirmClearDtc(deps, { profile, store, row, rerender }) {
  const obd = OBD_PILL.connected;
  const msg = obd
    ? `“${row.kod}” kaydı silinecek ve ECU'ya ${DTC_CLEAR_REQUEST_HEX} gönderilecek. Emin misiniz?`
    : `OBD bağlı değil. “${row.kod}” profilden kaldırılacak; ${DTC_CLEAR_REQUEST_HEX} yalnızca simüle edilecek.`;
  openConfirmDialog(deps, {
    title: "Arıza kodu silme",
    message: msg,
    confirmLabel: "Sil ve gönder",
    danger: true,
    onConfirm: () => {
      profile.arizaKayitlari = profile.arizaKayitlari.filter((r) => r.id !== row.id);
      saveProfileStore(store);
      const sim = obd
        ? `ECU temizleme: ${DTC_CLEAR_REQUEST_HEX}`
        : `Simülasyon: ${DTC_CLEAR_REQUEST_HEX}`;
      deps.toast?.(sim) || console.info(sim);
      rerender();
    },
  });
}

function openAddFault(deps, { profile, store, sözlük, rerender }) {
  const dlg = deps.el("dialog", { className: "dialog" });
  const form = deps.el("form", { method: "dialog", className: "dialog-form" });
  form.append(
    deps.el("h2", { className: "dialog-title", text: "Arıza kodu ekle" }),
    deps.el("label", { className: "field" }, [
      deps.el("span", { text: "DTC / kod" }),
      deps.el("input", { name: "kod", required: "required", placeholder: "P0420" }),
    ]),
    deps.el("label", { className: "field" }, [
      deps.el("span", { text: "Açıklama (isteğe bağlı)" }),
      deps.el("input", { name: "aciklama_tr", placeholder: "Sözlükten otomatik doldurulur" }),
    ]),
    deps.el("div", { className: "dialog-actions" }, [
      deps.el("button", { type: "submit", value: "cancel", className: "btn btn-ghost", text: "Vazgeç" }),
      deps.el("button", { type: "submit", value: "save", className: "btn btn-primary", text: "Kaydet" }),
    ]),
  );
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.submitter?.value !== "save") {
      dlg.close();
      return;
    }
    const fd = new FormData(form);
    const kod = String(fd.get("kod") || "").trim().toUpperCase();
    if (!kod) return;
    let aciklama_tr = String(fd.get("aciklama_tr") || "").trim();
    if (!aciklama_tr) aciklama_tr = lookupDtc(sözlük, kod);
    const today = new Date().toISOString().slice(0, 10);
    profile.arizaKayitlari.push({
      id: uid(),
      kod,
      aciklama_tr,
      tarih: today,
      kaynak: "manual",
    });
    saveProfileStore(store);
    dlg.close();
    rerender();
  });
  dlg.append(form);
  document.body.append(dlg);
  dlg.addEventListener("close", () => dlg.remove());
  dlg.showModal();
}
