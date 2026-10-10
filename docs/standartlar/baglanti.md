# Bağlantı standartları (OBD)

## İlgili standartlar

- [veri.md](veri.md) — BYOD, cihazda veri  
- [tani.md](tani.md) — simülasyon, elle arıza  
- [arayuz.md](arayuz.md) — OBD pill  
- [islem-guvenligi.md](islem-guvenligi.md) — gelecekteki yazma işlemleri  

---

## Mevcut sürüm (MVP)

- **OBD adaptörü bağlı değil** kabul edilir.  
- `OBD_PILL` (`js/home.js`): `connected: false`, `label: "Bağlı değil"`, `overlay` ve `ring` kapalı.  
- Tanı rotaları kullanıcıyı simülasyon / elle girişe yönlendirir; otomatik ECU okuma yok.

Bu, [veri.md](veri.md) BYOD modeliyle uyumlu: ham OEM verisi repoda yok; bağlantı geldiğinde de okuma sonuçları **cihazda** kalır.

## BYOD ile ilişki

| Katman | Saklama | İçerik |
|--------|---------|--------|
| BYOD zip parmak izi | `localStorage` `aob-byod-database-v1` | Dosya adı, SHA-256, tarih |
| Hukuki onay | `aob-byod-legal-consent-v1` | Kullanıcı kabulü |
| Kamu metadata | Repo `metadata/` | `modul_tr`, eşleme desenleri (UI’da gizli) |

Zip parse tamamlanınca adaptör + BYOD birlikte tanı modüllerini besleyecek; şimdilik metadata modül listesi statik JSON’dan gelir.

## Gelecek: ELM327 / STN

Plan (kod yok):

- Web Bluetooth sınırları; gerekirse native köprü  
- Bağlı durumda pill: bağlı / hata (Türkçe, kullanıcı modunda ham hata kodu gizli)  
- Okuma/silme: [islem-guvenligi.md](islem-guvenligi.md) onay sınıfları

## Test beklentisi

`tests/home.test.js`: OBD pill bağlı değil, halka/overlay yok — CI’da korunur.
