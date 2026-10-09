import { OBD_PILL } from "./home.js";
import {
  buildUnifiedFeatureList,
  filterFeatureList,
  getVehicleProfile,
  loadProfileStore,
  revealNonStandardFeature,
  saveProfileStore,
  setFeatureEnabled,
  slugifyFeatureId,
  vehicleCatalogId,
} from "./vehicleProfile.js";

const CATALOG_CACHE = new Map();

export async function loadVehicleCatalog(catalogId) {
  if (!catalogId) return null;
  if (CATALOG_CACHE.has(catalogId)) return CATALOG_CACHE.get(catalogId);
  const res = await fetch(`data/vehicles/${catalogId}.json`);
  if (!res.ok) throw new Error(`Katalog yüklenemedi: ${catalogId}`);
  const data = await res.json();
  CATALOG_CACHE.set(catalogId, data);
  return data;
}

function openConfirmDialog(deps, { title, message, confirmLabel, onConfirm }) {
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
          className: "btn btn-primary",
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

function simulateUdsWrite(deps, feature, enabling) {
  const obd = OBD_PILL.connected;
  const hex = enabling ? feature.aktif_deger_hex : feature.pasif_deger_hex;
  const msg = obd
    ? `İstek gönderildi: ECU ${feature.beyin_adresi_hex || "—"} · ${feature.istek_kodu_hex || "—"} → ${hex || "—"}`
    : `Simülasyon: adaptör yok; komut kaydedildi (${feature.istek_kodu_hex || "—"} → ${hex || "—"}).`;
  deps.toast?.(msg) || console.info(msg);
}

function renderFeatureCard(deps, ctx) {
  const { feature, profile, store, vehicleId, rerender } = ctx;
  const switchId = `sw-${feature.ozellik_id}`;

  const hexBlock = deps.el("details", { className: "feature-hex" }, [
    deps.el("summary", { text: "Hex detay (uzman)" }),
    deps.el("dl", { className: "hex-dl" }, [
      deps.el("dt", { text: "Beyin" }),
      deps.el("dd", { text: feature.beyin_adresi_hex || "—" }),
      deps.el("dt", { text: "İstek" }),
      deps.el("dd", { text: feature.istek_kodu_hex || "—" }),
      deps.el("dt", { text: "Aktif" }),
      deps.el("dd", { text: feature.aktif_deger_hex || "—" }),
      deps.el("dt", { text: "Pasif" }),
      deps.el("dd", { text: feature.pasif_deger_hex || "—" }),
    ]),
  ]);

  const toggle = deps.el("label", { className: "feature-switch", htmlFor: switchId }, [
    deps.el("input", {
      id: switchId,
      type: "checkbox",
      checked: feature.enabled ? "checked" : null,
      onChange: (e) => {
        const next = e.target.checked;
        const action = next ? "açmak" : "kapatmak";
        const warn = OBD_PILL.connected
          ? `“${feature.isim_tr}” özelliğini ${action} istiyor musunuz?`
          : `OBD adaptörü bağlı değil. “${feature.isim_tr}” için ${action} işlemi simüle edilecek.`;
        e.target.checked = !next;
        openConfirmDialog(deps, {
          title: "Güvenlik onayı",
          message: warn,
          confirmLabel: next ? "Aç" : "Kapat",
          onConfirm: () => {
            setFeatureEnabled(profile, feature.ozellik_id, next);
            saveProfileStore(store);
            simulateUdsWrite(deps, feature, next);
            rerender();
          },
        });
      },
    }),
    deps.el("span", { className: "feature-switch-ui", "aria-hidden": "true" }),
  ]);

  const tags = [];
  if (!feature.is_standard_for_trim) {
    tags.push(deps.el("span", { className: "feature-tag", text: "Diğer trim" }));
  }
  if (feature.kaynak === "manual" || feature.kaynak === "user_added") {
    tags.push(deps.el("span", { className: "feature-tag", text: "Manuel" }));
  }

  return deps.el("article", { className: "feature-card item" }, [
    deps.el("div", { className: "feature-body" }, [
      deps.el("div", { className: "feature-head" }, [
        deps.el("h3", { className: "item-title", text: feature.isim_tr }),
        deps.el("div", { className: "feature-tags" }, tags),
      ]),
      feature.kategori
        ? deps.el("p", { className: "item-meta", text: feature.kategori })
        : null,
      feature.aciklama_tr
        ? deps.el("p", { className: "item-meta item-meta-soft", text: feature.aciklama_tr })
        : null,
      hexBlock,
    ]),
    toggle,
  ]);
}

function openManualFeatureDialog(deps, ctx) {
  const { profile, store, vehicleId, rerender } = ctx;
  const dlg = deps.el("dialog", { className: "dialog" });
  const form = deps.el("form", { method: "dialog", className: "dialog-form" });
  const fields = deps.el("div", { className: "dialog-fields" });

  const mkField = (id, label, opts = {}) => {
    const input = deps.el("input", {
      id,
      name: id,
      type: opts.type || "text",
      required: opts.required ? "required" : null,
      placeholder: opts.placeholder || "",
    });
    return deps.el("label", { className: "field" }, [
      deps.el("span", { text: label }),
      input,
    ]);
  };

  fields.append(
    mkField("isim_tr", "İsim (TR)", { required: true }),
    deps.el("label", { className: "field" }, [
      deps.el("span", { text: "Kategori" }),
      deps.el("input", { name: "kategori", type: "text", placeholder: "Konfor" }),
    ]),
    deps.el("label", { className: "field" }, [
      deps.el("span", { text: "Açıklama" }),
      deps.el("textarea", { name: "aciklama_tr", rows: "2" }),
    ]),
    mkField("beyin_adresi_hex", "Beyin adresi (hex)", { placeholder: "742" }),
    mkField("istek_kodu_hex", "İstek kodu (hex)", { placeholder: "2E2001" }),
    mkField("aktif_deger_hex", "Aktif değer (hex)", { placeholder: "01" }),
    mkField("pasif_deger_hex", "Pasif değer (hex)", { placeholder: "00" }),
  );

  form.append(
    deps.el("h2", { className: "dialog-title", text: "Yeni özellik (manuel kodlama)" }),
    fields,
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
    const isim = String(fd.get("isim_tr") || "").trim();
    if (!isim) return;
    const ozellik_id = slugifyFeatureId(isim);
    const feature = {
      ozellik_id,
      isim_tr: isim,
      kategori: String(fd.get("kategori") || "").trim() || "Manuel",
      aciklama_tr: String(fd.get("aciklama_tr") || "").trim(),
      beyin_adresi_hex: String(fd.get("beyin_adresi_hex") || "").trim(),
      istek_kodu_hex: String(fd.get("istek_kodu_hex") || "").trim(),
      aktif_deger_hex: String(fd.get("aktif_deger_hex") || "").trim(),
      pasif_deger_hex: String(fd.get("pasif_deger_hex") || "").trim(),
      is_standard_for_trim: false,
      kaynak: "manual",
    };
    profile.manualFeatures.push(feature);
    profile.featureStates[ozellik_id] = false;
    saveProfileStore(store);
    dlg.close();
    rerender();
  });

  dlg.append(form);
  document.body.append(dlg);
  dlg.addEventListener("close", () => dlg.remove());
  dlg.showModal();
}

