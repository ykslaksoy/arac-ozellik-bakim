# Terimler — Türkçe otomotiv ve servis dili

## İlgili standartlar

- [STANDARTLAR.md](../../STANDARTLAR.md)  
- [tani.md](tani.md) — `modul_tr`, arıza kaydı  
- [profil.md](profil.md) — `titleTr`, `commandSummaries`  
- [arayuz.md](arayuz.md) — sekme ve buton etiketleri  
- [veri.md](veri.md) — BYOD, metadata alan adları  

---

## Amaç

UI metinleri, kullanıcı profili (`profile.json`), feature pack etiketleri ve kamu metadata için **Türkiye’de servis ve günlük kullanımda karşılaşılan** Türkçe terimleri seçmek. Metinler tamamen Türkçe olmalı; anlamı bozan makine çevirisi veya gereksiz İngilizce parçalar kullanılmamalı.

## Kurallar

1. **OEM kısaltması kullanıcıya gösterilmez** (UCH, BCM, ABS beyin kodu vb.) — bunun yerine `modul_tr` gibi anlaşılır modül adları ([veri.md](veri.md)).  
2. **Günlük + servis dili:** atölye, OBD/tanı uygulaması ve forumlarda kullanılan ifadeler; akademik veya sözlük çevirisi değil.  
3. **Marka, model, paket/trim özgün adı korunur** (ör. Renault, Megane III, **Icon** — çevrilmez).  
4. **Bağlama göre seçim:** aynı İngilizce kelime farklı ekranlarda farklı Türkçe karşılık alabilir (ör. *Coding* → gizli özellik ekranında **gizli özellik**, ayar adımında **ayar**).  
5. **Teknik İngilizce yalnızca gerekirse:** BYOD gibi yerleşik kısaltmalar parantez içinde bir kez açıklanabilir; buton ve başlıkta öncelik Türkçe karşılıktır.

## Örnek tablo (YANLIŞ → DOĞRU)

| YANLIŞ (robot / OEM / İngilizce kalıntı) | DOĞRU (önerilen) | Not |
|------------------------------------------|------------------|-----|
| Body comfort module / Gövde konfor modülü | **Gövde ve konfor** veya bağlama göre **Kapı ve konfor** | Modül listesi; “modülü” eki zorunlu değil |
| DTC / Diagnostic trouble code | **Arıza kodu** | P0xxx açıklamasında “OBD arıza kodu” da kullanılabilir |
| Coding | **Gizli özellik** veya **ayar** | Route `#/gizli` vs adım metni |
| Dashboard | **Gösterge paneli** veya **kadran** | ECU modülü: gösterge paneli; animasyon: kadran |
| Scan | **Tara** veya **tanı taraması** | Plaka/evrak: tara; OBD: tanı taraması |
| Clear DTC | **Arıza kodlarını sil** | Onaylı, güvenli silme ([islem-guvenligi.md](islem-guvenligi.md)) |
| BYOD (yalnızca kısaltma) | **Kendi veritabanınız** / **ECU veritabanı** | “BYOD” isteğe bağlı tek satır teknik not |
| Performans (yakıt ekranında) | **Yakıt tüketimi** (L/100 km) | Sekme adı “Performans” kalabilir; metrik metni tüketimi ayırır |
| Selamlama kadranı aktivasyonu | **Gösterge selamlaması** | Renault/PSA topluluğunda yaygın ifade |
| Instrument cluster welcome | **Gösterge selamlaması** | Feature pack `label` / `titleTr` |

## Yasak kalıplar

- Google Translate tarzı bileşik isimler: “selamlama kadranı aktivasyonu”, “gövde konfor modülü”, “arıza teşhis kodu silme işlemi”.  
- Gereksiz İngilizce başlık veya buton metni (kullanıcıya **Clear**, **Scan**, **Coding** göstermeyin).  
- OEM dosya adı, `id_hex` veya beyin kısaltmasını ana metne gömmek.  
- Aynı ekranda hem tam çeviri hem kısaltma karmaşası (ör. “BYOD ECU database yükle”).

## Uygulama alanları

| Alan | Alan adı / dosya |
|------|------------------|
| Modül listesi | `ecu-sets` → `modul_tr` |
| Gizli özellik kartı | `metadata/feature-packs/*.tr.json` → `label`, `summary` |
| Kullanıcı adımları | `data/vehicles/**/profile.json` → `commandSummaries`, `arizaKayitlari` |
| Uygulama UI | `js/app.js`, `js/home.js` — route başlıkları, banner, Ayarlar |

Yeni metin yazarken bu dosyadaki tabloyu kontrol edin; şüpheli çeviriyi önce **servis dilinde** söyleyerek test edin.
