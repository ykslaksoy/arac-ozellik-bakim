# Profil ve katalog standartları

## İlgili standartlar

- [STANDARTLAR.md](../../STANDARTLAR.md)  
- [veri.md](veri.md) — repoda ne var / ne yok  
- [tani.md](tani.md) — `modul_tr`, `arizaKayitlari`  
- [arayuz.md](arayuz.md) — garaj ve ana sayfa bağlamı  

---

Kamu katalog katmanı (`metadata/`) ile kullanıcı profil şablonu (`data/vehicles/`) ayrıdır; uygulama `js/vehicleMetadata.js` ile birleştirir.

## Klasör yapısı

```
metadata/_index.json
metadata/brands/{marka}/models/{model}/trims.json
metadata/feature-packs/…
metadata/ecu-sets/…

data/vehicles/{marka-slug}/{model-slug}/{paket-slug}/profile.json
```

Yeni model/paket = yeni dizin; çekirdek uygulama kodu değişmeden genişler.

## `trims.json` (Megane III örneği)

`metadata/brands/renault/models/megane-3/trims.json` içindeki bir satır:

```json
{
  "id": "icon",
  "label": "Icon",
  "yearFrom": 2009,
  "yearTo": 2014,
  "featurePackId": "renault.megane3.icon.tr",
  "ecuSetId": "renault-megane3-phase2-comfort",
  "profilePath": "data/vehicles/renault/megane-3/icon/profile.json"
}
```

- **`featurePackId`**: noktalı, dil/paket kimliği (`marka.model.paket.tr`).  
- **`ecuSetId`**: tireli slug; `metadata/ecu-sets/{id}.json` dosyasına karşılık gelir.  
- **`profilePath`**: repo kökünden göreli profil dosyası.

## `profile.json` şeması

Örnek: `data/vehicles/renault/megane-3/icon/profile.json`

| Alan | Açıklama |
|------|----------|
| `version` | Şema sürümü (şu an `1`) |
| `vehicleRef` | `brandSlug`, `modelSlug`, `paketSlug`, `*Label`, `year` |
| `featurePackId` / `ecuSetId` | `trims.json` ile aynı kimlikler |
| `commandSummaries` | Gizli özellik adımları: `modul_tr`, `titleTr`, `stepsTr`, `riskTr` |
| `arizaKayitlari` | Elle/örnek arıza: `modul_tr`, `kod`, `aciklamaTr`, `tarih` |
| `byod` | Cihazda içe aktarma durumu (uygulama günceller) |

`commandSummaries` içinde OEM kısaltması **yok**; modül her zaman `modul_tr` ile referanslanır.

## Genişleme adımları

1. `trims.json` — yeni trim + `profilePath`  
2. `profile.json` — şablon komut ve örnek arıza  
3. Gerekirse `feature-packs/` ve `ecu-sets/`  
4. `metadata/_index.json` — yeni marka/model `trimsPath`  

Loader: `_index.json` → `trims.json` → `profilePath` / `ecuSetId`.

## UI eşleme

Garajdaki araç (`state.vehicles`) marka/model ile katalog paketine `matchCatalogPackage` ile bağlanır. Eşleşme yoksa `#/ariza` “Henüz tanımlı profil yok” gösterir.

Ayrıntılı README: [data/vehicles/README.md](../../data/vehicles/README.md), [metadata/README.md](../../metadata/README.md).
