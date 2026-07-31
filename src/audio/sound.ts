// Tiny Web-Audio sound kit — no asset files. Everything is synthesized.
// Used for the mechanical "trickle" while the reels spin and a win chime.

let ctx: AudioContext | null = null
let trickleTimer: number | null = null

function ensureCtx(): AudioContext {
  if (!ctx) {
    const AC: typeof AudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    ctx = new AC()
  }
  // Browsers start the context suspended until a user gesture resumes it.
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

// One short mechanical "tick".
function tickOnce(c: AudioContext) {
  const now = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'square'
  osc.frequency.value = 850 + Math.random() * 750
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.09, now + 0.001)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)
  osc.connect(gain).connect(c.destination)
  osc.start(now)
  osc.stop(now + 0.04)
}

// Steady, slightly irregular stream of ticks — the "trickle" while spinning.
export function startTrickle() {
  const c = ensureCtx()
  stopTrickle()
  const loop = () => {
    tickOnce(c)
    trickleTimer = window.setTimeout(loop, 55 + Math.random() * 45)
  }
  loop()
}

export function stopTrickle() {
  if (trickleTimer !== null) {
    window.clearTimeout(trickleTimer)
    trickleTimer = null
  }
}

// Little ascending arpeggio when a number is drawn.
export function playWin() {
  const c = ensureCtx()
  const now = c.currentTime
  const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    const t = now + i * 0.12
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'triangle'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.22, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38)
    osc.connect(gain).connect(c.destination)
    osc.start(t)
    osc.stop(t + 0.42)
  })
}
