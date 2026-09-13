# Uygulamalar — tek yerden takip

Her uygulamanın **kendi klasörü** burada. Durum, GitHub, canlı site ve sonraki adım o klasördeki `DURUM.md` içinde.

PC’de kod klasörleri ayrı durur (`Documents\projeler\...`). Bu dizin yalnızca **indeks / takip**.

## Klasörler

| Klasör | Uygulama | GitHub | Canlı |
|--------|----------|--------|--------|
| [arac-ozellik-bakim](arac-ozellik-bakim/DURUM.md) | SüperAraç | [var](https://github.com/ykslaksoy/arac-ozellik-bakim) | https://superarac.vercel.app |
| [dragon](dragon/DURUM.md) | Dragon | [var](https://github.com/ykslaksoy/dragon) | https://dragon-yuksel2.vercel.app |
| [sofra-qr-menu](sofra-qr-menu/DURUM.md) | QrMenü / Sofra | [var](https://github.com/ykslaksoy/sofra-qr-menu) | https://sofra-qr-menu-livid.vercel.app |
| [kuran-hafizlik](kuran-hafizlik/DURUM.md) | Kur’an Hafızlık Yolu | Cursor’da var, GitHub’da yok | — |
| [dragon-studio](dragon-studio/DURUM.md) | Dragon Studio | Cursor’da var, GitHub’da yok | — |
| [aricilik-egitim](aricilik-egitim/DURUM.md) | SüperArı | Cursor’da var, GitHub’da yok | — |
| [desktop-tutorial](desktop-tutorial/DURUM.md) | Masaüstü alıştırması | Cursor’da var, GitHub’da yok | — |
| [megane-3-ayna-sensor](megane-3-ayna-sensor/DURUM.md) | Megane 3 ayna sensör | Repo yok | — |

## Cursor’da nasıl açılır

**Create Project** GitHub’da yeni repo açmaz. Agent sohbetini bir Workspace’e bağlar.

1. **Start from scratch** seçme
2. Workspace’ten **o uygulamanın reposunu** seç (SüperAraç → `arac-ozellik-bakim`)
3. Tüm uygulamaları bir sohbette görmek için **Select Multiple** aç, listeden hepsini işaretle
4. **Create Project**

GitHub’da henüz olmayanlar (Hafızlık, Dragon Studio, SüperArı, tutorial, ayna sensör) dropdown’da görünse bile agent kaydedemez. GitHub’da aynı isimle **New repository** açıp Cursor’da o repoyu seç.

## PC klasörleri (önerilen)

```
Documents\projeler\
  arac-ozellik-bakim\
  dragon\
  sofra-qr-menu\
  kuran-hafizlik\
  dragon-studio\
  aricilik-egitim\
  desktop-tutorial\
  megane-3-ayna-sensor\
```

Hazır komut: [clone-all.ps1](clone-all.ps1) (Windows) veya [clone-all.sh](clone-all.sh).
