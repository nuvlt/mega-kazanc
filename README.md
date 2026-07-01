# Mega Kazanç

Türkçe arayüzlü, React/Vite tabanlı bir şans oyunu MVP'si. **Süper Renklerle Kazan** çarkı ile **Para Kuleleri** kule yıkma mekaniğini birleştirir.

## Oyun Mekaniği

- **Demo bakiye:** 1.000 TL
- **Bilet tutarları:** 10 / 50 / 100 / 250 TL
- **Tur başına 7 çark hakkı**
- **12 dilimli çark:** 6 renk + Hediye Oyun (ekstra çark) + Anında Kazan + Yıldız + Ok + Mini Oyun
- Çark renge düşerse o renkteki kuleden blok yıkılır, **KAZANÇ BÖLGESİ**'nde aynı rengin slotları aynı sayıda dolar
- Bir renk satırı tamamlanırsa o satırın ödülü kazanılır
- **4 yıldız → Yıldız Bonusu** (0.5x-4x bilet)
- **4 ok → Ok Bonusu** (1x-8x bilet)
- **Mini Oyun dilimi → Anında bonus** (0.2x-4x bilet)
- **Yeşil satır jackpot** (500x bilet — 10 TL bilette 5.000 TL, 250 TL bilette 125.000 TL)

## Efektler

- **Çark dönerken:** Lime/cyan ışık huzmeleri çark etrafında döner, spotlight nabız atar, çark daha güçlü drop-shadow ile parıldar
- **Çark durunca:** Düşülen dilim 2.4s boyunca beyaz parlama + renkli halo ile yanıp söner
- **Kuleler:** Vurulan kule 480ms sallanır, üstünden renkli patlama + toz efekti çıkar
- **Blok yıkımı:** Bloklar yarı sol / yarı sağ alternatif yönde 220° dönerek 700ms boyunca aşağı uçuşur
- **Ödül süzülmesi:** Anında kazan / barem tamamlanma / mini oyun ödüllerinde "+X TL" yazısı yukarı doğru süzülerek görünür (altın / cyan / lime varyant)
- **Konfeti patlaması:** Barem satırı tamamlanınca 36 parçacık 6 renkte çark merkezinden patlar
- **Jackpot ekran flash'ı:** Yeşil satır (jackpot) tamamlanınca tüm ekrana altın parlama overlay'i
- **Şimşek:** Renk dilimine düşünce çarktan hedef kuleye çatallı yıldırım (3 ardışık vuruş)
- **Uçan simge:** Yıldız/ok dilimine düşünce simge çarktan tracker'a kavisli yörüngeyle süzülür
- **Nasıl oynanır butonu:** Sağ alt köşede floating "?" — kompakt kurallar modalı

## Sesler (Web Audio API — ses dosyası yok)

Tüm sesler kod içinde oscillator + noise buffer ile üretilir (`src/game/sounds.js`):

