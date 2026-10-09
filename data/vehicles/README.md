# Kullanıcı araç profilleri (klasör yapısı)

Üretici ECU veritabanı **burada değildir**. Her paket için ayrı klasör; yeni model/paket = yeni dizin, uygulama kodu minimum değişir.

## Dizin kuralı

```
data/vehicles/{marka-slug}/{model-slug}/{paket-slug}/profile.json
```

Örnek: `data/vehicles/renault/megane-3/icon/profile.json`

`metadata/brands/{marka}/models/{model}/trims.json` içindeki her trim satırı `profilePath` ile bu dosyayı işaret eder. Kök indeks: `metadata/_index.json`.

## `profile.json` şeması (özet)

| Alan | Açıklama |
|------|----------|
| `vehicleRef` | `brandSlug`, `modelSlug`, `paketSlug`, Türkçe/etiket alanları |
| `featurePackId` / `ecuSetId` | Kamu metadata kimlikleri |
| `commandSummaries` | `modul_tr` + Türkçe adımlar; OEM kısaltması yok |
| `arizaKayitlari` | `modul_tr`, `kod`, `aciklamaTr` — UCH/ECU adı yok |
| `byod` | Cihazda içe aktarma parmak izi (uygulama doldurur) |

## UI kuralı

Kullanıcıya **UCH**, **BCM**, dosya adı (`742_*.xml`) veya `beyin_adi` tarzı metinler **gösterilmez**. Yalnızca `modul_tr` (ör. "Gövde ve konfor") ve marka/model/paket bağlamı.

Tam politika: `DATA_POLICY.md`.
