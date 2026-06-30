/**
 * FlyingIcon - simge başlangıç noktasından hedefe doğru süzülerek uçar
 * Kıvrımlı yol için CSS keyframe (start → mid arc → end)
 */
export default function FlyingIcon({ icon, startX, startY, endX, endY, color }) {
  const midX = (startX + endX) / 2
  const midY = Math.min(startY, endY) - 100 // yukarı arc

  return (
    <div
      className="flying-icon"
      style={{
        '--start-x': `${startX}px`,
        '--start-y': `${startY}px`,
        '--mid-x': `${midX}px`,
        '--mid-y': `${midY}px`,
        '--end-x': `${endX}px`,
        '--end-y': `${endY}px`,
        color,
      }}
      aria-hidden="true"
    >
      <span className="flying-icon-glyph">{icon}</span>
      <span className="flying-icon-trail" />
    </div>
  )
}
