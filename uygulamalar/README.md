# Cursor pin’leri — takip klasörleri

Cursor’da **Pinned** olarak eklediklerin, burada ayrı takip klasörü. Her pin = bir klasör; durum `DURUM.md` içinde.

| Pin (Cursor) | Klasör | GitHub | Canlı |
|--------------|--------|--------|--------|
| Kur’an Hafızlık Yolu | [kuran-hafizlik-yolu](kuran-hafizlik-yolu/DURUM.md) | henüz yok | — |
| QrMenü | [qrmenu](qrmenu/DURUM.md) | [sofra-qr-menu](https://github.com/ykslaksoy/sofra-qr-menu) | https://sofra-qr-menu-livid.vercel.app |
| Dragon | [dragon](dragon/DURUM.md) | [dragon](https://github.com/ykslaksoy/dragon) | https://dragon-yuksel2.vercel.app |
| Dragon Studio | [dragon-studio](dragon-studio/DURUM.md) | henüz yok | — |
| SuperAri | [superari](superari/DURUM.md) | henüz yok (`aricilik-egitim`) | — |

SüperAraç bu listede pin değil; kendi reposu: https://github.com/ykslaksoy/arac-ozellik-bakim

## Cursor’da pin’i açmak

1. **Start from scratch** seçme
2. Workspace = o pin’in reposu (QrMenü → `sofra-qr-menu`, Dragon → `dragon`)
3. GitHub’u olmayan pin (Hafızlık, Dragon Studio, SuperAri): GitHub’da **New repository** aç, sonra Workspace’ten o repoyu seç

## PC

```
Documents\projeler\
  kuran-hafizlik-yolu\
  qrmenu\          → clone sofra-qr-menu
  dragon\
  dragon-studio\
  superari\
```

[clone-all.ps1](clone-all.ps1) / [clone-all.sh](clone-all.sh) yalnızca GitHub’da duranları klonlar (Dragon + QrMenü).
