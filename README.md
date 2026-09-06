# Araç Özellik Bakım

Kişisel araç özellikleri ve bakım takibi. Hesap gerekmez; veri tarayıcıda (`localStorage`) saklanır.

## Çalıştırma

Klasörde herhangi bir statik sunucu:

```bash
cd arac-ozellik-bakim
python3 -m http.server 4173
```

Tarayıcı: http://localhost:4173

## Özellikler

- Ana Sayfa özeti (araç, bakım, km, bu ay yakıt/masraf, hatırlatıcılar)
- Araçlarım — TR plaka, marka listesi, ekle / düzenle / sil
- Bakım kayıtları
- Yakıt — litre, ₺, km, tarih; ortalama L/100 km; ekle / düzenle / sil
- Masraf kalemleri ve ₺/km
- Aylık özet + CSV (Excel TR: `;` ayırıcı, PDF yok)
- Hatırlatıcılar (tarih veya km)
- Ayarlar — JSON yedekle / yükle / tüm veriyi sil
- Yerel gizlilik: veri yalnızca `localStorage`. OBD, CARFAX, GPS yok.

```bash
node --test tests/logic.test.js tests/storage.test.js tests/flow.test.js
```

## Masaüstü senkron (GitHub)

Bu Cloud Agent **repo’suz** açıldı. Senkron için:

1. GitHub’da `arac-ozellik-bakim` reposu oluşturun  
2. Bu klasörü push edin:

```bash
cd arac-ozellik-bakim
git init
git remote add origin https://github.com/ykslaksoy/arac-ozellik-bakim.git
git add .
git commit -m "İlk sürüm: Araç Özellik Bakım MVP"
git push -u origin main
```

3. Masaüstünde Cursor ile clone’layın; telefondan Cloud Agent’ı **aynı repo** ile başlatın.

## Masaüstünde Cloud Agent görünürlüğü

Mobilden başlatılan agent’lar aynı hesapla:

1. **Agents Window** — `Ctrl+Shift+P` → Open Agents Window  
2. Editör agent panelinde **Cloud**  
3. https://cursor.com/agents  

Kaynak filtresi: **mobile**
