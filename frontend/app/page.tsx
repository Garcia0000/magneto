'use client'

import { useState, useRef, useEffect } from 'react'
import { SITE_CONFIG } from '@/lib/config'

// ── Íconos SVG inline ──────────────────────────────────────────────────────

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-6 h-6">
    <circle cx={11} cy={11} r={8}/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const IconHeart = ({ filled }: { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" fill={filled ? '#ff2d55' : 'none'} stroke={filled ? '#ff2d55' : 'white'} strokeWidth={1.8} className="w-8 h-8">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)
const IconComment = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-8 h-8">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
)
const IconBookmark = ({ filled }: { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'white' : 'none'} stroke="white" strokeWidth={1.8} className="w-8 h-8">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
  </svg>
)
const IconShare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-8 h-8">
    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1={12} y1={2} x2={12} y2={15}/>
  </svg>
)
const IconHome = ({ active }: { active?: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? 'white' : 'none'} stroke="white" strokeWidth={active ? 0 : 1.8} className="w-6 h-6">
    {active
      ? <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>//
      : <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>
    }
  </svg>
)
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-6 h-6">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx={9} cy={7} r={4}/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
)
const IconMsgBubble = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-6 h-6">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
)
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-6 h-6">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx={12} cy={7} r={4}/>
  </svg>
)

// ── Page ───────────────────────────────────────────────────────────────────

