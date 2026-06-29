/**
 * FloatingPrize - kazanılan ödülü "+X TL" şeklinde yukarı doğru süzülerek gösterir
 */
export default function FloatingPrize({ amount, x, y, variant }) {
  const display = '+' + Math.round(amount).toLocaleString('tr-TR') + ' TL'
  return (
    <div
      className={`floating-prize floating-prize--${variant || 'gold'}`}
      style={{ left: `${x}px`, top: `${y}px` }}
      aria-hidden="true"
    >
      {display}
    </div>
  )
}
