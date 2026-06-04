'use client'

import { useState } from 'react'
import { SITE_CONFIG } from '@/lib/config'

export default function VideoPlayer() {
  const [started, setStarted] = useState(false)
  const embedUrl = `https://www.youtube.com/embed/${SITE_CONFIG.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1&color=white`
  const thumbUrl = `https://img.youtube.com/vi/${SITE_CONFIG.youtubeVideoId}/maxresdefault.jpg`

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className="relative w-full rounded-2xl overflow-hidden border-gradient glow-orange"
        style={{ paddingBottom: '56.25%' }}
      >
        {started ? (
          <iframe
            src={embedUrl}
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setStarted(true)}
            className="absolute inset-0 w-full h-full group"
            aria-label="Reproducir video"
          >
            {/* Thumbnail */}
            <img
              src={thumbUrl}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  `https://img.youtube.com/vi/${SITE_CONFIG.youtubeVideoId}/hqdefault.jpg`
              }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-brand flex items-center justify-center glow-button group-hover:scale-105 transition-transform">
                <svg
                  className="w-8 h-8 md:w-12 md:h-12 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {/* Watch label */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <span className="bg-black/70 text-white text-sm px-4 py-2 rounded-full">
                ▶ Ver video ahora
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