- **Çark whoosh:** 3.8 saniyelik filtrelenmiş noise, pitch alçalır
- **Çivi tıkırtıları:** 55 tıkırtı, cubic ease-out yörüngesine göre zamanlanır (gerçek yavaşlama hissi)
- **Çark durma:** 200Hz → 65Hz bas thud + kısa impact noise
- **Şimşek:** Highpass noise crack + 80Hz → 40Hz bas gürleme
- **Blok kırılma:** Bandpass noise burst (1400Hz)
- **Yıldız/Ok topla:** İki notalı çan (1400 + 2100 Hz)
- **Anında kazan:** Üç notalı ascending triangle (A5 → E6 → A6)
- **Hediye:** Kısa fanfar (E5 → G5 → B5)
- **Barem tamamlanma:** C majör arpej (C E G C)
- **Jackpot:** Üç akorlu triumphant (C E G C → D F# A D → E G# B E) + bas C
- **UI click:** Kısa square 700Hz → 200Hz

Sağ üst köşede 🔊/🔇 butonu ile sesi aç/kapat (localStorage'da persist).
AudioContext ilk kullanıcı etkileşiminde lazy-init (autoplay policy'ye uygun).

## Kurallar Modalı

Sağ alt köşedeki "?" (mobilde sticky bar üzerinde) butonu tıklanınca oyunun kısa özet kurallarını gösterir:
amaç, çark dilim tipleri, barem çarpanları, RTP bilgisi.

## RTP

- **Hedef:** ~%90 (Monte Carlo simülasyonu ile kalibre edildi — 500k+ tur / bilet)
- **Gerçekleşen:** %90.5-90.9 (bilet seviyesinden bağımsız)
- **Jackpot oranı:** ~1 / 1.000.000 tur
- **Dağılım:** %18 sıfır kazanç, %42 küçük (<1x), %39 orta (1-5x), %0.9 büyük (5-100x), jackpot+ çok nadir
- **Temiz tam sayılar:** Tüm barem ödülleri ve anında kazançlar her bilet seviyesinde tam sayı TL verir (0.1 / 0.3 / 1 / 4 / 18 / 500 çarpanları)

## Yapı

```
mega-kazanc/
├── package.json
├── vite.config.js
├── vercel.json
├── index.html
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    ├── game/
    │   ├── config.js     # Tüm parametreler: bilet, renk, ödül, ağırlık
    │   └── logic.js      # Spin / mini oyun / state yönetimi
    └── components/
        ├── Wheel.jsx         # SVG çark + spin animasyonu + landing flash + dönen ışık huzmeleri
        ├── Towers.jsx        # 6 renk kule (yıkım animasyonlu + shake + impact)
        ├── PrizeLadder.jsx   # KAZANÇ BÖLGESİ
        ├── MiniTracker.jsx   # Yıldız & ok sayacı
        ├── Controls.jsx      # Bilet seçimi + spin butonu
        ├── MiniGameModal.jsx # Yıldız/Ok/Mini bonus modal
        ├── ResultModal.jsx   # Tur sonu özet
        ├── FloatingPrize.jsx # "+X TL" süzülen kazanç metni
        ├── Confetti.jsx      # Barem tamamlanma konfetisi
        └── WinFlash.jsx      # Jackpot ekran parlaması
```

## RTP Ayarları

Tüm çarpanlar, ağırlıklar ve ödüller `src/game/config.js` içinde. Düzenlemek için:

- `LADDER` — barem ödülleri (çarpan)
- `SEGMENT_WEIGHTS` — çark dilim olasılıkları (yeşil=2 en nadir, kırmızı=12 en sık)
- `BLOCKS_DESTROYED_RANGES` — her renk için kaç blok yıkılır (kırmızı/turuncu 1-3, diğerleri 1-2)
- `INSTANT_WIN_MULTIPLIERS` — anında kazan çarpanları + ağırlıkları
- `STAR_BONUS_PRIZES` / `ARROW_BONUS_PRIZES` / `MINIGAME_DIRECT_PRIZES` — mini oyun ödülleri

## Vercel'e Yükleme (GitHub Web Editor ile)

1. GitHub'da yeni repo oluştur (örn. `mega-kazanc`)
2. Bu projedeki dosyaları sürükle bırak ile repo'ya yükle:
   - **`node_modules` ve `dist` klasörlerini yükleme** (.gitignore zaten dışlıyor)
   - Yüklenmesi gerekenler: `package.json`, `vite.config.js`, `vercel.json`, `index.html`, `.gitignore`, `public/`, `src/`, `README.md`
3. [vercel.com](https://vercel.com) → **Add New → Project** → repo'yu seç
4. Framework otomatik **Vite** olarak algılanır, ek ayar gerekmiyor
5. **Deploy** → 1-2 dakikada canlı

## Geliştirme Notları

- **Backend yok** — tamamen client-side, bakiye sayfa yenilenince sıfırlanır
- **localStorage kullanılmıyor** (kolayca eklenebilir: bakiye + session)
- **Mobile responsive** — 380px'e kadar test edildi
- **prefers-reduced-motion** desteklenir (animasyonlar otomatik kısılır)
- **Bundle size:** ~158 KB JS + 13 KB CSS (gzip: ~51 KB + 3 KB)

## Sonraki Adımlar (Opsiyonel)

- Backend bağlama: spin sonuçlarını sunucuya doğrulatma, gerçek bakiye, oturum
- Persistence: localStorage ile bakiye/oturum saklama
- Ses efektleri (`<audio>` veya Web Audio API)
- Realized RTP takibi için spin log paneli (Monte Carlo doğrulama için)
- Daha çeşitli mini oyunlar (slot, pick-3, ladder)
