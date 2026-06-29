import { BET_AMOUNTS } from '../game/config.js'

function formatTL(amount) {
  return amount.toLocaleString('tr-TR')
}

export default function Controls({
  betAmount,
  onBetChange,
  spinsLeft,
  gameActive,
  isSpinning,
  canPlay,
  onPlay,
  bonusSpinActive,
}) {
  const betIndex = BET_AMOUNTS.indexOf(betAmount)
  const canDecrease = betIndex > 0 && !gameActive
  const canIncrease = betIndex < BET_AMOUNTS.length - 1 && !gameActive

  const decreaseBet = () => canDecrease && onBetChange(BET_AMOUNTS[betIndex - 1])
  const increaseBet = () => canIncrease && onBetChange(BET_AMOUNTS[betIndex + 1])

  const playLabel = gameActive
    ? (isSpinning ? 'ÇEVRİLİYOR' : 'ÇARKI ÇEVİR')
    : 'OYNA'

  return (
    <div className="panel panel-controls">
      <div className="spin-counter" aria-live="polite">
        <span className="spin-counter-label">Kalan Çark</span>
        <span className="spin-counter-value">{spinsLeft}</span>
        {bonusSpinActive && <span className="glow-magenta" style={{ fontSize: 12, color: '#ff2e9a' }}>+1 HEDİYE</span>}
      </div>

      <div className="bet-selector">
        <button
          className="bet-btn"
          onClick={decreaseBet}
          disabled={!canDecrease}
          aria-label="Bilet tutarını azalt"
        >−</button>
        <div className="bet-display">
          <div className="bet-display-label">Bilet</div>
          <div className="bet-display-value">{formatTL(betAmount)} TL</div>
        </div>
        <button
          className="bet-btn"
          onClick={increaseBet}
          disabled={!canIncrease}
          aria-label="Bilet tutarını artır"
        >+</button>
      </div>

      <button
        className={`play-btn ${isSpinning ? 'spinning' : ''}`}
        onClick={onPlay}
        disabled={!canPlay}
      >
        {playLabel}
      </button>
    </div>
  )
}
