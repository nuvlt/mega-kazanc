/**
 * WinFlash - büyük kazançta tüm ekranı kaplayan altın parlama
 */
export default function WinFlash({ trigger }) {
  if (!trigger) return null
  return (
    <div key={trigger} className="win-flash" aria-hidden="true">
      <div className="win-flash-burst" />
    </div>
  )
}
