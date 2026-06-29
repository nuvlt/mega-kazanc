import { COLOR_ORDER, COLORS, TOWER_HEIGHT } from '../game/config.js'

export default function Towers({ towers, recentlyDestroyed }) {
  return (
    <div className="towers" role="group" aria-label="Renk kuleleri">
      {COLOR_ORDER.map((color) => {
        const tower = towers.find((t) => t.color === color)
        const destroyed = tower ? tower.blocksDestroyed : 0
        const colorDef = COLORS[color]
        const isHit = recentlyDestroyed?.color === color
        const recentCount = isHit ? recentlyDestroyed.count : 0

        const towerClass = `tower${isHit ? ' tower--hit' : ''}`

        return (
          <div
            key={color}
            className={towerClass}
            style={{
              '--block-color': colorDef.hex,
              '--block-glow': colorDef.glow,
            }}
            aria-label={`${colorDef.name} kulesi, ${TOWER_HEIGHT - destroyed} blok kaldı`}
          >
            {isHit && (
              <div className="tower-impact" aria-hidden="true">
                <span className="tower-impact-burst" />
                <span className="tower-impact-dust" />
              </div>
            )}
            <div className="tower-base" aria-hidden="true" />
            {Array.from({ length: TOWER_HEIGHT }).map((_, idx) => {
              const blockIndex = TOWER_HEIGHT - 1 - idx
              const isDestroyed = blockIndex < destroyed
              const isDestroying =
                isHit &&
                blockIndex >= destroyed - recentCount &&
                blockIndex < destroyed

              // Alternating fall direction
              const dirClass = isDestroying ? (blockIndex % 2 === 0 ? ' destroying-left' : ' destroying-right') : ''

              const className = isDestroying
                ? `tower-block destroying${dirClass}`
                : isDestroyed
                ? 'tower-block destroyed'
                : 'tower-block'

              return <div key={blockIndex} className={className} />
            })}
          </div>
        )
      })}
    </div>
  )
}
