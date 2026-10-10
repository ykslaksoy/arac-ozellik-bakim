# Bakım standartları

## İlgili standartlar

- [STANDARTLAR.md](../../STANDARTLAR.md)  
- [performans.md](performans.md) — özet kartlarında son bakım km  
- [arayuz.md](arayuz.md) — `#/bakim`, `#/hatirlaticilar`  
- [islem-guvenligi.md](islem-guvenligi.md) — kayıt silme onayı  

---

Veri `localStorage` içinde `maintenances` ve `reminders` dizilerinde (`js/storage.js`).

## Bakım kaydı (`maintenances`)

Route: `#/bakim`. Form: `openMaintenanceForm` / `dialogMode === "maintenance"`.

| Alan | Zorunlu | Açıklama |
|------|---------|----------|
| `vehicleId` | Evet | Garajdaki araç `id` |
| `tur` | Evet | Aşağıdaki sabit liste |
| `tarih` | Evet | ISO `YYYY-MM-DD` |
| `km` | Hayır | Sayı; varsayılan 0 |
| `ucret` | Hayır | ₺; boş string veya sayı |
| `sonrakiTarih` | Hayır | Planlı sonraki bakım tarihi |
| `sonrakiKm` | Hayır | Planlı sonraki bakım km |
| `not` | Hayır | Serbest metin |

**Türler** (`BAKIM_TUR`): Yağ, Filtre, Lastik, Muayene, Fren, Akü, Diğer.

Kayıtlar araç bazlı filtrelenebilir (`rowsForVehicle`, `filterVehicleId`). Silme: satır bazlı, kalıcı `persist()`.

## Hatırlatıcı (`reminders`)

Route: `#/hatirlaticilar`.

| Alan | Zorunlu | Açıklama |
|------|---------|----------|
| `baslik` | Evet | Örn. Muayene |
| `vehicleId` | Evet | İlgili araç |
| `tarih` | Koşullu | Tarih **veya** `hedefKm` gerekli |
| `hedefKm` | Koşullu | Araç `km` ile karşılaştırılır |

**Durum** (`reminderStatus`):

- **Gecikmiş**: tarih geçmiş veya `hedefKm < vehicle.km`  
- **Yakın**: 30 gün içinde veya 1000 km içinde (gecikmiş değilse)  

Ana sayfa / özet: son bakım kaydı km ve tarih ile gösterilir (`home.js` metrikleri).

## Araç silme

Araç silindiğinde bağlı bakım, yakıt, masraf ve hatırlatıcılar temizlenir (`confirm` ile).

## Bakım vs masraf

Periyodik servis **bakım** kaydı; sigorta, MTV vb. **masraf** kalemi (`MASRAF_KALEMLERI`, `#/masraf`). Özet hesabında bakım ücreti ayrı toplanır (`logic.js` → `maintenanceCost`).
