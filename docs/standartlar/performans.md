# Performans standartları

## İlgili standartlar

- [bakim.md](bakim.md) — son bakım km  
- [arayuz.md](arayuz.md) — ana sayfa metrik şeridi  
- [yayin.md](yayin.md) — canlı yakıt API’leri Vercel’de  

---

Hesaplar `js/logic.js`; canlı pompa fiyatları `js/fuelPrices.js`. OBD/CARFAX/GPS **kullanılmaz**.

## Tüketim (L/100 km)

Fonksiyon: `litersPer100km(fuels)` — ardışık yakıt girişleri arası km farkı ve litre.

- Girdi: `fuels[]` — `tarih`, `km`, `litre`, `ucret`, `vehicleId`  
- Geçerli satır: `litre > 0`, km artışı pozitif  
- Demo Megane: 1156 km / 55,71 L ≈ **4,82 L/100 km** (`js/home.js` `demoState`)

Yakıt formu (`#/yakit`): km, litre, tutar, tarih zorunlu; ortalama liste ve özet kartında gösterilir.

## Özet kartları

| Route | İçerik |
|--------|--------|
| `#/ozet` | Seçili ay: yakıt, masraf, bakım, toplam; ort. L/100; CSV dışa aktarma |
| `#/` (hero altı) | Bu ay yakıt/masraf, ort. L/100, son bakım km |
| `#/performans` | Placeholder / genişleme alanı |

Aylık filtre: `filterMonth` (`currentYearMonth`), `inYearMonth`.

## Masraf ve ₺/km

`#/masraf`: kalem (`MASRAF_KALEMLERI`), tutar, tarih, isteğe bağlı km.  
Özet: işletme maliyeti + bakım; km bazlı metrikler araç km’si ile.

## Canlı yakıt fiyatı zinciri

Sıra (**sabit**, değiştirmeyin): `FUEL_PRICE_SOURCE_ORDER`

1. **EPDK** — `/api/fuel-epdk` (turkpidya şehir ortalamaları)  
2. **Opet** — `/api/fuel-opet` (İstanbul plaka 34)  
3. **TPO** — `/api/fuel-tpo` (HTML parse)  
4. **fallback** — `FALLBACK_FUEL_PRICES` (ör. dizel 87,22 TL/L)

- Önbellek: `aob-fuel-prices-v2`, TTL **6 saat** (`FUEL_PRICE_TTL_MS`)  
- Tarayıcı CORS: `vercel.json` rewrite → `/api/fuel-*`  
- ucuzyakitbul **kullanılmaz**

Canlı fiyat ana sayfa / yakıt bağlamında `refreshLiveFuelPrices` ile yüklenir.
