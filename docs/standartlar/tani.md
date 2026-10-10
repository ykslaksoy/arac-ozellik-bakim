# Tanı standartları

## İlgili standartlar

- [veri.md](veri.md) — BYOD, UI’da gizli OEM alanları  
- [profil.md](profil.md) — `ecu-sets`, `arizaKayitlari`  
- [baglanti.md](baglanti.md) — OBD bağlı / değil  
- [islem-guvenligi.md](islem-guvenligi.md) — silme/yazma onayı, `riskTr`  

---

## Route’lar

| Route | Durum | Davranış |
|-------|--------|----------|
| `#/tara` | Placeholder | Plaka/evrak taraması sonraki faz |
| `#/ariza` | Aktif | Profil + ECU set modülleri, kayıtlar |
| `#/gizli` | Kısmi | BYOD + metadata bağlantısı planlanıyor |

## Modül adları (`modul_tr`)

- Kullanıcıya **yalnızca** `modul_tr` gösterilir (`js/vehicleMetadata.js` → `userVisibleModules`).  
- `ecu-sets` içinde `id_hex`, `ecuFilePatterns` repoda kalabilir; UI bunları listelemaz.  
- Uzman paneli: `#/ariza` altında `<details>` “Uzman: adres kimlikleri” — varsayılan **kapalı**.

Örnek modül satırı (metadata):

```json
{
  "modul_id": "body-comfort-01",
  "modul_tr": "Gövde ve konfor",
  "id_hex": "745",
  "ecuFilePatterns": ["745_*.xml"]
}
```

## Onay ve BYOD

- ECU arşivi içe aktarılmadan tam tanı veritabanı kullanılmaz.  
- **Ayarlar → Veri yönetimi**: hukuki onay kutusu zorunlu (`recordDataSourceConsent`).  
- Onay ve parmak izi yalnızca cihazda; ayrıntı [veri.md](veri.md).

## Simülasyon vs adaptör

- `js/home.js` → `OBD_PILL`: `connected: false`, etiket **“Bağlı değil”**.  
- Arıza sayfası alt metni: “OBD bağlantısı yok; kodları elle kaydedin.”  
- Otomatik tarama / kod silme **yok**; kayıtlar profil JSON örnekleri veya gelecekteki form ile.

Bağlantı yol haritası: [baglanti.md](baglanti.md).

## Arıza kaydı formatı

Profil içi `arizaKayitlari[]`:

- `kod` — kullanıcı veya servis kodu (P0xxx veya üretici; OEM beyin adı gösterilmez)  
- `modul_tr` — Türkçe modül  
- `aciklamaTr` — açıklama  
- `tarih` — ISO tarih  

Liste UI: `kod · modul_tr` başlık, açıklama ve tarih alt satır. Yeni kayıt formu sonraki sürümde; şimdilik profil şablonundaki örnekler listelenir.

## Gizli özellik

`#/gizli`: BYOD yoksa “Önce Ayarlar → Veri yönetimi…”; varsa metadata ile özellik listesi bağlanacak.  
`commandSummaries` adımları profil dosyasında tanımlı ([profil.md](profil.md)).
