// Kodsal ses modülü - Web Audio API ile prosedürel ses sentezi
// Ses dosyası kullanılmıyor, tüm sesler oscillator + noise buffer'la üretilir

const STORAGE_KEY = 'mk_muted'

class SoundManager {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this._muted = this._loadMuted()
    this._activeSpinTicks = []
  }

  _loadMuted() {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  }

  _saveMuted() {
    try {
      localStorage.setItem(STORAGE_KEY, this._muted ? '1' : '0')
    } catch {}
  }

  isMuted() {
    return this._muted
  }

  setMuted(m) {
    this._muted = !!m
    this._saveMuted()
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(m ? 0 : 1, this.ctx.currentTime, 0.02)
    }
  }

  toggle() {
    this.setMuted(!this._muted)
    return this._muted
  }

  // AudioContext lazy init - kullanıcı etkileşiminden sonra oluşturulur
  _ensure() {
    if (this._muted) return null
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext
        if (!AC) return null
        this.ctx = new AC()
        this.masterGain = this.ctx.createGain()
        this.masterGain.gain.value = 1
        this.masterGain.connect(this.ctx.destination)
      } catch {
        return null
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  _noiseBuffer(ctx, duration, envelope) {
    const size = Math.floor(ctx.sampleRate * duration)
    const buf = ctx.createBuffer(1, size, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < size; i++) {
      const t = i / size
      const env = envelope ? envelope(t) : 1
      data[i] = (Math.random() * 2 - 1) * env
    }
    return buf
  }

  _tone(freqStart, freqEnd, duration, gain = 0.15, type = 'sine') {
    const ctx = this._ensure()
    if (!ctx) return
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freqStart, t)
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(0.01, freqEnd), t + duration)
    }
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(gain, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, t + duration)
    osc.connect(g).connect(this.masterGain)
    osc.start(t)
    osc.stop(t + duration + 0.02)
  }

  // ============================================
  // Ses efektleri
  // ============================================

  playClick() {
    const ctx = this._ensure()
    if (!ctx) return
    this._tone(700, 200, 0.06, 0.08, 'square')
  }

  // Çark dönüş boyunca çivilerin tıkırtısı
  playPegTick() {
    const ctx = this._ensure()
    if (!ctx) return
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1600, t)
    osc.frequency.exponentialRampToValueAtTime(500, t + 0.025)
    g.gain.setValueAtTime(0.05, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.035)
    osc.connect(g).connect(this.masterGain)
    osc.start(t)
    osc.stop(t + 0.045)
  }

  // Spin başladığında whoosh + çivi tıkırtıları planla
  startSpinSound() {
    this.stopSpinSound()
    const ctx = this._ensure()
    if (!ctx) return

    // Whoosh (filtrelenmiş noise, alçalan pitch)
    const t = ctx.currentTime
    const dur = 3.8
    const buf = this._noiseBuffer(ctx, dur, (x) => {
      // Fade in + slow fade out
      if (x < 0.05) return x / 0.05
      return 1 - Math.pow(x, 0.5)
    })
    const src = ctx.createBufferSource()
    src.buffer = buf
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 2
    bp.frequency.setValueAtTime(700, t)
    bp.frequency.exponentialRampToValueAtTime(180, t + dur)
    const g = ctx.createGain()
    g.gain.value = 0.04
    src.connect(bp).connect(g).connect(this.masterGain)
    src.start(t)
    src.stop(t + dur + 0.05)

    // Çivi tıkırtıları - cubic ease-out yörüngesine göre
    const pegCount = 55
    for (let i = 0; i < pegCount; i++) {
      const nt = i / pegCount
      // 1 - (1-t)^2.8 → hızlı başlangıç, yavaş bitiş
      const eased = 1 - Math.pow(1 - nt, 2.8)
      const timeMs = eased * 3900
      const id = setTimeout(() => this.playPegTick(), timeMs)
      this._activeSpinTicks.push(id)
    }
  }

  stopSpinSound() {
    this._activeSpinTicks.forEach((id) => clearTimeout(id))
    this._activeSpinTicks = []
  }

  // Çark durunca derin thud
  playLand() {
    const ctx = this._ensure()
    if (!ctx) return
    const t = ctx.currentTime
    // Bas thud
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(200, t)
    osc.frequency.exponentialRampToValueAtTime(65, t + 0.3)
    g.gain.setValueAtTime(0.3, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    osc.connect(g).connect(this.masterGain)
    osc.start(t)
    osc.stop(t + 0.45)
    // Kısa impact noise
    const buf = this._noiseBuffer(ctx, 0.15, (x) => Math.pow(1 - x, 2))
    const src = ctx.createBufferSource()
    src.buffer = buf
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 400
    const ng = ctx.createGain()
    ng.gain.value = 0.18
    src.connect(lp).connect(ng).connect(this.masterGain)
    src.start(t)
    src.stop(t + 0.2)
  }

  // Şimşek (renk dilim vurulunca)
  playThunder() {
    const ctx = this._ensure()
    if (!ctx) return
    const t = ctx.currentTime
    // Sharp crack: highpass noise with fast attack
    const dur = 0.5
    const buf = this._noiseBuffer(ctx, dur, (x) => {
      if (x < 0.03) return x / 0.03
      return Math.pow(1 - (x - 0.03) / 0.97, 1.5)
    })
    const src = ctx.createBufferSource()
    src.buffer = buf
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 300
    const g = ctx.createGain()
    g.gain.value = 0.35
    src.connect(hp).connect(g).connect(this.masterGain)
    src.start(t)
    src.stop(t + dur + 0.05)
    // Alt oktavda kısa gürleme (bas)
    const boom = ctx.createOscillator()
    const bg = ctx.createGain()
    boom.type = 'sine'
    boom.frequency.setValueAtTime(80, t)
    boom.frequency.exponentialRampToValueAtTime(40, t + 0.3)
    bg.gain.setValueAtTime(0.25, t + 0.02)
    bg.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
    boom.connect(bg).connect(this.masterGain)
    boom.start(t)
    boom.stop(t + 0.4)
  }

  // Blok kırılma
  playCrash() {
    const ctx = this._ensure()
    if (!ctx) return
    const t = ctx.currentTime
    const buf = this._noiseBuffer(ctx, 0.3, (x) => Math.pow(1 - x, 1.8))
    const src = ctx.createBufferSource()
    src.buffer = buf
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 1400
    bp.Q.value = 1.2
    const g = ctx.createGain()
    g.gain.value = 0.22
    src.connect(bp).connect(g).connect(this.masterGain)
    src.start(t)
    src.stop(t + 0.35)
  }

  // Yıldız / ok topla - kısa çan
  playPling() {
    const ctx = this._ensure()
    if (!ctx) return
    const t = ctx.currentTime
    ;[1400, 2100].forEach((f, i) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      g.gain.setValueAtTime(0.14 * (i === 0 ? 1 : 0.5), t)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
      osc.connect(g).connect(this.masterGain)
      osc.start(t)
      osc.stop(t + 0.45)
    })
  }

  // Coin / anında kazanç - 2 nota ascending
  playCoin() {
    const ctx = this._ensure()
    if (!ctx) return
    const t = ctx.currentTime
    ;[880, 1320, 1760].forEach((f, i) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = f
      const st = t + i * 0.05
      g.gain.setValueAtTime(0, st)
      g.gain.linearRampToValueAtTime(0.14, st + 0.015)
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.25)
      osc.connect(g).connect(this.masterGain)
      osc.start(st)
      osc.stop(st + 0.3)
    })
  }

  // Barem tamamlandı - ascending arpeggio
  playWin() {
    const ctx = this._ensure()
    if (!ctx) return
    const t = ctx.currentTime
    // C E G C (C majör arpej)
    ;[523, 659, 784, 1047].forEach((f, i) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = f
      const st = t + i * 0.07
      g.gain.setValueAtTime(0, st)
      g.gain.linearRampToValueAtTime(0.18, st + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.5)
      osc.connect(g).connect(this.masterGain)
      osc.start(st)
      osc.stop(st + 0.55)
    })
  }

  // Jackpot - üç akor + bas gürleme
  playJackpot() {
    const ctx = this._ensure()
    if (!ctx) return
    const t = ctx.currentTime
    const chords = [
      [523, 659, 784, 1047], // C E G C
      [587, 740, 880, 1175], // D F# A D
      [659, 831, 988, 1319], // E G# B E
    ]
    chords.forEach((chord, ci) => {
      chord.forEach((f) => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.value = f
        const st = t + ci * 0.18
        g.gain.setValueAtTime(0, st)
        g.gain.linearRampToValueAtTime(0.09, st + 0.02)
        g.gain.setValueAtTime(0.09, st + 0.3)
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.65)
        osc.connect(g).connect(this.masterGain)
        osc.start(st)
        osc.stop(st + 0.7)
      })
    })
    // Bas C
    const bass = ctx.createOscillator()
    const bg = ctx.createGain()
    bass.type = 'sine'
    bass.frequency.value = 130.8
    bg.gain.setValueAtTime(0.28, t)
    bg.gain.exponentialRampToValueAtTime(0.001, t + 1.3)
    bass.connect(bg).connect(this.masterGain)
    bass.start(t)
    bass.stop(t + 1.35)
  }

  // Hediye - kısa fanfar
  playGift() {
    const ctx = this._ensure()
    if (!ctx) return
    const t = ctx.currentTime
    ;[659, 784, 988].forEach((f, i) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = f
      const st = t + i * 0.055
      g.gain.setValueAtTime(0, st)
      g.gain.linearRampToValueAtTime(0.14, st + 0.015)
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.35)
      osc.connect(g).connect(this.masterGain)
      osc.start(st)
      osc.stop(st + 0.4)
    })
  }
}

export const sounds = new SoundManager()
