import { useMemo } from 'react'

// Ana hat boyunca zigzag oluştur
function generateZigzag(startX, startY, endX, endY, segments = 10, jitter = 28) {
  const points = [[startX, startY]]
  const dx = endX - startX
  const dy = endY - startY
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const perpX = -dy / len
  const perpY = dx / len

  for (let i = 1; i < segments; i++) {
    const t = i / segments
    const baseX = startX + dx * t
    const baseY = startY + dy * t
    const offset = (Math.random() - 0.5) * jitter * (1 - Math.abs(t - 0.5) * 0.8)
    points.push([baseX + perpX * offset, baseY + perpY * offset])
  }
  points.push([endX, endY])
  return points
}

function pointsToPath(points) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
}

// Ana hattan çatallanan kollar
function generateBranches(mainPoints, count = 3) {
  const branches = []
  for (let b = 0; b < count; b++) {
    const idx = 2 + Math.floor(Math.random() * (mainPoints.length - 4))
    const [sx, sy] = mainPoints[idx]
    const angle = (Math.random() - 0.5) * 1.4 + (Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2)
    const dist = 20 + Math.random() * 40
    const ex = sx + Math.cos(angle) * dist
    const ey = sy + Math.sin(angle) * dist
    const pts = generateZigzag(sx, sy, ex, ey, 4, 12)
    branches.push(pointsToPath(pts))
  }
  return branches
}

/**
 * LightningBolt - çark merkezinden hedef kuleye çatallı şimşek
 * Üç katmanlı: dış halo (kalın, blur'lu) + orta (renk) + iç beyaz çekirdek
 */
export default function LightningBolt({ startX, startY, endX, endY, color, glow }) {
  const { mainPath, branches } = useMemo(() => {
    const pts = generateZigzag(startX, startY, endX, endY, 10, 30)
    return {
      mainPath: pointsToPath(pts),
      branches: generateBranches(pts, 3),
    }
  }, [startX, startY, endX, endY])

  return (
    <svg
      className="lightning-bolt"
      width={typeof window !== 'undefined' ? window.innerWidth : 1280}
      height={typeof window !== 'undefined' ? window.innerHeight : 800}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 45,
      }}
      aria-hidden="true"
    >
      <defs>
        <filter id={`lightningGlow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Dış halo (kalın renkli, blur) */}
      <path
        d={mainPath}
        stroke={glow || color}
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
        filter={`url(#lightningGlow-${color})`}
        className="lightning-flicker"
      />
      {/* Orta katman (renkli) */}
      <path
        d={mainPath}
        stroke={color}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
        className="lightning-flicker"
      />
      {/* İç çekirdek (beyaz) */}
      <path
        d={mainPath}
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lightning-flicker"
      />

      {/* Çatallar */}
      {branches.map((b, i) => (
        <g key={i}>
          <path
            d={b}
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
            className="lightning-flicker"
          />
          <path
            d={b}
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            className="lightning-flicker"
          />
        </g>
      ))}
    </svg>
  )
}
