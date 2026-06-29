import { COLLECTION_TARGET } from '../game/config.js'

export default function MiniTracker({ stars, arrows }) {
  return (
    <div className="mini-tracker">
      <div className="tracker-item" style={{ '--symbol-color': '#ffd60a' }}>
        <div className="tracker-label">Yıldız Bonusu</div>
        <div className="tracker-symbols">
          {Array.from({ length: COLLECTION_TARGET }).map((_, i) => (
            <div
              key={i}
              className={`tracker-symbol ${i < stars ? 'filled' : ''}`}
              style={{ '--symbol-color': '#ffd60a' }}
            >
              ★
            </div>
          ))}
        </div>
      </div>
      <div className="tracker-item" style={{ '--symbol-color': '#00e5ff' }}>
        <div className="tracker-label">Ok Bonusu</div>
        <div className="tracker-symbols">
          {Array.from({ length: COLLECTION_TARGET }).map((_, i) => (
            <div
              key={i}
              className={`tracker-symbol ${i < arrows ? 'filled' : ''}`}
              style={{ '--symbol-color': '#00e5ff' }}
            >
              ➤
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
