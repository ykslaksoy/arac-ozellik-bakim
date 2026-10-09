# Metadata indeksi (kamuya açık)

Bu dizin, SüperAraç’ın **telif içermeyen** kamu metadata katmanıdır. Amaç: hangi trim’in hangi özellik paketine ve ECU set desenine bağlandığını **kimlik ve referans** düzeyinde tanımlamak; OEM XML veya zip arşivi **burada yoktur**.

## Dizin yapısı

```
metadata/
  brands/<marka>/models/<model>/trims.json
  feature-packs/<packId>.json
  ecu-sets/<setId>.json
```

## `trims.json` örnek şema

```json
{
  "modelId": "renault-megane-3",
  "trims": [
    {
      "id": "icon",
      "label": "Icon",
      "yearFrom": 2009,
      "yearTo": 2012,
      "featurePackId": "renault.megane3.icon.tr",
      "ecuSetId": "renault-megane3-phase2-comfort"
    }
  ]
}
```

## `feature-packs/*.json`

- `featureId` listesi ve Türkçe kullanıcı etiketleri  
- İsteğe bağlı `ddt4allMapping`: yalnızca **anonim** referanslar (`ecuFilePatternRef`, `screenId` placeholder); ham XML metni yok

## `ecu-sets/*.json`

- `ecuFilePatterns`: zip içindeki dosya adlarına karşılık **glob** desenleri  
- `logicalAddress` ve benzeri tanımlayıcılar  
- Zip içeriği veya XML gövdesi **yok**

## BYOD

Gerçek ECU arşivi kullanıcı tarafından cihaza yüklenir. Metadata, yüklü arşivdeki dosya adlarını **eşleştirmek** için desen kullanır; arşivi repoda sunmaz. Ayrıntı: kök `DATA_POLICY.md`.
