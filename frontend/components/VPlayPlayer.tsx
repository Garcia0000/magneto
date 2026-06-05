'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────

export interface VPlayCTA {
  triggerAt: number   // seconds
  text: string
  href: string
  color?: string
  hideAfter?: number  // seconds after appearing; 0 = permanent
}

interface VPlayPlayerProps {
  youtubeId: string
  ctas?: VPlayCTA[]
  autoplay?: boolean
  color?: string
  socialProof?: boolean
  viewerBase?: number
  trackingName?: string
  thumbnail?: string
}

// ── Helpers ─────────────────────────────────────────────────────────────────

async function postTrack(payload: Record<string, unknown>) {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    // silent
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function VPlayPlayer({
  youtubeId,
  ctas = [],
  autoplay = false,
  color = '#00d084',
  socialProof = false,
  viewerBase = 200,
  trackingName = 'main',
  thumbnail,
}: VPlayPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)          // fake timer seconds
  const [viewers, setViewers] = useState(viewerBase)
  const [activeCtas, setActiveCtas] = useState<Set<number>>(new Set())
  const [hiddenCtas, setHiddenCtas] = useState<Set<number>>(new Set())

  // Progress bar: fills in 33 minutes (1980 seconds)
  const TOTAL_SECONDS = 1980
  const progressPct = Math.min((elapsed / TOTAL_SECONDS) * 100, 100)

  const thumbUrl = thumbnail
    ?? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`

  const embedUrl =
    `https://www.youtube.com/embed/${youtubeId}` +
    `?autoplay=1&rel=0&modestbranding=1&playsinline=1&color=white`

  // ── IntersectionObserver for smart autoplay ───────────────────────────────
  useEffect(() => {
    if (!autoplay) return
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playing) {
          handlePlay()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, playing])

  // ── Fake progress timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [playing])

  // ── Social proof fluctuation ─────────────────────────────────────────────
  useEffect(() => {
    if (!socialProof || !playing) return
    const id = setInterval(() => {
      setViewers(v => Math.max(viewerBase - 50, v + Math.floor(Math.random() * 5) - 2))
    }, 3000)
    return () => clearInterval(id)
  }, [socialProof, playing, viewerBase])

  // ── CTA triggers ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) return
    ctas.forEach((cta, idx) => {
      if (!activeCtas.has(idx) && elapsed >= cta.triggerAt) {
        setActiveCtas(prev => new Set(prev).add(idx))

        // Schedule hide
        if (cta.hideAfter && cta.hideAfter > 0) {
          const delay = cta.hideAfter * 1000
          setTimeout(() => {
            setHiddenCtas(prev => new Set(prev).add(idx))
          }, delay)
        }
      }
    })
  }, [elapsed, playing, ctas, activeCtas])

  // ── Anti-download ────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const noCtxMenu = (e: MouseEvent) => e.preventDefault()
    const noKeys = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 's' || e.key === 'u' || e.key === 'S' || e.key === 'U')
      ) {
        e.preventDefault()
      }
    }

    el.addEventListener('contextmenu', noCtxMenu)
    document.addEventListener('keydown', noKeys)
    return () => {
      el.removeEventListener('contextmenu', noCtxMenu)
      document.removeEventListener('keydown', noKeys)
    }
  }, [])

  // ── Play handler ─────────────────────────────────────────────────────────
  const handlePlay = useCallback(() => {
    if (playing) return
    setPlaying(true)
    postTrack({ event: 'play', player: trackingName })
  }, [playing, trackingName])

  const handleCtaClick = (cta: VPlayCTA) => {
    postTrack({ event: 'cta_click', player: trackingName, ctaText: cta.text, secondsWatched: elapsed })
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden select-none"
      style={{ userSelect: 'none' }}
    >
      {/* Video or Thumbnail */}
      {playing ? (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={thumbUrl}
            alt="video"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            onError={e => {
              ;(e.target as HTMLImageElement).src =
                `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
            }}
          />
          {/* Dark overlay on thumbnail */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Play button */}
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center"
            aria-label="Reproducir"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
              style={{ background: color }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9 ml-1">
                <path d="M5 3l14 9-14 9z" />
              </svg>
            </div>
          </button>
        </>
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

      {/* Progress bar (fake, 33 min) */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 pointer-events-none">
        <div
          className="h-full transition-none"
          style={{ width: `${progressPct}%`, background: color }}
        />
      </div>

      {/* Social proof badge */}
      {socialProof && playing && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white text-xs font-semibold">
            {viewers.toLocaleString()} pessoas assistindo agora
          </span>
        </div>
      )}

      {/* CTAs */}
      {ctas.map((cta, idx) => {
        const visible = activeCtas.has(idx) && !hiddenCtas.has(idx)
        if (!visible) return null
        return (
          <div
            key={idx}
            className="absolute bottom-6 left-4 right-4 z-20 animate-[fadeUp_0.5s_ease-out_forwards]"
          >
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCtaClick(cta)}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white text-base shadow-2xl tracking-wide"
              style={{
                background: cta.color ?? color,
                boxShadow: `0 4px 24px ${(cta.color ?? color)}66`,
              }}
            >
              {cta.text}
            </a>
          </div>
        )
      })}
    </div>
  )
}
