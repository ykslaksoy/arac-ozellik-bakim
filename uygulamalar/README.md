# Cursor pin’leri — takip klasörleri

Her pin = bir klasör. **SüperAraç reposu zaten var** (`arac-ozellik-bakim`); yeni repo açılmaz.

| Pin (Cursor) | Klasör | GitHub | Canlı |
|--------------|--------|--------|--------|
| SüperAraç | [arac-ozellik-bakim](arac-ozellik-bakim/DURUM.md) | **mevcut** [arac-ozellik-bakim](https://github.com/ykslaksoy/arac-ozellik-bakim) | https://superarac.vercel.app |
| Süper Kuzu | [superkuzu](superkuzu/DURUM.md) | henüz yok | — |
| SuperAri | [superari](superari/DURUM.md) | henüz yok (`aricilik-egitim`) | — |
| Kur’an Hafızlık Yolu | [kuran-hafizlik-yolu](kuran-hafizlik-yolu/DURUM.md) | henüz yok | — |
| QrMenü | [qrmenu](qrmenu/DURUM.md) | [sofra-qr-menu](https://github.com/ykslaksoy/sofra-qr-menu) | https://sofra-qr-menu-livid.vercel.app |
| Dragon | [dragon](dragon/DURUM.md) | [dragon](https://github.com/ykslaksoy/dragon) | https://dragon-yuksel2.vercel.app |
| Dragon Studio | [dragon-studio](dragon-studio/DURUM.md) | henüz yok | — |

## Cursor’da pin’i açmak

1. **Start from scratch** seçme
2. SüperAraç → Workspace **`arac-ozellik-bakim`** (bu repo)
3. QrMenü → `sofra-qr-menu` · Dragon → `dragon`
4. GitHub’u olmayanlar (Süper Kuzu, SuperAri, Hafızlık, Dragon Studio): **New repository**, sonra Workspace’ten seç

## PC

SüperAraç için ikinci klasör açma. Mevcut clone:

```
Documents\projeler\arac-ozellik-bakim   ← zaten bu repo
Documents\projeler\qrmenu               ← sofra-qr-menu
Documents\projeler\dragon
Documents\projeler\superkuzu            ← repo yok, sonra
Documents\projeler\superari
Documents\projeler\kuran-hafizlik-yolu
Documents\projeler\dragon-studio
```

[clone-all.ps1](clone-all.ps1) / [clone-all.sh](clone-all.sh) — `arac-ozellik-bakim` klasörü varsa SüperAraç’ı tekrar klonlamaz.
