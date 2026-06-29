import { COLORS } from '../game/config.js'

function formatTL(amount) {
  return amount.toLocaleString('tr-TR') + ' TL'
}

export default function PrizeLadder({ ladder, betAmount }) {
  // En yüksek ödülü hesapla (en üst satır - jackpot)
  const jackpot = ladder.length > 0
    ? Math.max(...ladder.map((r) => r.multiplier * betAmount))
    : 0

  return (
    <div className="panel panel-ladder">
      <div className="panel-title">Kazanç Bölgesi</div>

      <div className="ladder-jackpot">
        <div className="ladder-jackpot-label">En Yüksek Ödül</div>
        <div className="ladder-jackpot-amount">{formatTL(jackpot)}</div>
      </div>

      {ladder.map((row) => {
        const colorDef = COLORS[row.color]
        const prize = row.multiplier * betAmount

        return (
          <div
            key={row.color}
            className={`ladder-row ${row.completed ? 'completed' : ''}`}
            style={{
              '--slot-color': colorDef.hex,
              '--slot-glow': colorDef.glow,
              '--prize-color': row.completed ? '#ffd60a' : colorDef.hex,
            }}
          >
            <div className="ladder-slots">
              {Array.from({ length: row.slots }).map((_, i) => (
                <div
                  key={i}
                  className={`ladder-slot ${i < row.filled ? 'filled' : ''}`}
                />
              ))}
            </div>
            <div className="ladder-prize">{formatTL(prize)}</div>
          </div>
        )
      })}
    </div>
  )
}
