# Yayın ve sürüm standartları

## İlgili standartlar

- [STANDARTLAR.md](../../STANDARTLAR.md)  
- [veri.md](veri.md) — yayına girmeyecek dosyalar  
- [profil.md](profil.md) — metadata breaking değişiklik  

---

## Ortamlar

| Ortam | URL / dal | Amaç |
|--------|-----------|------|
| Yerel | `python3 -m http.server` | Geliştirme |
| Vercel preview | PR / branch deploy | Gözden geçirme |
| Üretim | https://superarac.vercel.app | `main` dalı |

GitHub Pages kullanılmıyor; canlı site Vercel (`README.md`).

## Akış

1. Değişiklik feature dalında veya doğrudan `main` (ekip politikasına göre).  
2. **`npm test`** zorunlu — merge/push öncesi yeşil.  
3. Preview deploy ile statik + `/api/fuel-*` rewrite doğrulanır (`vercel.json`).  
4. Onay sonrası **`main`** → Vercel production güncellenir.

## Test komutu

```bash
npm test
```

Çalıştırır: `node --test tests/*.test.js` (logic, storage, flow, home, byod, …).

Standart veya metadata değişikliği: ilgili test dosyasına regresyon eklenmesi önerilir.

## Sürüm notu

- Kullanıcıya görünen sürüm notu henüz otomatik değil; önemli değişiklikler commit mesajı + isteğe bağlı `README.md`.  
- **Breaking metadata**: `trims.json` / `profilePath` kırılırsa mevcut garaj eşleşmeleri kontrol edilmeli.

## Repo ve agent

Hedef depo: https://github.com/ykslaksoy/arac-ozellik-bakim (`main`).  
Agent kuralları: `AGENTS.md` — commit sonrası `scripts/auto-push.sh`.

## Dağıtımda kontrol listesi

- [ ] `npm test` geçti  
- [ ] Telifli ECU zip/XML repoda yok ([veri.md](veri.md))  
- [ ] `STANDARTLAR.md` ve `docs/standartlar/` tutarlı  
- [ ] Canlı yakıt fallback güncelliği (gerekirse `FALLBACK_FUEL_PRICES`)
