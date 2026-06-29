import { useMemo } from 'react'

const CONFETTI_COLORS = ['#ff3366', '#ff8a1f', '#ffd60a', '#c84bff', '#2e8bff', '#3ee07d', '#ffffff']

/**
 * Confetti - merkezde konfeti patlaması yapar
 * trigger değiştiğinde yeni parçacıklar üretilir (key olarak kullanılır)
 */
export default function Confetti({ trigger, x, y, count = 36 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3
      const distance = 120 + Math.random() * 200
      return {
        id: i,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance - 80,
        rotation: (Math.random() - 0.5) * 1080,
        delay: Math.random() * 120,
        size: 5 + Math.random() * 8,
        shape: i % 3,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  if (!trigger) return null

  return (
    <div
      key={trigger}
      className="confetti-layer"
      style={{ left: `${x}px`, top: `${y}px` }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className={`confetti-piece confetti-shape-${p.shape}`}
          style={{
            background: p.color,
            width: `${p.size}px`,
            height: `${p.size * (p.shape === 1 ? 0.4 : 1)}px`,
            animationDelay: `${p.delay}ms`,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            '--rotation': `${p.rotation}deg`,
          }}
        />
      ))}
    </div>
  )
}
