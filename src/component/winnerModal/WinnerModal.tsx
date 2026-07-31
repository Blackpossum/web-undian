import { useEffect, useRef } from 'react'
import './WinnerModal.css'

interface WinnerModalProps {
  open: boolean
  number: string
  onClose: () => void
}

const CONFETTI_COLORS = ['#c0392f', '#d8a233', '#ffffff', '#8f281e', '#e0a92e']

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  size: number
  color: string
  round: boolean
}

const WinnerModal = ({ open, number, onClose }: WinnerModalProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Close on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Confetti burst on open.
  useEffect(() => {
    if (!open) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const w = () => window.innerWidth
    const h = () => window.innerHeight
    const parts: Particle[] = []

    const spawn = (n: number) => {
      for (let i = 0; i < n; i++) {
        parts.push({
          x: Math.random() * w(),
          y: -20 - Math.random() * h() * 0.4,
          vx: (Math.random() - 0.5) * 3,
          vy: 2 + Math.random() * 4,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
          size: 6 + Math.random() * 8,
          color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
          round: Math.random() < 0.4,
        })
      }
    }

    spawn(170)
    let frame = 0
    let raf = 0

    const draw = () => {
      ctx.clearRect(0, 0, w(), h())
      for (const p of parts) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.05
        p.vx *= 0.99
        p.rot += p.vr
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        if (p.round) {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        }
        ctx.restore()
      }
      for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i].y > h() + 40) parts.splice(i, 1)
      }
      frame++
      if (frame === 45) spawn(90) // a second, smaller wave
      if (parts.length > 0) {
        raf = requestAnimationFrame(draw)
      }
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      ctx.clearRect(0, 0, w(), h())
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Nomor terpilih"
    >
      <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />
      <div className="winner-modal" onClick={(e) => e.stopPropagation()}>
        <span className="winner-eyebrow">🎉 Selamat 🎉</span>
        <span className="winner-label">Nomor Terpilih</span>
        <div className="winner-number">
          {number.split('').map((d, i) => (
            <span className="winner-digit" key={i}>
              {d}
            </span>
          ))}
        </div>
        <p className="winner-hint">Klik di luar untuk menutup</p>
      </div>
    </div>
  )
}

export default WinnerModal
