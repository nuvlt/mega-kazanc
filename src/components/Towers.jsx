import { COLOR_ORDER, COLORS, TOWER_HEIGHT } from '../game/config.js'

export default function Towers({ towers, recentlyDestroyed }) {
  return (
    <div className="towers" role="group" aria-label="Renk kuleleri">
      {COLOR_ORDER.map((color) => {
        const tower = towers.find((t) => t.color === color)
        const destroyed = tower ? tower.blocksDestroyed : 0
        const colorDef = COLORS[color]
        const isRecent = recentlyDestroyed?.color === color
        const recentCount = isRecent ? recentlyDestroyed.count : 0

        // Bloklar aşağıdan yukarı; en alttaki indeks 0
        return (
          <div
            key={color}
            className="tower"
            style={{
              '--block-color': colorDef.hex,
              '--block-glow': colorDef.glow,
            }}
            aria-label={`${colorDef.name} kulesi, ${TOWER_HEIGHT - destroyed} blok kaldı`}
          >
            <div className="tower-base" aria-hidden="true" />
            {Array.from({ length: TOWER_HEIGHT }).map((_, idx) => {
              // idx 0 = altta. yıkımlar üstten başlar.
              const blockIndex = TOWER_HEIGHT - 1 - idx
              const isDestroyed = blockIndex < destroyed
              const isDestroying =
                isRecent &&
                blockIndex >= destroyed - recentCount &&
                blockIndex < destroyed

              const className = isDestroying
                ? 'tower-block destroying'
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
