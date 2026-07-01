/**
 * InfoModal - oyun kurallarını kompakt biçimde gösterir
 */
export default function InfoModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal info-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Kapat">×</button>
        <h2 className="info-title">NASIL OYNANIR?</h2>

        <div className="info-section">
          <div className="info-section-title">🎯 AMAÇ</div>
          <p>Bilet seçip <b>7 çark çevirerek</b> mümkün olduğunca çok TL kazan.</p>
        </div>

        <div className="info-section">
          <div className="info-section-title">🎡 ÇARK DİLİMLERİ</div>
          <ul className="info-list">
            <li>
              <span className="info-badge" style={{ background: '#ff3366' }} />
              <span className="info-badge" style={{ background: '#ff8a1f' }} />
              <span className="info-badge" style={{ background: '#ffd60a' }} />
              <span className="info-badge" style={{ background: '#c84bff' }} />
              <span className="info-badge" style={{ background: '#2e8bff' }} />
              <span className="info-badge" style={{ background: '#3ee07d' }} />
              <span className="info-text"><b>Renk dilimi:</b> o renkteki kule bloklarını yıkar, sağdaki barem satırını doldurur</span>
            </li>
            <li>
              <span className="info-glyph" style={{ color: '#ffd60a' }}>★</span>
              <span className="info-text"><b>Yıldız:</b> 4 tane toplanınca yıldız bonusu (0.5x – 4x bilet)</span>
            </li>
            <li>
              <span className="info-glyph" style={{ color: '#00e5ff' }}>➤</span>
              <span className="info-text"><b>Ok:</b> 4 tane toplanınca ok bonusu (1x – 8x bilet)</span>
            </li>
            <li>
              <span className="info-glyph">🎁</span>
              <span className="info-text"><b>Hediye:</b> Ekstra çark (spin sayısı düşmez)</span>
            </li>
            <li>
              <span className="info-glyph" style={{ color: '#aaff00' }}>₺</span>
              <span className="info-text"><b>Anında Kazan:</b> Direkt TL ödülü</span>
            </li>
            <li>
              <span className="info-glyph" style={{ color: '#ff2e9a' }}>?</span>
              <span className="info-text"><b>Mini Oyun:</b> Direkt bonus (0.2x – 4x bilet)</span>
            </li>
          </ul>
        </div>

        <div className="info-section">
          <div className="info-section-title">🏆 KAZANÇ BÖLGESİ (BAREM)</div>
          <p>
            Renk dilimi geldiğinde o rengin baremi dolar. Bir renk satırı tamamlanınca o satırın ödülü kazanılır.
          </p>
          <ul className="info-list info-list-tight">
            <li>Kırmızı → <b>0.1x</b> bilet</li>
            <li>Turuncu → <b>0.3x</b></li>
            <li>Sarı → <b>1x</b></li>
            <li>Mor → <b>4x</b></li>
            <li>Mavi → <b>18x</b></li>
            <li className="info-jackpot-row">Yeşil → <b>500x</b> JACKPOT 💎</li>
          </ul>
        </div>

        <div className="info-section">
          <div className="info-section-title">💰 SONUÇ</div>
          <p>Tur sonunda toplam kazanç bakiyeye eklenir. Yeni tur başlatıp devam edebilirsin.</p>
        </div>

        <div className="info-rtp">
          <span>Teorik geri dönüş oranı: <b>~%90</b></span>
        </div>

        <button className="info-btn-close" onClick={onClose}>Anladım</button>
      </div>
    </div>
  )
}
