// Mega Kazanç - Oyun Konfigürasyonu

export const BET_AMOUNTS = [10, 50, 100, 250]
export const STARTING_BALANCE = 1000
export const SPINS_PER_GAME = 7
export const TOWER_HEIGHT = 14 // Her kulede 14 blok

// Renk paleti - hem kuleler hem barem hem çark için
export const COLORS = {
  red:    { hex: '#ff3366', glow: '#ff5588', name: 'Kırmızı' },
  orange: { hex: '#ff8a1f', glow: '#ffaa55', name: 'Turuncu' },
  yellow: { hex: '#ffd60a', glow: '#ffeb55', name: 'Sarı' },
  purple: { hex: '#c84bff', glow: '#dd77ff', name: 'Mor' },
  blue:   { hex: '#2e8bff', glow: '#55aaff', name: 'Mavi' },
  green:  { hex: '#3ee07d', glow: '#66ff99', name: 'Yeşil' },
}

export const COLOR_ORDER = ['red', 'orange', 'yellow', 'purple', 'blue', 'green']

// Barem (KAZANÇ BÖLGESİ): her renk farklı slot sayısı, doldukça ödül kazanılır
// Ödüller bilet * çarpan şeklinde, base 10 TL bilete göre düşünülür
export const LADDER = [
  { color: 'green',  slots: 8, multiplier: 5000 }, // jackpot - 250 TL bilette 1.250.000 TL
  { color: 'blue',   slots: 7, multiplier: 500 },
  { color: 'purple', slots: 6, multiplier: 100 },
  { color: 'yellow', slots: 5, multiplier: 25 },
  { color: 'orange', slots: 4, multiplier: 7.5 },
  { color: 'red',    slots: 3, multiplier: 2.5 },
]

// Çark dilimleri - 12 dilim
// Her renk 1 dilim, ek olarak özel diilimler var
export const WHEEL_SEGMENTS = [
  { type: 'color', color: 'red',    label: 'Kırmızı' },
  { type: 'star',  label: '★' },
  { type: 'color', color: 'orange', label: 'Turuncu' },
  { type: 'instant', label: 'Anında' },
  { type: 'color', color: 'yellow', label: 'Sarı' },
  { type: 'arrow', label: '➤' },
  { type: 'color', color: 'purple', label: 'Mor' },
  { type: 'gift',  label: '🎁' }, // Hediye Oyun (ekstra çark)
  { type: 'color', color: 'blue',   label: 'Mavi' },
  { type: 'minigame', label: 'MİNİ' },
  { type: 'color', color: 'green',  label: 'Yeşil' },
  { type: 'instant', label: 'Anında' },
]

// Çark sonuçlarının ağırlıkları (RTP için)
// Yüksek değerli renkler (mavi, yeşil) daha nadir
export const SEGMENT_WEIGHTS = {
  red: 14,
  orange: 13,
  yellow: 11,
  purple: 9,
  blue: 7,
  green: 4,    // jackpot rengi - en nadir
  star: 8,
  arrow: 8,
  gift: 7,     // hediye oyun - ekstra çark
  instant: 14, // anında kazan (2 dilim toplam)
  minigame: 5, // direkt mini oyun
}

// Renge düşünce kaç blok yıkılır - random 1-6 ama bias var
// Düşük değerli renkler daha çok blok kırar, yüksek değerli az
export const BLOCKS_DESTROYED_RANGES = {
  red:    { min: 2, max: 6 },
  orange: { min: 2, max: 5 },
  yellow: { min: 1, max: 5 },
  purple: { min: 1, max: 4 },
  blue:   { min: 1, max: 3 },
  green:  { min: 1, max: 3 },
}

// Anında kazan ödülleri (bilet çarpanı)
export const INSTANT_WIN_MULTIPLIERS = [
  { mult: 1, weight: 35 },
  { mult: 2, weight: 25 },
  { mult: 3, weight: 18 },
  { mult: 5, weight: 12 },
  { mult: 10, weight: 7 },
  { mult: 25, weight: 3 },
]

// Mini oyun ödülleri (bilet çarpanı)
export const STAR_BONUS_PRIZES = [5, 10, 25, 50]
export const ARROW_BONUS_PRIZES = [10, 20, 50, 100]
export const MINIGAME_DIRECT_PRIZES = [3, 8, 15, 30, 75]

export const COLLECTION_TARGET = 4 // 4 yıldız / 4 ok = mini oyun açar
