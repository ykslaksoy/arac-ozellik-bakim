# Kullanıcı araç profili şablonu

Bu dizin **üretici ECU veritabanı değildir**. Kullanıcının kendi aracına özel, uygulama içinde tutulabilecek **profil ve komut özeti** için JSON şablonu tanımlar. Ham DDT/OEM XML burada yer almaz.

## Örnek `profile.json`

```json
{
  "version": 1,
  "vehicleRef": {
    "brand": "Renault",
    "model": "Megane III",
    "trimId": "icon",
    "year": 2011,
    "metadataTrimPath": "metadata/brands/renault/models/megane-3/trims.json"
  },
  "featurePackId": "renault.megane3.icon.tr",
  "ecuSetId": "renault-megane3-phase2-comfort",
  "userNotes": "Icon paket — kadran selamlama açık.",
  "commandSummaries": [
    {
      "featureId": "kadran_selamlama",
      "titleTr": "Kadran selamlama",
      "stepsTr": [
        "Tanı modunda gösterge ECU’sunu seçin.",
        "İlgili ekranda selamlama parametresini bulun.",
        "Değişiklikten önce mevcut ayarı not alın."
      ],
      "riskTr": "Yanlış yazma gösterge davranışını etkileyebilir; yedek alın."
    }
  ],
  "byod": {
    "databaseImported": false,
    "fingerprintSha256": null,
    "importedAt": null
  }
}
```

## Alanlar

| Alan | Açıklama |
|------|----------|
| `featurePackId` | Kamu metadata’daki özellik paketi kimliği |
| `ecuSetId` | Kamu metadata’daki ECU dosya desen seti |
| `commandSummaries` | Türkçe adımlar; OEM komut metni veya XML yok |
| `byod` | Cihazda içe aktarılan arşivin parmak izi (uygulama doldurur) |

Tam veri politikası: depo kökünde `DATA_POLICY.md`.
