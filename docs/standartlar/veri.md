# Veri standartları

## İlgili standartlar

- [STANDARTLAR.md](../../STANDARTLAR.md) — giriş ve tablo  
- [profil.md](profil.md) — `profile.json`, klasör yapısı  
- [baglanti.md](baglanti.md) — BYOD anahtarı ve cihaz saklama  
- [tani.md](tani.md) — UI’da gösterilmeyen OEM alanları  
- [yayin.md](yayin.md) — repoya girmeyen içerik kontrolü  

---

Bu belge, SüperAraç uygulamasının ve bu depodaki **kamuya açık** içeriklerin hangi verileri taşıyabileceğini tanımlar. Amaç: kullanıcıların kendi kaynaklarından getirdiği (BYOD — *Bring Your Own Data*) ECU/tanı verilerini kullanabilmesi; telifli veya lisans kısıtlı OEM içeriğinin ise **yeniden dağıtımını** engellemek.

## Veri yönetimi (BYOD)

- ECU veritabanı arşivleri (ör. `ecu.zip`, DDT2000 uyumlu XML paketleri) **uygulama veya repo ile birlikte dağıtılmaz**.
- Kullanıcı, edinmiş olduğu arşivi **yalnızca kendi cihazında** içe aktarır (`js/byodDatabase.js`, anahtar `aob-byod-database-v1`).
- İçe aktarma öncesi uygulama, kaynağa sahip olduğunuzu onaylamanızı ister; onay `aob-byod-legal-consent-v1` altında cihazda saklanır.
- Bu sürümde zip yalnızca **parmak izi** (dosya adı + SHA-256) için okunur; tam parse sonraki fazda.

## Depo ve dağıtım sınırları

Aşağıdakiler **public Git deposuna**, **yayınlanan web/APK paketine** veya **Drive / paylaşım linki olarak paketlenmiş dağıtıma** **girmemelidir**:

1. `ecu.zip` veya eşdeğer tam ECU veritabanı arşivleri  
2. DDT2000 / DDT4All **ham OEM XML** metinleri veya türev tam kopyalar  
3. Üretici veya üçüncü taraf **telifli veritabanı** içerikleri (dosya adı listesi + içerik birlikte)  
4. Geliştirici ortamındaki **iç fixture** klasörlerinin (`internal/ddt4all/` vb.) repoya kopyalanması  
5. Telifli arşivleri **indirme linki** veya kurulum talimatıyla birlikte yeniden sunmak  

Bu kurallar, kullanıcıların kendi cihazında BYOD yapmasını engellemez; yalnızca **bizim yeniden dağıtımımızı** kısıtlar.

## Telif ve kaynak sorumluluğu

- İçe aktardığınız arşivin lisans ve telif şartlarına **siz** uymakla yükümlüsünüz.  
- Kaynağa sahip değilseniz arşivi içe aktarmayın.  
- Cihazınızdaki verinin güvenliği ve yedeklemesi size aittir.

## Geliştirici fixture ayrımı

| Ortam | Amaç | Repoda? |
|--------|------|---------|
| `metadata/` | Kamu indeks: trim, özellik kimliği, anonim desen/hash referansları | Evet |
| `data/vehicles/` | Kullanıcı profil şablonu (komut özeti, TR metin; OEM XML değil) | Evet (şablon) |
| Geliştirici store / yerel `internal/ddt4all/` | Test ve eşleme doğrulama | **Hayır** — `.gitignore` |

Geliştiriciler test için tam arşivi **yalnızca yerel** veya özel store alanında tutar; CI ve clone eden kullanıcılar bu fixture’a ihtiyaç duymaz.

## Metadata vs binary

- **Metadata** (JSON): marka/model/trim kimlikleri, `featurePackId`, `ecuSetId`, yıl aralığı, özellik etiketleri, dosya adı **glob** desenleri, anonim `ecuFilePattern` hash veya kimlik referansları.  
- **Binary / ham XML**: yalnızca kullanıcı cihazında, BYOD anahtarı altında; repoda **asla**.

## Kullanıcıya gösterilmeyen OEM tanımları

Uygulama ve kamu metadata **kullanıcı arayüzünde** şunları **göstermez** (bkz. [tani.md](tani.md)):

- Üretici ECU kısaltmaları (ör. UCH, BCM, ABS beyin kodları)  
- `beyin_adi` veya “UCH (Gövde Kontrol)” gibi karma OEM etiketleri  
- Arşiv dosya adları ve `ecuFilePatterns` glob metinleri  
- Varsayılan olarak onaltılık adres (`id_hex`) — yalnızca isteğe bağlı kapalı uzman alanında olabilir  

Kullanıcıya sunulan katman:

- `modul_tr` — Türkçe modül adı (ör. “Gövde ve konfor”)  
- `modul_id` — anonim stabil kimlik (geliştirici eşleme; kullanıcıya zorunlu değil)  
- Marka / model / paket bağlamı (`vehicleRef`, trim etiketi)

Repoda `id_hex` ve glob desenler **yalnızca** BYOD arşivi ile eşleme için tutulur; APK/repo dağıtımı bunları kullanıcıya sızdırmaz.

## Güncellemeler

Standart değişiklikleri bu dosyada yayımlanır. Uygulama içi **Ayarlar → Veri yönetimi** özet bilgi verir; tam metin için [STANDARTLAR.md](../../STANDARTLAR.md) ve bu sayfa.
