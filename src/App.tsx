import { useState } from 'react'
import lotteryTicket from '../lotteryTicket.json'
import bannerHeader from './assets/banner-header.svg'
import runners from './assets/runners.svg'
import './App.css'

const REEL_COUNT = 4

const STRIP = Array.from({ length: 40 }, (_, i) => i % 10)

const SPIN_DURATION = (2.4 + (REEL_COUNT - 1) * 0.5) * 1000

const ALL_TICKETS: string[] = lotteryTicket.lotteryNumber || []

function App() {
  const [targets, setTargets] = useState<number[]>([0, 0, 0, 0])
  const [spinning, setSpinning] = useState(false)
  const [runId, setRunId] = useState(0)
  const [drawn, setDrawn] = useState<string[]>([])

  // Tickets that haven't been drawn yet.
  const remaining = ALL_TICKETS.filter((t) => !drawn.includes(t))
  const soldOut = remaining.length === 0

  const spin = () => {
    if (spinning || soldOut) return

    const ticket = remaining[Math.floor(Math.random() * remaining.length)]
    const digits = ticket
      .split('')
      .slice(0, REEL_COUNT)
      .map((c) => parseInt(c, 10))

    setTargets(digits)
    setDrawn((prev) => [...prev, ticket])
    setSpinning(true)
    setRunId((id) => id + 1)

    window.setTimeout(() => setSpinning(false), SPIN_DURATION + 100)
  }

  const reset = () => {
    if (spinning) return
    setDrawn([])
    setRunId(0)
    setTargets([0, 0, 0, 0])
  }

  const hasSpun = runId > 0

  return (
    <main className="machine">
      <img
        className="banner"
        src={bannerHeader}
        alt="Dirgahayu RI ke-81 — Jalan Sehat RT 03 Teras"
      />
      <h1>Undian Nomor Jalan Sehat RT-03 Teras</h1>
      <p className="subtitle">Tekan tombol untuk mengundi nomor undian 4 digit</p>

      <div className="reels">
        {Array.from({ length: REEL_COUNT }).map((_, i) => (
          <div className="window" key={i}>
            <div
              key={runId}
              className={`reel r${i} ${hasSpun ? `land-${targets[i]}` : ''}`}
            >
              {STRIP.map((n, j) => (
                <div className="digit" key={j}>
                  {n}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="controls">
        <button
          className="spin-btn"
          onClick={spin}
          disabled={spinning || soldOut}
        >
          {spinning ? 'mengundi...' : soldOut ? 'HABIS' : 'SPIN'}
        </button>
        {hasSpun && !spinning && (
          <button className="reset-btn" onClick={reset}>
            Reset
          </button>
        )}
      </div>

      <p className={`result-label ${hasSpun && !spinning ? 'show' : ''}`}>
        Nomor Undian Terpilih: <strong>{targets.join('')}</strong>
      </p>

      <p className="remaining">
        Sisa nomor: {remaining.length} / {ALL_TICKETS.length}
      </p>

      {drawn.length > 0 && (
        <div className="history">
          <span className="history-title">Sudah keluar:</span>
          <ul className="history-list">
            {drawn.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      <img className="runners" src={runners} alt="" aria-hidden="true" />
    </main>
  )
}

export default App
