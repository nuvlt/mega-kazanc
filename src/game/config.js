// Mega Kazanç - Oyun Konfigürasyonu
// RTP: ~%88-89 (200k+ tur Monte Carlo simülasyonu ile kalibre edildi)
// Jackpot oranı: ~1 / 1.000.000

export const BET_AMOUNTS = [10, 50, 100, 250]
export const STARTING_BALANCE = 1000
export const SPINS_PER_GAME = 7
export const TOWER_HEIGHT = 12

// Renk paleti
export const COLORS = {
  red:    { hex: '#ff3366', glow: '#ff5588', name: 'Kırmızı' },
  orange: { hex: '#ff8a1f', glow: '#ffaa55', name: 'Turuncu' },
  yellow: { hex: '#ffd60a', glow: '#ffeb55', name: 'Sarı' },
  purple: { hex: '#c84bff', glow: '#dd77ff', name: 'Mor' },
  blue:   { hex: '#2e8bff', glow: '#55aaff', name: 'Mavi' },
  green:  { hex: '#3ee07d', glow: '#66ff99', name: 'Yeşil' },
}

export const COLOR_ORDER = ['red', 'orange', 'yellow', 'purple', 'blue', 'green']

// Barem (KAZANÇ BÖLGESİ) - RTP kalibre edilmiş
// 10 TL bilette: Yeşil = 5.000 TL jackpot
// 250 TL bilette: Yeşil = 125.000 TL jackpot
export const LADDER = [
  { color: 'green',  slots: 8, multiplier: 500 },   // jackpot - 1/1M
  { color: 'blue',   slots: 8, multiplier: 18 },
  { color: 'purple', slots: 7, multiplier: 4 },
  { color: 'yellow', slots: 6, multiplier: 1 },
  { color: 'orange', slots: 5, multiplier: 0.3 },
  { color: 'red',    slots: 4, multiplier: 0.1 },
]

// Çark dilimleri - 12 dilim
export const WHEEL_SEGMENTS = [
  { type: 'color', color: 'red',    label: 'Kırmızı' },
  { type: 'star',  label: '★' },
  { type: 'color', color: 'orange', label: 'Turuncu' },
  { type: 'instant', label: 'Anında' },
  { type: 'color', color: 'yellow', label: 'Sarı' },
  { type: 'arrow', label: '➤' },
  { type: 'color', color: 'purple', label: 'Mor' },
  { type: 'gift',  label: '🎁' },
  { type: 'color', color: 'blue',   label: 'Mavi' },
  { type: 'minigame', label: 'MİNİ' },
  { type: 'color', color: 'green',  label: 'Yeşil' },
  { type: 'instant', label: 'Anında' },
]

// Dilim ağırlıkları - RTP kalibre edilmiş
export const SEGMENT_WEIGHTS = {
  red: 12, orange: 11, yellow: 9, purple: 6, blue: 4, green: 2,
  star: 9, arrow: 9, gift: 6, instant: 6, minigame: 4,
}

// Renge düşünce kaç blok yıkılır (renge göre dar aralık)
export const BLOCKS_DESTROYED_RANGES = {
  red:    { min: 1, max: 3 },
  orange: { min: 1, max: 3 },
  yellow: { min: 1, max: 2 },
  purple: { min: 1, max: 2 },
  blue:   { min: 1, max: 2 },
  green:  { min: 1, max: 2 },
}

// Anında kazan çarpanları (ağırlıklı)
export const INSTANT_WIN_MULTIPLIERS = [
  { mult: 0.1, weight: 48 },
  { mult: 0.3, weight: 25 },
  { mult: 0.5, weight: 14 },
  { mult: 1, weight: 8 },
  { mult: 3, weight: 4 },
  { mult: 10, weight: 1 },
]

// Mini oyun ödülleri (bilet çarpanı)
export const STAR_BONUS_PRIZES = [0.5, 1, 2, 4]
export const ARROW_BONUS_PRIZES = [1, 2, 4, 8]
export const MINIGAME_DIRECT_PRIZES = [0.2, 0.3, 0.5, 1.5, 4]

export const COLLECTION_TARGET = 4
