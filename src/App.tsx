import { useRef, useState } from 'react'
import lotteryTicket from '../lotteryTicket.json'
import './App.css'
import { COUNTDOWN_TIMMER } from './constant/constant'

const REEL_COUNT = 4
const STRIP = Array.from({ length: 40 }, (_, i) => i % 10)

// The reels spin for the whole countdown, then reveal the result one box at;
const SPIN_DURATION = COUNTDOWN_TIMMER
const REVEAL_STAGGER = 5000
const ALL_TICKETS: string[] = lotteryTicket.lotteryNumber || []

function App() {
  const [targets, setTargets] = useState<number[]>([0, 0, 0, 0])
  const [spinning, setSpinning] = useState(false)
  const [runId, setRunId] = useState(0)
  const [drawn, setDrawn] = useState<string[]>([])
  // How many reels (left→right) have STARTED landing (drives the reel spin/land
  // class) vs. have FINISHED their landing animation (drives the result).
  const [revealedCount, setRevealedCount] = useState(0)
  const [settledCount, setSettledCount] = useState(0)
  const timers = useRef<number[]>([])
  const currentTicket = useRef<string | null>(null)

  // Tickets that haven't been drawn yet.
  const remaining = ALL_TICKETS.filter((t) => !drawn.includes(t))
  const soldOut = remaining.length === 0

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }

  // Fired when a reel finishes its landing animation — reveal its digit, and
  // once the last reel has settled, record the ticket and stop the machine.
  const onReelSettled = (i: number) => {
    setSettledCount((c) => Math.max(c, i + 1))
    if (i === REEL_COUNT - 1) {
      const ticket = currentTicket.current
      if (ticket) setDrawn((prev) => [...prev, ticket])
      setSpinning(false)
    }
  }

  const spin = () => {
    if (spinning || soldOut) return

    const ticket = remaining[Math.floor(Math.random() * remaining.length)]

    const digits = ticket
      .split('')
      .slice(0, REEL_COUNT)
      .map((c) => parseInt(c, 10))

    clearTimers()
    currentTicket.current = ticket
    setTargets(digits)
    setRevealedCount(0)
    setSettledCount(0)
    setSpinning(true)
    setRunId((id) => id + 1)

    // After the countdown ends, start landing the reels one after another
    // (5s apart). Each reel's Terpilih-Terakhir digit — and the final "sudah
    // keluar" record — are driven off onReelSettled when its landing animation
    // actually finishes, so the display mirrors the reels exactly.
    const startReveal = window.setTimeout(() => {
      for (let i = 0; i < REEL_COUNT; i++) {
        const id = window.setTimeout(() => {
          setRevealedCount(i + 1)
        }, i * REVEAL_STAGGER)
        timers.current.push(id)
      }
    }, SPIN_DURATION)
    timers.current.push(startReveal)
  }

  const reset = () => {
    if (spinning) return

    clearTimers()
    currentTicket.current = null
    setDrawn([])
    setRunId(0)
    setRevealedCount(0)
    setSettledCount(0)
    setTargets([0, 0, 0, 0])
  }

  const hasSpun = runId > 0
  const drawnCount = drawn.length
  const progress = Math.round((drawnCount / ALL_TICKETS.length) * 100)

  const buttonLabel = spinning
    ? 'Mengundi…'
    : soldOut
      ? 'Habis'
      : 'Mulai Mengundi'

  return (
    <div id='page-container' style={{ height: '100px', display:"flex" }}>
      <div className="page">
        {/* header */}
        <header className="masthead">
          <span className="crest">
            <span className="crest-mark" role="img" aria-label="Logo HUT RI ke-81" />
          </span>

          <span className="flag-badge">
            <span className="flag" aria-hidden="true" />
            Dirgahayu RI ke-81 · Merdeka
          </span>

          <h1 className="title">
            Undian Doorprize <em>Jalan Sehat</em>
          </h1>

          <p className="lede">
            RT-03 Teras · pengundian nomor peserta empat digit. Setiap nomor
            hanya keluar satu kali.
          </p>
        </header>

        {/* machine card */}
        <section className="card machine-card">
          <span className="chip">undian</span>

          <div className="machine-body">
            <div className="mascot-slot">
              <div className="bubble">
                Semangat
                <br />
                Jalan Sehat!
              </div>
              <span
                className="mascot"
                role="img"
                aria-label="Maskot Jalan Sehat"
              />
            </div>

            <div className="reels-slot">
              <div className={`reels ${spinning ? 'is-spinning' : ''}`}>
                {Array.from({ length: REEL_COUNT }).map((_, i) => {
                  const landed = i < revealedCount
                  
                  const reelState = landed
                    ? `land-${targets[i]}`
                    : spinning
                      ? 'spin'
                      : ''
                  
                  return (
                    <div className="window" key={i}>
                      <div
                        key={`${runId}-${landed}`}
                        className={`reel r${i} ${reelState}`}
                        onAnimationEnd={(e) => {
                          if (e.animationName.startsWith('land')) {
                            onReelSettled(i)
                          }
                        }}
                      >
                        {STRIP.map((n, j) => (
                          <div className="digit" key={j}>
                            {n}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              <p className="hint">
                {spinning
                  ? 'Sedang mengundi nomor…'
                  : soldOut
                    ? 'Semua nomor sudah keluar'
                    : 'Tekan tombol untuk mulai mengundi'}
              </p>
            </div>
          </div>

          <div className="controls">
            <button
              className="btn btn-primary"
              onClick={spin}
              disabled={spinning || soldOut}
            >
              {spinning && <span className="spinner" aria-hidden="true" />}
              {buttonLabel}
            </button>

            <button
              className="btn btn-ghost"
              onClick={reset}
              disabled={spinning || !hasSpun}
            >
              Atur Ulang
            </button>
          </div>
        </section>

        {/* stats */}
        <section className="stats">
          <div className="card stat-card">
            <span className="stat-label">Terpilih Terakhir</span>
            <div
              className={`ticket-out ${settledCount === REEL_COUNT ? 'filled' : ''}`}
            >
              {targets.map((d, i) => (
                <span className="ticket-digit" key={i}>
                  {i < settledCount ? d : '–'}
                </span>
              ))}
            </div>
          </div>

          <div className="card stat-card">
            <div className="stat-top">
              <span className="stat-label">Sisa Nomor</span>
              <span className="stat-frac">
                {drawnCount}/{ALL_TICKETS.length}
              </span>
            </div>
            <div className="stat-big">{remaining.length}</div>
            <div className="progress">
              <span className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </section>

        {drawn.length > 0 && (
          <section className="history">
            <span className="history-title">Sudah keluar</span>
            <ul className="history-list">
              {drawn.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
        )}

        <footer className="parade" aria-hidden="true">
          <span className="pm pm-garuda" />
          <span className="pm pm-rhino" />
          <span className="pm pm-kasuari" />
        </footer>
      </div>
    </div>
    
  )
}

export default App