/**
 * @param {HTMLElement} app
 * @param {object} deps
 */
export async function renderGizliPage(app, deps) {
  const vehicle = deps.pickVehicle?.() || deps.state.vehicles[0];
  if (!vehicle) {
    app.append(deps.sectionHead("Gizli özellik", "Önce bir araç ekleyin."));
    app.append(deps.emptyState("Araç listesi boş."));
    return;
  }

  const catalogId = vehicleCatalogId(vehicle);
  let catalog = null;
  try {
    catalog = catalogId ? await loadVehicleCatalog(catalogId) : null;
  } catch {
    catalog = null;
  }

  const store = loadProfileStore();
  const profile = getVehicleProfile(store, vehicle.id);

  let tab = "all";
  let query = "";

  const mount = () => {
    app.replaceChildren();
    const catalogFeatures = catalog?.gizli_ozellikler || [];
    const unified = buildUnifiedFeatureList(catalogFeatures, profile);
    const filtered = filterFeatureList(unified, { tab, query });

    const poolHidden = catalogFeatures.filter(
      (f) => !f.is_standard_for_trim && !profile.showUnsupportedPool && !profile.revealedNonStandardIds.includes(f.ozellik_id),
    );

    const toolbar = deps.el("div", { className: "feature-toolbar page-pad" }, [
      deps.el("div", { className: "segmented" }, ["all", "on", "off"].map((t) => {
        const labels = { all: "Tümü", on: "Açık", off: "Kapalı" };
        return deps.el("button", {
          type: "button",
          className: `segmented-btn${tab === t ? " is-active" : ""}`,
          text: labels[t],
          onClick: () => {
            tab = t;
            mount();
          },
        });
      })),
      deps.el("label", { className: "field feature-search" }, [
        deps.el("span", { text: "Ara" }),
        deps.el("input", {
          type: "search",
          placeholder: "Özellik ara…",
          value: query,
          onInput: (e) => {
            query = e.target.value;
            mount();
          },
        }),
      ]),
      deps.el("button", {
        type: "button",
        className: `btn btn-ghost btn-sm feature-pool-toggle${profile.showUnsupportedPool ? " is-active" : ""}`,
        text: profile.showUnsupportedPool
          ? "Yalnızca Icon özellikleri"
          : "Desteklenmeyen / Diğer Özellikleri Göster",
        onClick: () => {
          profile.showUnsupportedPool = !profile.showUnsupportedPool;
          if (profile.showUnsupportedPool) {
            for (const f of catalogFeatures) {
              if (!f.is_standard_for_trim) revealNonStandardFeature(profile, f.ozellik_id);
            }
          }
          saveProfileStore(store);
          mount();
        },
      }),
    ]);

    const subtitle = catalog
      ? `${vehicle.plaka} · ${catalog.meta?.trim || "Icon"} kataloğu`
      : `${vehicle.plaka} · katalog yok (yalnızca manuel özellikler)`;

    app.append(deps.sectionHead("Gizli özellik", subtitle));

    if (!catalog && !profile.manualFeatures.length) {
      app.append(
        deps.emptyState("Bu araç için UDS kataloğu tanımlı değil. Manuel özellik ekleyebilirsiniz."),
      );
    } else {
      app.append(toolbar);
      const list = deps.el("div", { className: "list feature-list page-pad" });
      if (!filtered.length) {
        list.append(deps.emptyState("Filtreye uyan özellik yok."));
      } else {
        const ctx = {
          profile,
          store,
          vehicleId: vehicle.id,
          rerender: mount,
        };
        for (const f of filtered) {
          list.append(renderFeatureCard(deps, { ...ctx, feature: f }));
        }
      }
      app.append(list);
    }

    if (poolHidden.length && !profile.showUnsupportedPool) {
      app.append(
        deps.el("p", {
          className: "hint page-pad",
          text: `${poolHidden.length} diğer trim özelliği gizli. Üstteki düğmeyle gösterin.`,
        }),
      );
    }

    app.append(
      deps.el("div", { className: "page-pad" }, [
        deps.el("button", {
          type: "button",
          className: "btn btn-primary",
          text: "Yeni Özellik Ekle (Manuel Kodlama)",
          onClick: () => openManualFeatureDialog(deps, { profile, store, vehicleId: vehicle.id, rerender: mount }),
        }),
      ]),
    );
  };

  mount();
}
