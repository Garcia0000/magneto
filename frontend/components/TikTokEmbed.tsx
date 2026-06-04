'use client'

import { useEffect, useRef } from 'react'

interface Props {
  url: string        // full TikTok URL  https://www.tiktok.com/@user/video/ID
  videoId?: string   // optional: 7-digit+ video ID if known
}

export default function TikTokEmbed({ url, videoId }: Props) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    // Inject blockquote
    const bq = document.createElement('blockquote')
    bq.className = 'tiktok-embed'
    bq.setAttribute('cite', url)
    if (videoId) bq.setAttribute('data-video-id', videoId)
    bq.setAttribute('data-embed-from', 'oembed')
    bq.style.maxWidth = '100%'
    bq.innerHTML = '<section></section>'
    container.current.appendChild(bq)

    // Inject TikTok embed script (remove old one if exists)
    const existingScript = document.getElementById('tiktok-embed-js')
    if (existingScript) existingScript.remove()

    const script = document.createElement('script')
    script.id = 'tiktok-embed-js'
    script.src = 'https://www.tiktok.com/embed.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (container.current) container.current.innerHTML = ''
    }
  }, [url, videoId])

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* TikTok embed container */}
      <div ref={container} className="w-full max-w-sm" />

      {/* Fallback button — visible si el embed no carga */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10
                   text-white text-sm px-5 py-3 rounded-full transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5
                   2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01
                   a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34
                   6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.74a4.85 4.85 0
                   01-1-.05z"/>
        </svg>
        Ver en TikTok si no carga arriba
      </a>
    </div>
  )
}
