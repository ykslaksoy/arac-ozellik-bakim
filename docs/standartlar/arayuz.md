# Arayüz standartları

## İlgili standartlar

- [STANDARTLAR.md](../../STANDARTLAR.md)  
- [profil.md](profil.md) — demo Megane, orbit varsayılanları  
- [tani.md](tani.md) — modül listesi metinleri  
- [performans.md](performans.md) — ana sayfa metrik şeridi  

---

## Ana sayfa orbit (8 açı)

Kaynak: `js/home.js` — `DEFAULT_HERO_GALLERY`, `ORBIT_SLOT_COUNT = 8`.

Saat yönünün **tersi** turntable (arabanın solu/sağı):

1. Önden → 2. Sol çapraz → 3. Soldan → 4. Sol arka çapraz → 5. Arkadan → 6. Arka sağ çapraz → 7. Sağdan → 8. Sağ ön çapraz → (ön).

- **Sağ ok** veya **sola kaydırma** = sonraki açı (+1).  
- Varsayılan indeks: **ön** (`DEFAULT_HERO_INDEX = 0`).  
- Megane III demo: `assets/orbit-m3-0-front.jpg` … `orbit-m3-7-front-right.jpg`.

Kullanıcı orbit: araç kaydında `orbit` dizisi (8 URL/data URL). **Tam 8 dolu** olmalı; eksik set kabul edilmez (`orbitFillStatus`, `heroSlides`). Kısmi yükleme varsayılan galeriye düşer.

Orbit düzenleme: araç fotoğrafları diyaloğu, slot grid, toplu seçim (`js/app.js`).

## Ana sayfa aksiyonları

Üst sıra (`HOME_ACTIONS_TOP`): Tara, Yakıt, Masraf, Özet.  
Alt sıra (`HOME_ACTIONS_BOTTOM`): Bakım, Arıza, Gizli özellik, Ekspertiz.

## Alt sekmeler (sabit nav)

| Sekme | Route |
|--------|--------|
| Ana sayfa | `#/` |
| Araçlarım | `#/araclar` |
| Hatırlatıcı | `#/hatirlaticilar` |
| Performans | `#/performans` |
| Ayarlar | `#/ayarlar` |

Aktif sekme: `tabActive(path, route)` — kök `/` yalnızca tam eşleşme.

## Türkçe metin ve arama kuralları

- Tüm kullanıcı metinleri Türkçe; teknik OEM kodları gizli katmanda ([tani.md](tani.md)).  
- Plaka: `normalizePlate` / `formatTrPlate` (`js/logic.js`) — TR kuralları, büyük harf.  
- Marka listesi: sabit `MARKALAR` dizisi (alfabetik + “Diğer”).  
- Model/araç eşleştirmede ileride arama için **NFD normalizasyonu** kullanılır (ör. `isMegane3Vehicle`: aksanları kaldır, küçük harf). Yeni filtreler aynı deseni izlemeli.

## İpuçları ve bildirimler

- Orbit ilk kullanım: `HINT_KEY` (`aob-rotate-hint`) ile döndürme ipucu.  
- Veri banner’ları: tanı sayfalarında “üretici tanımları cihazınızda…” (`dataNoticeBanner`).  
- Silme işlemleri: `confirm()` diyalogları ([islem-guvenligi.md](islem-guvenligi.md)).

## OBD göstergesi

Ana sayfada pill: bağlı değilken halka/overlay **kapalı** (`OBD_PILL`). Detay: [baglanti.md](baglanti.md).
