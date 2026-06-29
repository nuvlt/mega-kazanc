# Mega Kazanç

Türkçe arayüzlü, React/Vite tabanlı bir şans oyunu MVP'si. **Süper Renklerle Kazan** çarkı ile **Para Kuleleri** kule yıkma mekaniğini birleştirir.

## Oyun Mekaniği

- **Demo bakiye:** 1.000 TL
- **Bilet tutarları:** 10 / 50 / 100 / 250 TL
- **Tur başına 7 çark hakkı**
- **12 dilimli çark:** 6 renk + Hediye Oyun (ekstra çark) + Anında Kazan + Yıldız + Ok + Mini Oyun
- Çark renge düşerse o renkteki kuleden 1-6 blok yıkılır, **KAZANÇ BÖLGESİ**'nde aynı rengin slotları aynı sayıda dolar
- Bir renk satırı tamamlanırsa o satırın ödülü kazanılır
- **4 yıldız → Yıldız Bonusu** (5x-50x bilet)
- **4 ok → Ok Bonusu** (10x-100x bilet)
- **Mini Oyun dilimi → Anında bonus** (3x-75x bilet)
- **Yeşil satır jackpot** (5.000x bilet — 250 TL bilette 1.250.000 TL)

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
        ├── Wheel.jsx         # SVG çark + spin animasyonu
        ├── Towers.jsx        # 6 renk kule (yıkım animasyonlu)
        ├── PrizeLadder.jsx   # KAZANÇ BÖLGESİ
        ├── MiniTracker.jsx   # Yıldız & ok sayacı
        ├── Controls.jsx      # Bilet seçimi + spin butonu
        ├── MiniGameModal.jsx # Yıldız/Ok/Mini bonus modal
        └── ResultModal.jsx   # Tur sonu özet
```

## RTP Ayarları

Tüm çarpanlar, ağırlıklar ve ödüller `src/game/config.js` içinde. Düzenlemek için:

- `LADDER` — barem ödülleri (çarpan)
- `SEGMENT_WEIGHTS` — çark dilim olasılıkları (yeşil=4 en nadir, kırmızı=14 en sık)
- `BLOCKS_DESTROYED_RANGES` — her renk için kaç blok yıkılır (kırmızı bol, yeşil az)
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
