# İşlem güvenliği standartları

## İlgili standartlar

- [tani.md](tani.md) — tanı ve gizli özellik işlemleri  
- [veri.md](veri.md) — BYOD onayı  
- [bakim.md](bakim.md) — kayıt silme  
- [yayin.md](yayin.md) — değişiklik öncesi test  

---

## Onay (mevcut kod)

Tarayıcı `confirm()` ile kalıcı silme:

| İşlem | Mesaj özeti |
|--------|-------------|
| BYOD temizle | ECU içe aktarma kaydı ve onay silinsin mi? |
| Tüm veriyi sil (Ayarlar) | Tüm araç, bakım, yakıt, masraf ve hatırlatıcılar |
| Araç sil | Araç ve bağlı kayıtlar |

İptal = işlem yapılmaz. Toast yerine native diyalog (MVP).

## Risk sınıfları (profil metni)

`profile.json` → `commandSummaries[].riskTr`: kullanıcıya gösterilecek Türkçe risk uyarısı (ör. gösterge ayarı).  
Gelecekte gizli özellik uygulamasında **orta/yüksek** işlemlerde ek onay adımı bu metne dayanır.

| Sınıf | Örnek | UI (plan) |
|--------|--------|-----------|
| Düşük | Bilgi okuma, liste görüntüleme | Tek ekran |
| Orta | Kalıcı ayar değişikliği | `riskTr` + onay |
| Yüksek | ECU yazma, kod silme | Çift onay + simülasyon bayrağı |

## Simülasyon

OBD bağlı değilken tüm “tanı” işlemleri simülasyon veya kayıt modunda; gerçek bus yazımı **yok** ([baglanti.md](baglanti.md)).

## Audit planı (henüz uygulanmadı)

Cihazda `localStorage` veya IndexedDB:

- `tarih`, `islem` (ör. `byod_import`, `vehicle_delete`), `simulation: boolean`  
- Sunucuya gönderilmez; JSON yedekleme ile kullanıcı taşır  

BYOD içe aktarma zaten `importedAt` kaydeder; audit genişletmesi sonraki faz.

## Form doğrulama

Yakıt/masraf: negatif veya geçersiz sayıda `alert` (Türkçe). Hatırlatıcı: tarih ve hedef km boşsa uyarı.
