import { useState, useCallback, useRef, useEffect } from 'react'
import {
  BET_AMOUNTS,
  STARTING_BALANCE,
  SPINS_PER_GAME,
} from './game/config.js'
import {
  spinWheel,
  applySpinResult,
  applyMiniGameResult,
  createInitialGameState,
} from './game/logic.js'
import Wheel from './components/Wheel.jsx'
import Towers from './components/Towers.jsx'
import PrizeLadder from './components/PrizeLadder.jsx'
import MiniTracker from './components/MiniTracker.jsx'
import Controls from './components/Controls.jsx'
import MiniGameModal from './components/MiniGameModal.jsx'
import ResultModal from './components/ResultModal.jsx'

function formatTL(amount) {
  return amount.toLocaleString('tr-TR') + ' TL'
}

const INITIAL_GAME = createInitialGameState(BET_AMOUNTS[0], SPINS_PER_GAME)

export default function App() {
  // --- Persistent state ---
  const [balance, setBalance] = useState(STARTING_BALANCE)
  const [betAmount, setBetAmount] = useState(BET_AMOUNTS[0])

  // --- Round state ---
  const [gameActive, setGameActive] = useState(false)
  const [game, setGame] = useState(INITIAL_GAME)

  // --- Animation state ---
  const [isSpinning, setIsSpinning] = useState(false)
  const [targetWheelIndex, setTargetWheelIndex] = useState(null)
  const [spinSignal, setSpinSignal] = useState(0)
  const [pendingSpinResult, setPendingSpinResult] = useState(null)
  const [recentlyDestroyed, setRecentlyDestroyed] = useState(null)
  const [bonusSpinFlash, setBonusSpinFlash] = useState(false)

  // --- Modals ---
  const [activeMiniGame, setActiveMiniGame] = useState(null) // 'star' | 'arrow' | 'direct' | null
  const [showResult, setShowResult] = useState(false)

  // --- Toasts ---
  const [toasts, setToasts] = useState([])
  const toastIdRef = useRef(0)

  const pushToast = useCallback((message) => {
    const id = ++toastIdRef.current
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 8000)
  }, [])

  // --- Tur başlat ---
  const startRound = useCallback(() => {
    if (balance < betAmount) {
      pushToast('Yetersiz bakiye.')
      return
    }
    setBalance((b) => b - betAmount)
    setGame(createInitialGameState(betAmount, SPINS_PER_GAME))
    setGameActive(true)
  }, [balance, betAmount, pushToast])

  // --- Çark çevir ---
  const triggerSpin = useCallback(() => {
    if (!gameActive || isSpinning) return
    if (game.spinsLeft <= 0) return

    const result = spinWheel()
    setPendingSpinResult(result)
    setTargetWheelIndex(result.segmentIndex)
    setSpinSignal((s) => s + 1)
    setIsSpinning(true)
  }, [gameActive, isSpinning, game.spinsLeft])

  // --- Çark döndü, sonucu uygula ---
  const handleSpinEnd = useCallback(() => {
    if (!pendingSpinResult) return

    const { state: newState, event, bonusSpin } = applySpinResult(game, pendingSpinResult)
    setGame(newState)
    setIsSpinning(false)
    setPendingSpinResult(null)

    // Olay toast'u
    if (event.type === 'color') {
      const colorName = { red: 'Kırmızı', orange: 'Turuncu', yellow: 'Sarı', purple: 'Mor', blue: 'Mavi', green: 'Yeşil' }[event.color]
      pushToast(`${colorName}: ${event.blocksDestroyed} blok yıkıldı`)
      if (event.rowCompleted) {
        setTimeout(() => pushToast(`🏆 ${colorName} barem tamamlandı: ${formatTL(event.prizeWon)}!`), 300)
      }
      setRecentlyDestroyed({ color: event.color, count: event.blocksDestroyed })
      setTimeout(() => setRecentlyDestroyed(null), 600)
    } else if (event.type === 'star') {
      pushToast(`★ Yıldız (${event.stars}/4)`)
    } else if (event.type === 'arrow') {
      pushToast(`➤ Ok (${event.arrows}/4)`)
    } else if (event.type === 'gift') {
      pushToast('🎁 Hediye Oyun! Ekstra çark.')
      setBonusSpinFlash(true)
      setTimeout(() => setBonusSpinFlash(false), 2000)
    } else if (event.type === 'instant') {
      pushToast(`💰 Anında Kazan: ${formatTL(event.prize)}`)
    } else if (event.type === 'minigame') {
      pushToast('🎯 Mini Oyun açıldı!')
    }
  }, [game, pendingSpinResult, pushToast])

  // --- Mini oyun açma ---
  useEffect(() => {
    if (isSpinning) return
    if (activeMiniGame) return
    if (game.pendingMiniGames.length > 0) {
      // Kısa bir gecikme ile mini oyun aç
      const t = setTimeout(() => {
        setActiveMiniGame(game.pendingMiniGames[0])
      }, 700)
      return () => clearTimeout(t)
    }
  }, [game.pendingMiniGames, isSpinning, activeMiniGame])

  // --- Mini oyun bitti ---
  const handleMiniGameComplete = useCallback((prize) => {
    const type = activeMiniGame
    setGame((g) => applyMiniGameResult(g, type, prize))
    setActiveMiniGame(null)
    pushToast(`Mini oyun ödülü: ${formatTL(prize)}`)
  }, [activeMiniGame, pushToast])

  // --- Tur bitiş kontrolü ---
  useEffect(() => {
    if (!gameActive) return
    if (isSpinning) return
    if (activeMiniGame) return
    if (game.pendingMiniGames.length > 0) return
    if (game.spinsLeft <= 0) {
      // 800ms son toast'ların yerleşmesi için
      const t = setTimeout(() => setShowResult(true), 800)
      return () => clearTimeout(t)
    }
  }, [gameActive, isSpinning, activeMiniGame, game.pendingMiniGames.length, game.spinsLeft])

  // --- Turu kapat ---
  const closeResult = useCallback(() => {
    setBalance((b) => b + game.sessionWinnings)
    setShowResult(false)
    setGameActive(false)
    setGame(createInitialGameState(betAmount, SPINS_PER_GAME))
    setRecentlyDestroyed(null)
    setTargetWheelIndex(null)
  }, [game.sessionWinnings, betAmount])

  // --- Buton durumu ---
  const canPlay = !isSpinning && !activeMiniGame && !showResult && (
    !gameActive ? balance >= betAmount : game.spinsLeft > 0
  )

  const handlePlayClick = () => {
    if (!gameActive) {
      startRound()
    } else {
      triggerSpin()
    }
  }

  // --- Bet değişikliği (sadece tur dışında) ---
  const handleBetChange = (newBet) => {
    if (gameActive) return
    setBetAmount(newBet)
    setGame((g) => ({ ...g, betAmount: newBet }))
  }

  // Bilet değiştiğinde initial state'i güncelle
  useEffect(() => {
    if (!gameActive) {
      setGame(createInitialGameState(betAmount, SPINS_PER_GAME))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [betAmount])

  return (
    <div className="app">
      {/* Üst bar */}
      <header className="topbar">
        <div className="logo">
          <div className="logo-mark" aria-hidden="true" />
          <div className="logo-text">Mega Kazanç</div>
        </div>
        <div className="balance">
          <div className="balance-label">Bakiye</div>
          <div className="balance-amount">{formatTL(balance)}</div>
        </div>
      </header>

      {/* Oyun alanı */}
      <main className="game-area">
        <section className="panel panel-main">
          <Towers towers={game.towers} recentlyDestroyed={recentlyDestroyed} />
          <Wheel
            spinSignal={spinSignal}
            targetIndex={targetWheelIndex}
            isSpinning={isSpinning}
            onSpinEnd={handleSpinEnd}
          />
        </section>

        <section className="panel-ladder-wrapper">
          <PrizeLadder ladder={game.ladder} betAmount={betAmount} />
          <MiniTracker stars={game.stars} arrows={game.arrows} />
        </section>

        <Controls
          betAmount={betAmount}
          onBetChange={handleBetChange}
          spinsLeft={game.spinsLeft}
          gameActive={gameActive}
          isSpinning={isSpinning}
          canPlay={canPlay}
          onPlay={handlePlayClick}
          bonusSpinActive={bonusSpinFlash}
        />
      </main>

      {/* Toast log */}
      <div className="event-log">
        {toasts.map((t) => (
          <div key={t.id} className="event-toast">{t.message}</div>
        ))}
      </div>

      {/* Mini oyun modal */}
      {activeMiniGame && (
        <MiniGameModal
          type={activeMiniGame}
          betAmount={betAmount}
          onComplete={handleMiniGameComplete}
        />
      )}

      {/* Sonuç modal */}
      {showResult && (
        <ResultModal
          totalWon={game.sessionWinnings}
          betAmount={betAmount}
          onClose={closeResult}
        />
      )}
    </div>
  )
}
