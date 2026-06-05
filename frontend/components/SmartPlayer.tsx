'use client'

import { useState, useEffect, useRef } from 'react'
import { SITE_CONFIG } from '@/lib/config'

/**
 * SmartPlayer — soporta tres modos según SITE_CONFIG.videoProvider:
 *   'youtube'  → embed de YouTube con thumbnail lazy
 *   'vplay'    → iframe de VPlay (con autoplay, CTA en minuto 21)
 *   'iframe'   → cualquier iframe externo (vturb, converteai, wistia, etc.)
 */
export default function SmartPlayer({
  aspectRatio = '16/9',
  rounded = true,
  autoplay = false,
}: {
  aspectRatio?: '16/9' | '9/16' | '4/3' | '1/1'
  rounded?: boolean
  autoplay?: boolean
}) {
  const [started, setStarted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const provider = SITE_CONFIG.videoProvider

  // For VPlay / iframe: inject autoplay once mounted
  useEffect(() => {
    if ((provider === 'vplay' || provider === 'iframe') && autoplay) {
      setStarted(true)
    }
  }, [provider, autoplay])

  const paddings: Record<string, string> = {
    '16/9': '56.25%',
    '9/16': '177.78%',
    '4/3': '75%',
    '1/1': '100%',
  }

  const youtubeThumb = provider === 'youtube'
    ? `https://img.youtube.com/vi/${SITE_CONFIG.youtubeVideoId}/maxresdefault.jpg`
    : ''

  const youtubeEmbed =
    `https://www.youtube.com/embed/${SITE_CONFIG.youtubeVideoId}` +
    `?autoplay=1&rel=0&modestbranding=1&color=white&playsinline=1`

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${rounded ? 'rounded-2xl' : ''}`}
      style={{ paddingBottom: paddings[aspectRatio] }}
    >
      {/* ── YOUTUBE ─────────────────────────────────────────── */}
      {provider === 'youtube' && (
        started ? (
          <iframe
            src={youtubeEmbed}
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            onClick={() => setStarted(true)}
            className="absolute inset-0 w-full h-full group"
            aria-label="Reproducir"
          >
            <img
              src={youtubeThumb}
              alt=""
              className="w-full h-full object-cover"
              onError={e => {
                (e.target as HTMLImageElement).src =
                  `https://img.youtube.com/vi/${SITE_CONFIG.youtubeVideoId}/hqdefault.jpg`
              }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center glow-button group-hover:scale-110 transition-transform">
                <svg className="w-9 h-9 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </button>
        )
      )}

      {/* ── VPLAY ───────────────────────────────────────────── */}
      {provider === 'vplay' && (
        <iframe
          src={SITE_CONFIG.vplayEmbedUrl}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          scrolling="no"
        />
      )}

      {/* ── IFRAME GENÉRICO (converteai, vturb, wistia…) ──── */}
      {provider === 'iframe' && (
        <iframe
          src={SITE_CONFIG.iframeEmbedUrl}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          scrolling="no"
        />
      )}
    </div>
  )
}
