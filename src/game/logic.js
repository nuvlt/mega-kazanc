// Mega Kazanç - Oyun Mantığı

import {
  WHEEL_SEGMENTS,
  SEGMENT_WEIGHTS,
  BLOCKS_DESTROYED_RANGES,
  INSTANT_WIN_MULTIPLIERS,
  COLOR_ORDER,
  LADDER,
  TOWER_HEIGHT,
} from './config.js'

/**
 * Ağırlıklı rastgele seçim
 */
export function weightedRandom(items, getWeight) {
  const totalWeight = items.reduce((sum, item) => sum + getWeight(item), 0)
  let random = Math.random() * totalWeight
  for (const item of items) {
    random -= getWeight(item)
    if (random <= 0) return item
  }
  return items[items.length - 1]
}

/**
 * Çark dilimi seç (ağırlıklı)
 * Dilim tiplerine ağırlık vererek seçilen dilim tipini bulur,
 * sonra o tipteki dilimlerden birini eşit ihtimalle seçer
 */
export function spinWheel() {
  // Önce hangi tipi seçtiğini belirle
  const types = Object.keys(SEGMENT_WEIGHTS)
  const chosenType = weightedRandom(types, (t) => SEGMENT_WEIGHTS[t])

  // O tipteki dilimleri bul
  const candidates = WHEEL_SEGMENTS.map((seg, idx) => ({ seg, idx })).filter(({ seg }) => {
    if (chosenType === 'red' || chosenType === 'orange' || chosenType === 'yellow' ||
        chosenType === 'purple' || chosenType === 'blue' || chosenType === 'green') {
      return seg.type === 'color' && seg.color === chosenType
    }
    return seg.type === chosenType
  })

  const chosen = candidates[Math.floor(Math.random() * candidates.length)]
  return { segmentIndex: chosen.idx, segment: chosen.seg }
}

/**
 * Bir renkten kaç blok yıkılacağını belirle (1-6 arası, renge göre bias)
 */
export function rollBlocksDestroyed(color) {
  const range = BLOCKS_DESTROYED_RANGES[color] || { min: 1, max: 6 }
  return range.min + Math.floor(Math.random() * (range.max - range.min + 1))
}

/**
 * Anında kazan miktarı (bilet çarpanı)
 */
export function rollInstantWin() {
  return weightedRandom(INSTANT_WIN_MULTIPLIERS, (item) => item.weight).mult
}

/**
 * İlk oyun state'ini oluştur
 */
export function createInitialGameState(betAmount, spinsCount) {
  const towers = COLOR_ORDER.map((color) => ({
    color,
    blocksDestroyed: 0,
    maxBlocks: TOWER_HEIGHT,
  }))

  const ladder = LADDER.map((row) => ({
    ...row,
    filled: 0,
    completed: false,
  }))

  return {
    betAmount,
    spinsLeft: spinsCount,
    spinsUsed: 0,
    towers,
    ladder,
    stars: 0,
    arrows: 0,
    sessionWinnings: 0,
    pendingMiniGames: [], // ['star', 'arrow', 'direct']
    lastSpin: null,
    log: [],
  }
}

/**
 * Spin sonucunu state'e uygula. Yeni state ve animasyon eventleri döner.
 */
export function applySpinResult(state, spinResult) {
  const { segment } = spinResult
  const newState = {
    ...state,
    towers: state.towers.map((t) => ({ ...t })),
    ladder: state.ladder.map((r) => ({ ...r })),
    pendingMiniGames: [...state.pendingMiniGames],
    log: [...state.log],
  }

  let event = { type: segment.type, segment }
  let bonusSpin = false

  if (segment.type === 'color') {
    const color = segment.color
    const tower = newState.towers.find((t) => t.color === color)
    const ladderRow = newState.ladder.find((r) => r.color === color)

    const remainingTowerBlocks = tower.maxBlocks - tower.blocksDestroyed
    const remainingLadderSlots = ladderRow.slots - ladderRow.filled

    let blocksToDestroy = rollBlocksDestroyed(color)
    blocksToDestroy = Math.min(blocksToDestroy, remainingTowerBlocks)
    const ladderFill = Math.min(blocksToDestroy, remainingLadderSlots)

    tower.blocksDestroyed += blocksToDestroy
    ladderRow.filled += ladderFill

    let prizeWon = 0
    let rowCompleted = false
    if (ladderRow.filled >= ladderRow.slots && !ladderRow.completed) {
      ladderRow.completed = true
      prizeWon = ladderRow.multiplier * newState.betAmount
      newState.sessionWinnings += prizeWon
      rowCompleted = true
    }

    event = {
      type: 'color',
      color,
      blocksDestroyed: blocksToDestroy,
      ladderFilled: ladderFill,
      rowCompleted,
      prizeWon,
    }
    newState.log.push(
      `${color.toUpperCase()}: ${blocksToDestroy} blok yıkıldı` +
      (rowCompleted ? `, ${prizeWon} TL kazanıldı!` : '')
    )
  } else if (segment.type === 'star') {
    newState.stars += 1
    event = { type: 'star', stars: newState.stars }
    newState.log.push(`★ Yıldız toplandı (${newState.stars}/4)`)
    if (newState.stars >= 4) {
      newState.pendingMiniGames.push('star')
      newState.stars = 0
    }
  } else if (segment.type === 'arrow') {
    newState.arrows += 1
    event = { type: 'arrow', arrows: newState.arrows }
    newState.log.push(`➤ Ok toplandı (${newState.arrows}/4)`)
    if (newState.arrows >= 4) {
      newState.pendingMiniGames.push('arrow')
      newState.arrows = 0
    }
  } else if (segment.type === 'gift') {
    bonusSpin = true
    event = { type: 'gift' }
    newState.log.push('🎁 Hediye Oyun! Ekstra çark hakkı.')
  } else if (segment.type === 'instant') {
    const mult = rollInstantWin()
    const prize = mult * newState.betAmount
    newState.sessionWinnings += prize
    event = { type: 'instant', multiplier: mult, prize }
    newState.log.push(`Anında Kazan: ${prize} TL`)
  } else if (segment.type === 'minigame') {
    newState.pendingMiniGames.push('direct')
    event = { type: 'minigame' }
    newState.log.push('🎯 Mini Oyun açıldı!')
  }

  newState.spinsUsed += 1
  if (!bonusSpin) {
    newState.spinsLeft -= 1
  }
  newState.lastSpin = { segment, event, bonusSpin }

  return { state: newState, event, bonusSpin }
}

/**
 * Mini oyun sonucu state'e uygula
 */
export function applyMiniGameResult(state, type, prize) {
  const newState = {
    ...state,
    pendingMiniGames: state.pendingMiniGames.slice(1),
    log: [...state.log, `Mini oyun (${type}): ${prize} TL kazanıldı`],
    sessionWinnings: state.sessionWinnings + prize,
  }
  return newState
}
