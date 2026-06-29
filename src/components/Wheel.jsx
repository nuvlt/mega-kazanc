import { useEffect, useRef, useState } from 'react'
import { WHEEL_SEGMENTS, COLORS } from '../game/config.js'

const SEGMENT_COUNT = WHEEL_SEGMENTS.length
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT

function getSegmentColor(seg) {
  if (seg.type === 'color') return COLORS[seg.color].hex
  if (seg.type === 'star') return '#1a0a3a'
  if (seg.type === 'arrow') return '#0d1a3a'
  if (seg.type === 'gift') return '#3a0d44'
  if (seg.type === 'instant') return '#0a3318'
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
  const cx = 200, cy = 200, r = 132
  const angle = (index * SEGMENT_ANGLE - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
}

function pegPosition(index) {
  const cx = 200, cy = 200, r = 173
  const angle = (index * SEGMENT_ANGLE - 90 - SEGMENT_ANGLE / 2) * (Math.PI / 180)
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
}

export default function Wheel({ spinSignal, targetIndex, isSpinning, onSpinEnd }) {
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

  const rotatingGroupStyle = {
    transformOrigin: '200px 200px',
    transform: `rotate(${rotation}deg)`,
    transition: 'transform 4s cubic-bezier(0.17, 0.67, 0.21, 1)',
  }

  return (
    <div className={`wheel-stage${isSpinning ? ' is-spinning' : ''}`}>
      <div className="wheel-spotlight" aria-hidden="true" />
      <div className="wheel-container">
        <svg viewBox="0 0 400 400" className="wheel-svg" aria-label="Mega Kazanç çarkı">
          <defs>
            {/* Krom/altın halka gradyanı */}
            <linearGradient id="chromeRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5d76e" />
              <stop offset="22%" stopColor="#7a5f1a" />
              <stop offset="50%" stopColor="#3d2f0d" />
              <stop offset="78%" stopColor="#7a5f1a" />
              <stop offset="100%" stopColor="#f5d76e" />
            </linearGradient>

            {/* Merkez orb */}
            <radialGradient id="centerOrb" cx="35%" cy="28%">
              <stop offset="0%" stopColor="#6a3eb0" />
              <stop offset="50%" stopColor="#1e0d3e" />
              <stop offset="100%" stopColor="#06010f" />
            </radialGradient>

            {/* Vinyet - dilim merkezine doğru karartma */}
            <radialGradient id="wheelVignette" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
              <stop offset="35%" stopColor="rgba(0,0,0,0.2)" />
              <stop offset="72%" stopColor="rgba(0,0,0,0.04)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>

            {/* Üst parlama - statik ışık yansıması */}
            <radialGradient id="wheelTopShine" cx="50%" cy="12%" r="38%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.34)" />
              <stop offset="55%" stopColor="rgba(255,255,255,0.06)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>

            {/* Mor/cyan halo (dış glow) */}
            <radialGradient id="wheelHalo" cx="50%" cy="50%" r="50%">
              <stop offset="58%" stopColor="rgba(180,120,255,0)" />
              <stop offset="88%" stopColor="rgba(180,120,255,0.18)" />
              <stop offset="100%" stopColor="rgba(180,120,255,0)" />
            </radialGradient>

            {/* Altın çivi */}
            <radialGradient id="pegGrad" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#fff5a0" />
              <stop offset="50%" stopColor="#f5d76e" />
              <stop offset="100%" stopColor="#7a5f1a" />
            </radialGradient>
          </defs>

          {/* Halo (dış mor parıltı) */}
          <circle cx="200" cy="200" r="198" fill="url(#wheelHalo)" />

          {/* Koyu dış sınır */}
          <circle cx="200" cy="200" r="194" fill="#06010f" />

          {/* Krom / altın ana halka */}
          <circle cx="200" cy="200" r="190" fill="url(#chromeRing)" />

          {/* Koyu iç ayraç */}
          <circle cx="200" cy="200" r="182" fill="#0a0220" />

          {/* DÖNEN GRUP - dilimler + etiketler + çiviler */}
          <g style={rotatingGroupStyle}>
            {WHEEL_SEGMENTS.map((seg, i) => (
              <path
                key={`seg-${i}`}
                d={segmentPath(i)}
                fill={getSegmentColor(seg)}
                stroke="rgba(0, 0, 0, 0.85)"
                strokeWidth="1.5"
              />
            ))}

            {/* Etiketler */}
            {WHEEL_SEGMENTS.map((seg, i) => {
              const pos = labelPosition(i)
              const label = getSegmentLabel(seg)
              const color = getLabelColor(seg)
              const labelAngle = i * SEGMENT_ANGLE
              if (!label) return null
              return (
                <g key={`label-${i}`} transform={`rotate(${labelAngle} ${pos.x} ${pos.y})`}>
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="32"
                    fontWeight="700"
                    fontFamily="Russo One"
                    fill={color}
                    style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                  >
                    {label}
                  </text>
                </g>
              )
            })}

            {/* Çiviler (dilim sınırlarında altın boncuklar) */}
            {Array.from({ length: SEGMENT_COUNT }).map((_, i) => {
              const peg = pegPosition(i)
              return (
                <g key={`peg-${i}`}>
                  <circle cx={peg.x} cy={peg.y + 1} r="4.2" fill="rgba(0,0,0,0.6)" />
                  <circle cx={peg.x} cy={peg.y} r="3.5" fill="url(#pegGrad)" />
                  <circle cx={peg.x - 0.8} cy={peg.y - 0.8} r="1.1" fill="rgba(255,255,255,0.75)" />
                </g>
              )
            })}
          </g>

          {/* STATİK ÖRTÜLER (dönmüyor) */}
          {/* Vinyet karartma - merkezi koyu, kenar açık */}
          <circle cx="200" cy="200" r="182" fill="url(#wheelVignette)" pointerEvents="none" />
          {/* Üst parlak ışık yansıması (her zaman 12 yönde) */}
          <circle cx="200" cy="200" r="182" fill="url(#wheelTopShine)" pointerEvents="none" />

          {/* STATİK MERKEZ HUB */}
          {/* Krom hub çerçevesi */}
          <circle cx="200" cy="200" r="62" fill="url(#chromeRing)" stroke="#06010f" strokeWidth="2" />
          {/* Merkez orb */}
          <circle cx="200" cy="200" r="54" fill="url(#centerOrb)" stroke="rgba(170,255,0,0.45)" strokeWidth="1.5" />
          {/* İç dekoratif noktalı halka */}
          <circle cx="200" cy="200" r="44" fill="none" stroke="rgba(170,255,0,0.18)" strokeWidth="1" strokeDasharray="2 3" />

          {/* Mini renk çarkı logosu */}
          <g transform="translate(200, 187)">
            <path d="M 0 -11 A 11 11 0 0 1 9.53 5.5 L 0 0 Z" fill="#ff3366" />
            <path d="M 9.53 5.5 A 11 11 0 0 1 -9.53 5.5 L 0 0 Z" fill="#ffd60a" />
            <path d="M -9.53 5.5 A 11 11 0 0 1 0 -11 L 0 0 Z" fill="#3ee07d" />
            <circle r="2.5" fill="#0a0220" />
          </g>

          {/* MEGA metni */}
          <text
            x="200" y="218"
            textAnchor="middle"
            fontFamily="Russo One"
            fontSize="13"
            fill="#aaff00"
            style={{ letterSpacing: '2px', filter: 'drop-shadow(0 0 6px #aaff00)' }}
          >
            MEGA
          </text>
        </svg>

        {/* POINTER - SVG, statik, çarkın üstünde 12 yönünde */}
        <div className="wheel-pointer" aria-hidden="true">
          <svg viewBox="0 0 44 52" width="100%" height="100%">
            <defs>
              <linearGradient id="pointerGold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fff5a0" />
                <stop offset="45%" stopColor="#ffd60a" />
                <stop offset="100%" stopColor="#a87600" />
              </linearGradient>
            </defs>
            {/* Ana gövde */}
            <path d="M 22 6 L 39 10 L 22 50 L 5 10 Z" fill="url(#pointerGold)" stroke="#3d2f0d" strokeWidth="1.5" />
            {/* Parlama */}
            <path d="M 22 10 L 30 12 L 22 32 Z" fill="rgba(255,255,255,0.45)" />
            {/* Tepe vurgu */}
            <circle cx="22" cy="10" r="2" fill="#fff5a0" />
          </svg>
        </div>
      </div>
    </div>
  )
}
