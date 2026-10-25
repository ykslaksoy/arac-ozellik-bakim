# Metadata indeksi (kamuya açık)

Telif içermeyen kimlik ve eşleme katmanı. OEM XML ve zip arşivi **yok**.

Standartlar: [STANDARTLAR.md](../STANDARTLAR.md) · [docs/standartlar/veri.md](../docs/standartlar/veri.md) · [docs/standartlar/profil.md](../docs/standartlar/profil.md)

## Genişleme (yeni model/paket)

1. `metadata/brands/{marka}/models/{model}/trims.json` — paket listesi + `profilePath`
2. `data/vehicles/{marka}/{model}/{paket}/profile.json` — kullanıcı profil şablonu
3. Gerekirse `metadata/feature-packs/` ve `metadata/ecu-sets/` dosyası ekleyin
4. `metadata/_index.json` içine yeni marka/model girişi (yalnızca `trimsPath`)

Loader: `js/vehicleMetadata.js` — `_index.json` okur, `trims.json` yürütür.

## `trims.json`

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

## Modül şeması (`ecu-sets`)

Repoda `ecuFilePatterns` ve isteğe bağlı `id_hex` kalabilir; **UI bunları göstermez**.

```json
{
  "modul_id": "body-comfort-01",
  "modul_tr": "Gövde ve konfor",
  "id_hex": "745",
  "ecuFilePatterns": ["745_*.xml"]
}
```

Kullanıcı arayüzü: yalnızca `modul_tr`. Uzman adresi yalnızca gizli `<details>` (varsayılan kapalı) veya hiç.

## BYOD

Gerçek arşiv cihazda. Ayrıntı: [docs/standartlar/veri.md](../docs/standartlar/veri.md) (BYOD).