export default function TikTokPage() {
  const [playing, setPlaying] = useState(false)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(33)
  const [saveCount, setSaveCount] = useState(9)
  const [expanded, setExpanded] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const thumbUrl = `https://img.youtube.com/vi/${SITE_CONFIG.youtubeVideoId}/maxresdefault.jpg`
  const embedUrl =
    `https://www.youtube.com/embed/${SITE_CONFIG.youtubeVideoId}` +
    `?autoplay=1&rel=0&modestbranding=1&playsinline=1&color=white`

  // Simulate progress bar after playing
  useEffect(() => {
    if (playing) {
      progressRef.current = setInterval(() => {
        setProgress(p => (p >= 100 ? 100 : p + 0.05))
      }, 100)
    }
    return () => { if (progressRef.current) clearInterval(progressRef.current) }
  }, [playing])

  function handleLike() {
    setLiked(l => !l)
    setLikeCount(n => liked ? n - 1 : n + 1)
  }
  function handleSave() {
    setSaved(s => !s)
    setSaveCount(n => saved ? n - 1 : n + 1)
  }

  const description = 'La fórmula que usó Coca-Cola para vender 1.900 millones de bebidas al día… y cómo tú puedes usar el mismo sistema 👇'

  return (
    <div className="fixed inset-0 bg-black overflow-hidden select-none">

      {/* ── VIDEO (background) ─────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        {!playing ? (
          // Thumbnail
          <img
            src={thumbUrl}
            alt="video"
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${SITE_CONFIG.youtubeVideoId}/hqdefault.jpg` }}
          />
        ) : (
          // YouTube iframe
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {/* Dark gradient bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* ── TAP TO PLAY overlay ─────────────────────────────────── */}
      {!playing && (
        <button
          onClick={() => setPlaying(true)}
          className="absolute inset-0 z-10 flex items-center justify-center"
          aria-label="Reproducir"
        >
          <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1">
              <path d="M5 3l14 9-14 9z"/>
            </svg>
          </div>
        </button>
      )}

      {/* ── TOP NAV ─────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-10 pb-3 flex items-center justify-between">
        {/* LIVE button */}
        <button className="flex items-center gap-1 border border-white/40 rounded px-2 py-0.5">
          <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
            <rect x={2} y={7} width={20} height={14} rx={2}/><path d="M16 3l-4 4-4-4"/>
          </svg>
          <span className="text-white text-xs font-bold tracking-wide">LIVE</span>
        </button>

        {/* Tabs */}
        <div className="flex items-center gap-5">
          {['Explorar', 'Siguiendo', 'Para ti'].map(tab => (
            <button key={tab} className="relative">
              <span className={`text-sm font-${tab === 'Para ti' ? 'bold' : 'normal'} ${tab === 'Para ti' ? 'text-white' : 'text-white/50'}`}>
                {tab}
              </span>
              {tab === 'Para ti' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <button className="text-white">
          <IconSearch />
        </button>
      </div>

      {/* ── CAPTION OVERLAY ─────────────────────────────────────── */}
      {!playing && (
        <div className="absolute bottom-44 left-4 z-20 pointer-events-none">
          <p className="text-white font-black text-2xl tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            PARA EL DOLOR DE CABEZA
          </p>
        </div>
      )}

      {/* ── PROGRESS BAR ────────────────────────────────────────── */}
      <div className="absolute bottom-[6.5rem] left-0 right-0 z-20 h-0.5 bg-white/20">
        <div
          className="h-full bg-white transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── RIGHT SIDEBAR ───────────────────────────────────────── */}
      <div className="absolute right-3 bottom-36 z-20 flex flex-col items-center gap-5">

        {/* Avatar + follow */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-[#1a0a0a] flex items-center justify-center">
            {/* Placeholder logo — user will provide real image */}
            <div className="w-full h-full bg-[#8B0000] flex items-center justify-center">
              <span className="text-white font-black text-xs leading-none text-center">RICH<br/>HACKERS</span>
            </div>
          </div>
          <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#ff2d55] flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>

        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <IconHeart filled={liked} />
          <span className="text-white text-xs font-semibold">{likeCount}</span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center gap-1">
          <IconComment />
          <span className="text-white text-xs font-semibold">···</span>
        </button>

        {/* Bookmark */}
        <button onClick={handleSave} className="flex flex-col items-center gap-1">
          <IconBookmark filled={saved} />
          <span className="text-white text-xs font-semibold">{saveCount}</span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1">
          <IconShare />
          <span className="text-white text-xs font-semibold">10</span>
        </button>

        {/* RICH logo spinning disc (music) */}
        <div className="w-9 h-9 rounded-full bg-[#1a1a1a] border-4 border-[#333] flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
          <div className="w-3 h-3 rounded-full bg-white" />
        </div>
      </div>

      {/* ── BOTTOM USER INFO ────────────────────────────────────── */}
      <div className="absolute bottom-[6.5rem] left-0 right-16 z-20 px-4 space-y-1">
        {/* Username + RICH logo */}
        <div className="flex items-center justify-between">
          <p className="text-white font-bold text-base">Rich Hackers Oficial</p>
          <div className="bg-[#8B0000] rounded px-1.5 py-0.5">
            <span className="text-white font-black text-[10px] tracking-wider">RICH<br/>HACKERS</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-white text-sm leading-snug">
            {expanded ? description : description.slice(0, 60) + '...'}
            {' '}
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-white/60 font-semibold text-xs"
            >
              {expanded ? 'menos' : 'más'}
            </button>
          </p>
        </div>

        {/* Music ticker */}
        <div className="flex items-center gap-1.5 mt-1">
          <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3 flex-shrink-0">
            <path d="M9 18V5l12-2v13"/><circle cx={6} cy={18} r={3}/><circle cx={18} cy={16} r={3}/>
          </svg>
          <div className="overflow-hidden">
            <p className="text-white text-xs opacity-80 whitespace-nowrap animate-[marquee_8s_linear_infinite]">
              Magneto — Rich Hackers Oficial
            </p>
          </div>
        </div>
      </div>

      {/* ── BOTTOM NAV ──────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/90 border-t border-white/10 pb-safe">
        <div className="flex items-center justify-around px-2 pt-2 pb-3">

          {/* Inicio */}
          <button className="flex flex-col items-center gap-0.5 min-w-[50px]">
            <IconHome active />
            <span className="text-white text-[10px] font-semibold">Inicio</span>
          </button>

          {/* Amigos */}
          <button className="flex flex-col items-center gap-0.5 min-w-[50px] opacity-60">
            <IconUsers />
            <span className="text-white text-[10px]">Amigos</span>
          </button>

          {/* Crear */}
          <button className="flex flex-col items-center min-w-[50px]">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-10 h-7 rounded-lg bg-[#69c9d0] translate-x-1" />
              <div className="absolute w-10 h-7 rounded-lg bg-[#ee1d52] -translate-x-1" />
              <div className="relative w-10 h-7 rounded-lg bg-white flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="black" className="w-4 h-4"><path d="M12 5v14M5 12h14"/></svg>
              </div>
            </div>
          </button>

          {/* Mensajes */}
          <button className="flex flex-col items-center gap-0.5 min-w-[50px] relative opacity-60">
            <div className="relative">
              <IconMsgBubble />
              <span className="absolute -top-1.5 -right-2.5 bg-[#ff2d55] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                29
              </span>
            </div>
            <span className="text-white text-[10px]">Mensajes</span>
          </button>

          {/* Perfil */}
          <button className="flex flex-col items-center gap-0.5 min-w-[50px] opacity-60">
            <IconUser />
            <span className="text-white text-[10px]">Perfil</span>
          </button>

        </div>
      </div>

      {/* ── CTA flotante (aparece a los 10s) ────────────────────── */}
      <FloatingCTA />

    </div>
  )
}

// CTA flotante que aparece después de 10 segundos
function FloatingCTA() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 10000)
    return () => clearTimeout(t)
  }, [])

  if (!show) return null

  return (
    <div className="absolute bottom-28 left-4 right-16 z-30 animate-[fadeUp_0.5s_ease-out_forwards]">
      <a
        href={SITE_CONFIG.hotmartUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#ff2d55] text-white font-bold text-sm shadow-[0_4px_20px_#ff2d5566]"
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M5 3l14 9-14 9z"/></svg>
        Ver clase completa gratis →
      </a>
    </div>
  )
}
