function formatTL(amount) {
  return amount.toLocaleString('tr-TR') + ' TL'
}

export default function ResultModal({ totalWon, betAmount, onClose }) {
  const won = totalWon > 0
  const profit = totalWon - betAmount

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-title" style={{ color: won ? 'var(--accent-lime)' : 'var(--text-secondary)' }}>
          {won ? 'TEBRİKLER!' : 'Tur Bitti'}
        </div>
        <div className="modal-subtitle">
          {won ? 'Bu turda toplam kazancın:' : 'Bu turda kazanç çıkmadı.'}
        </div>
        <div className="modal-amount">{formatTL(totalWon)}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Bilet: {formatTL(betAmount)} · Net: {profit >= 0 ? '+' : ''}{formatTL(profit)}
        </div>
        <button className="modal-btn" onClick={onClose}>
          Yeni Tur
        </button>
      </div>
    </div>
  )
}
