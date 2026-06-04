'use client'

import { useEffect, useState } from 'react'
import { SITE_CONFIG } from '@/lib/config'
import VideoPlayer from '@/components/VideoPlayer'
import TikTokEmbed from '@/components/TikTokEmbed'
import LeadCaptureForm from '@/components/LeadCaptureForm'

// ── Comentarios estilo Facebook ────────────────────────────────────────────
const COMMENTS = [
  {
    name: 'Santiago Lopez',
    loc: 'Ciudad de México',
    text: 'Llevo 12.567 dólares facturados en 4 meses. Todavía no me la creo. Tengo 27 años y estoy muy agradecido con Santi y su equipo.',
    likes: 12,
    time: '2 d',
  },
  {
    name: 'Sofia Cadavid',
    loc: 'Lima, Perú',
    text: 'Te conocí en el evento de marketing en Lima, estabas con tu socio, te admiro un montón y obvio ya estoy adentro de Magneto. 🙌',
    likes: 23,
    time: '12 min',
  },
  {
    name: 'Jorge Gonzalez',
    loc: 'Colombia',
    text: 'Muy interesante todo lo que estamos viviendo con el comercio electrónico y que se ven las ganancias realmente. Estoy listo para aprovechar esta oportunidad…',
    likes: 2,
    time: '23 min',
  },
  {
    name: 'Sara Martinez',
    loc: 'Venezuela',
    text: 'Sigo trabajando en una empresa de repuestos pero el otro mes me voy a retirar para enfocarme 100% en esto…',
    likes: 10,
    time: '1 h',
  },
  {
    name: 'Juan H.',
    loc: 'Argentina',
    text: 'Estoy ahorrando el 20% de lo que me gano con la idea de llegar al 40% para pagar la cuota inicial de un departamento propio. No tengo sino agradecimientos para Santi y su equipo. 🔥',
    likes: 43,
    time: '3 h',
  },
  {
    name: 'Fabiana M.',
    loc: 'Bogotá, Colombia',
    text: 'Estoy feliz con todo lo que he aprendido en Magneto. Que chimba todo esto del comercio electrónico. Saludos desde Bogotá 🫶',
    likes: 31,
    time: '1 d',
  },
  {
    name: 'Jonathan Florez',
    loc: 'Quito, Ecuador',
    text: 'Tengo 33 años y quiero darles las gracias por revelar esto al público. Es increíble cómo muchas veces estamos ciegos ante las oportunidades…',
    likes: 12,
    time: '1 d',
  },
  {
    name: 'Ana Paula',
    loc: 'Brasil',
    text: 'Definitivamente el mejor mentor y el mejor equipo. Llevo 2 meses y ya he logrado 2.654 dólares. Gracias gracias gracias 🙏🏽',
    likes: 67,
    time: '3 d',
  },
]

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function Comment({ c }: { c: (typeof COMMENTS)[0] }) {
  const [liked, setLiked] = useState(false)
  return (
    <div className="flex gap-3 py-4">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">
        {initials(c.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-[#1c1c1c] rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="font-bold text-sm text-white">{c.name}</p>
          <p className="text-gray-500 text-xs mb-1">{c.loc}</p>
          <p className="text-gray-300 text-sm leading-relaxed">{c.text}</p>
        </div>
        <div className="flex items-center gap-4 mt-1 pl-3">
          <button
            onClick={() => setLiked(l => !l)}
            className={`text-xs font-semibold transition-colors ${liked ? 'text-brand-orange' : 'text-gray-600 hover:text-gray-400'}`}
          >
            Me gusta
          </button>
          <span className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer">Responder</span>
          <span className="text-xs text-gray-700">{c.time}</span>
          <span className="flex items-center gap-1 text-xs text-gray-700">
            <span className="w-4 h-4 rounded-full bg-brand-orange/80 flex items-center justify-center text-[9px]">👍</span>
            {c.likes + (liked ? 1 : 0)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [ctaVisible, setCtaVisible] = useState(false)
  const [optinDone, setOptinDone] = useState(false)
  const [phase, setPhase] = useState<'hook' | 'class'>('hook')

  useEffect(() => {
    if (sessionStorage.getItem('magneto_optin')) setOptinDone(true)
    // CTA aparece a los 8s
    const t = setTimeout(() => setCtaVisible(true), 8000)
    return () => clearTimeout(t)
  }, [])

  function handleOptinSuccess() {
    sessionStorage.setItem('magneto_optin', '1')
    setOptinDone(true)
    setTimeout(
      () => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      200
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Nav mínimo ─────────────────────────────────────────── */}
      <header className="border-b border-white/5 px-4 py-3 flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
            <span className="text-white font-black text-sm">M</span>
          </div>
          <span className="font-black tracking-tight text-sm">MAGNETO</span>
        </div>
        <span className="text-xs text-gray-600 uppercase tracking-widest">Clase gratuita</span>
      </header>

      {/* ── Contenido ──────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-12">

        {/* ─── FASE 1: HOOK TIKTOK ─────────────────────────────── */}
        <section className="space-y-5">
          {/* Etiqueta de capítulo */}
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange text-xs font-bold">
              1
            </span>
            <span className="text-xs uppercase tracking-widest text-gray-500">Antes de entrar</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black leading-snug">
            Mira este video de{' '}
            <span className="text-brand-orange">30 segundos</span>
            {' '}antes de ver la clase.
          </h1>

          <p className="text-gray-500 text-sm leading-relaxed">
            Hay un patrón que las marcas más exitosas del mundo llevan décadas usando.
            Magneto lo convirtió en una herramienta que cualquiera puede usar hoy.
          </p>

          {/* TikTok embed */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <TikTokEmbed
                url={SITE_CONFIG.tiktokUrl}
                videoId={SITE_CONFIG.tiktokVideoId || undefined}
              />
            </div>
          </div>

          {/* Bridge */}
          <div className="bg-white/3 border border-white/10 rounded-2xl p-5 text-center space-y-2">
            <p className="text-sm text-gray-400">
              ¿Ves el patrón? <span className="text-white font-semibold">Eso es exactamente lo que vas a aprender.</span>
            </p>
            <p className="text-xs text-gray-600">
              Mil novecientos millones de bebidas al día no es suerte. Es sistema.
            </p>
          </div>
        </section>

        {/* Separador de capítulos */}
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-white/5" />
          <span className="mx-4 text-xs text-gray-700 uppercase tracking-widest">continúa</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* ─── FASE 2: CLASE YOUTUBE ───────────────────────────── */}
        <section className="space-y-5">
          {/* Etiqueta de capítulo */}
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange text-xs font-bold">
              2
            </span>
            <span className="text-xs uppercase tracking-widest text-gray-500">La clase completa</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black leading-snug">
            Ahora mira cómo aplicar esto{' '}
            <span className="text-brand-orange">paso a paso.</span>
          </h2>

          <p className="text-gray-500 text-sm leading-relaxed">
            En este video te explico todo en detalle. Quédate hasta el final.
            No te vas a arrepentir.
          </p>

          {/* Hint de timestamp */}
          <div className="inline-flex items-center gap-2 bg-brand-orange/8 border border-brand-orange/20 text-brand-orange/80 text-xs px-4 py-2 rounded-full">
            ⏱ Minuto 21:00 — ahí empieza la parte más importante
          </div>

          {/* YouTube video */}
          <VideoPlayer />

          <p className="text-gray-700 text-xs text-center">
            🔇 Sube el volumen · Mira en pantalla completa
          </p>
        </section>

        {/* ─── CTA (aparece a los 8s) ──────────────────────────── */}
        <div
          id="cta"
          className={`space-y-4 transition-all duration-700 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          }`}
        >
          {!optinDone ? (
            <div className="border border-white/10 rounded-2xl p-6 space-y-4 text-center">
              <p className="text-sm text-gray-400">
                ¿Quieres aplicar esto en tu negocio?<br />
                <span className="text-white font-semibold">Déjame tus datos y te explico el siguiente paso.</span>
              </p>
              <LeadCaptureForm onSuccess={handleOptinSuccess} />
            </div>
          ) : (
            <div className="text-center space-y-3">
              <a
                href={SITE_CONFIG.hotmartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-5 rounded-xl bg-gradient-brand text-white
                           font-black text-lg uppercase tracking-wide glow-button text-center"
              >
                {SITE_CONFIG.ctaButtonText}
              </a>
              <p className="text-gray-600 text-xs">{SITE_CONFIG.ctaGuarantee}</p>
            </div>
          )}
        </div>

        {/* Separador */}
        <div className="h-px bg-white/5" />

        {/* ─── COMENTARIOS ─────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-400">
              {COMMENTS.length} comentarios
            </p>
            <span className="text-xs text-gray-700">más relevantes ▾</span>
          </div>

          <div className="divide-y divide-white/5">
            {COMMENTS.map((c, i) => (
              <Comment key={i} c={c} />
            ))}
          </div>

          <p className="text-xs text-gray-700 text-center mt-4">
            Debes iniciar sesión para dejar un comentario.
          </p>
        </section>

        {/* ─── CTA FINAL ───────────────────────────────────────── */}
        {optinDone && (
          <div className="text-center space-y-3 pb-6">
            <a
              href={SITE_CONFIG.hotmartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-5 rounded-xl bg-gradient-brand text-white
                         font-black text-lg uppercase tracking-wide glow-button text-center"
            >
              {SITE_CONFIG.ctaButtonText}
            </a>
          </div>
        )}

      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="py-6 px-4 border-t border-white/5 text-center space-y-1">
        <p className="text-gray-700 text-xs">Copyright {new Date().getFullYear()} – Magneto</p>
        <p className="text-gray-800 text-[11px] max-w-lg mx-auto leading-relaxed">
          NOT FACEBOOK: This site is not a part of the Facebook website or Facebook Inc.
          FACEBOOK is a trademark of FACEBOOK, Inc. Los resultados individuales pueden variar.
        </p>
      </footer>

    </main>
  )
}
