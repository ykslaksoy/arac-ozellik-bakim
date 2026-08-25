# Bilgisayarda GitHub ile senkron

Hedef repo: https://github.com/ykslaksoy/arac-ozellik-bakim  
Bu klasörün `origin` adresi zaten buna ayarlı.

## Masaüstünde kayıt yeri (önerilen)

**Windows:** `C:\Users\<Kullanici>\Documents\arac-ozellik-bakim`  
**Mac:** `~/Documents/arac-ozellik-bakim`

## Repo GitHub’da oluşunca (ilk kez)

```bash
cd ~/Documents
git clone https://github.com/ykslaksoy/arac-ozellik-bakim.git
cd arac-ozellik-bakim
```

Cursor’da **File → Open Folder** ile bu klasörü açın.

## Bu zip’i indirdiyseniz

1. Zip’i `Documents` altına açın → `arac-ozellik-bakim`
2. Klasörde:

```bash
cd Documents/arac-ozellik-bakim
git remote -v
# origin = https://github.com/ykslaksoy/arac-ozellik-bakim.git olmalı
git push -u origin main
```

(İlk push öncesi GitHub’da boş repo oluşturun veya agent’a `GITHUB_TOKEN` verin.)

## Sonraki güncellemeler

```bash
git pull
git add .
git commit -m "açıklama"
git push
```

Telefon Cloud Agent’ı da **aynı repo** ile başlatın; böylece bilgisayar ↔ GitHub ↔ telefon konuşur.
