import { useState } from 'react'
import {
  STAR_BONUS_PRIZES,
  ARROW_BONUS_PRIZES,
  MINIGAME_DIRECT_PRIZES,
} from '../game/config.js'

function formatTL(amount) {
  return amount.toLocaleString('tr-TR') + ' TL'
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MiniGameModal({ type, betAmount, onComplete }) {
  // type: 'star' | 'arrow' | 'direct'
  const config = {
    star:   { title: '★ Yıldız Bonusu', subtitle: '4 yıldız topladın! Bir kart seç.', prizes: STAR_BONUS_PRIZES, symbol: '★' },
    arrow:  { title: '➤ Ok Bonusu', subtitle: '4 ok topladın! Bir kart seç.', prizes: ARROW_BONUS_PRIZES, symbol: '➤' },
    direct: { title: '🎯 Mini Oyun', subtitle: 'Bir kart seç ve ödülü kazan.', prizes: MINIGAME_DIRECT_PRIZES, symbol: '?' },
  }[type]

  // Karıştırılmış ödüller (state olarak sabit kalsın)
  const [shuffledPrizes] = useState(() => shuffle(config.prizes))
  const [revealedIndex, setRevealedIndex] = useState(null)
  const [allRevealed, setAllRevealed] = useState(false)

  const handlePick = (idx) => {
    if (revealedIndex !== null) return
    setRevealedIndex(idx)
    // Diğer kartları da göster (1.2s sonra)
    setTimeout(() => setAllRevealed(true), 1200)
  }

  const pickedPrize = revealedIndex !== null ? shuffledPrizes[revealedIndex] * betAmount : 0

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={config.title}>
      <div className="modal">
        <div className="modal-title">{config.title}</div>
        <div className="modal-subtitle">
          {revealedIndex === null ? config.subtitle : `Kazandın: ${formatTL(pickedPrize)}`}
        </div>

        <div className="minigame-grid">
          {shuffledPrizes.map((prizeMult, i) => {
            const isPicked = i === revealedIndex
            const showValue = isPicked || allRevealed
            const isDim = allRevealed && !isPicked

            return (
              <button
                key={i}
                className={`minigame-card ${showValue ? 'revealed' : ''} ${isDim ? 'dim' : ''}`}
                onClick={() => handlePick(i)}
                disabled={revealedIndex !== null}
                aria-label={showValue ? `${prizeMult * betAmount} TL` : 'Gizli kart'}
              >
                {showValue ? formatTL(prizeMult * betAmount) : config.symbol}
              </button>
            )
          })}
        </div>

        {revealedIndex !== null && (
          <button
            className="modal-btn"
            onClick={() => onComplete(pickedPrize)}
            disabled={!allRevealed}
          >
            {allRevealed ? 'Devam' : '...'}
          </button>
        )}
      </div>
    </div>
  )
}
