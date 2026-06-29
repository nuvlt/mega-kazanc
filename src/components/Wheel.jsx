import { useEffect, useRef, useState } from 'react'
import { WHEEL_SEGMENTS, COLORS } from '../game/config.js'

const SEGMENT_COUNT = WHEEL_SEGMENTS.length
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT

function getSegmentColor(seg) {
  if (seg.type === 'color') return COLORS[seg.color].hex
  if (seg.type === 'star') return '#1a0a3a'
  if (seg.type === 'arrow') return '#1a0a3a'
  if (seg.type === 'gift') return '#3a1855'
  if (seg.type === 'instant') return '#0a3a1a'
  if (seg.type === 'minigame') return '#3a0a25'
  return '#222'
}

function getSegmentLabel(seg) {
  if (seg.type === 'color') return ''
  if (seg.type === 'star') return '★'
  if (seg.type === 'arrow') return '➤'
  if (seg.type === 'gift') return '🎁'
  if (seg.type === 'instant') return '₺'
  if (seg.type === 'minigame') return '?'
  return ''
}

function getLabelColor(seg) {
  if (seg.type === 'star') return '#ffd60a'
  if (seg.type === 'arrow') return '#00e5ff'
  if (seg.type === 'gift') return '#ff2e9a'
  if (seg.type === 'instant') return '#aaff00'
  if (seg.type === 'minigame') return '#ff2e9a'
  return '#fff'
}

function segmentPath(index) {
  const cx = 200, cy = 200, r = 180
  const startAngle = (index * SEGMENT_ANGLE - 90 - SEGMENT_ANGLE / 2) * (Math.PI / 180)
  const endAngle = ((index + 1) * SEGMENT_ANGLE - 90 - SEGMENT_ANGLE / 2) * (Math.PI / 180)
  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy + r * Math.sin(endAngle)
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`
}

function labelPosition(index) {
  const cx = 200, cy = 200, r = 125
  const angle = (index * SEGMENT_ANGLE - 90) * (Math.PI / 180)
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  }
}

/**
 * Wheel - spinSignal her spin'de bir önceki değerinden farklı olmalı (genelde artırılır).
 * 0 ise hiç dönmemiş demek. Aynı dilime iki kez düşse bile yeni signal ile spin tetiklenir.
 */
export default function Wheel({ spinSignal, targetIndex, onSpinEnd }) {
  const [rotation, setRotation] = useState(0)
  const prevSignalRef = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!spinSignal) return
    if (spinSignal === prevSignalRef.current) return
    if (targetIndex === null || targetIndex === undefined) return

    prevSignalRef.current = spinSignal

    const targetAngle = -(targetIndex * SEGMENT_ANGLE)
    const fullTurns = 5 + Math.floor(Math.random() * 2)
    setRotation((prev) => {
      const base = Math.floor(prev / 360 + 1) * 360
      return base + fullTurns * 360 + targetAngle
    })

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onSpinEnd?.()
    }, 4100)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [spinSignal, targetIndex, onSpinEnd])

  return (
    <div className="wheel-area">
      <div className="wheel-container">
        <div className="wheel-pointer" aria-hidden="true" />
        <svg
          viewBox="0 0 400 400"
          className="wheel-svg"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <circle cx="200" cy="200" r="195" fill="none" stroke="rgba(200, 100, 255, 0.6)" strokeWidth="3" />

          {WHEEL_SEGMENTS.map((seg, i) => (
            <g key={i}>
              <path
                d={segmentPath(i)}
                fill={getSegmentColor(seg)}
                stroke="rgba(0, 0, 0, 0.6)"
                strokeWidth="2"
              />
              {seg.type === 'color' && (
                <path d={segmentPath(i)} fill="url(#shineGradient)" opacity="0.4" />
              )}
            </g>
          ))}

          {WHEEL_SEGMENTS.map((seg, i) => {
            const pos = labelPosition(i)
            const label = getSegmentLabel(seg)
            const color = getLabelColor(seg)
            const labelAngle = i * SEGMENT_ANGLE
            return (
              <g key={`label-${i}`} transform={`rotate(${labelAngle} ${pos.x} ${pos.y})`}>
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="28"
                  fontWeight="700"
                  fontFamily="Russo One"
                  fill={color}
                  style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                >
                  {label}
                </text>
              </g>
            )
          })}

          <defs>
            <radialGradient id="shineGradient" cx="50%" cy="0%" r="80%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
        </svg>
        <div className="wheel-center">MEGA</div>
      </div>
    </div>
  )
}
