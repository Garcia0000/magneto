'use client'

import { useEffect, useRef, useState } from 'react'
import { SITE_CONFIG } from '@/lib/config'
import VideoPlayer from '@/components/VideoPlayer'

// ── Comentarios (social proof exacta de la página de referencia) ───────────
const COMMENTS = [
  {
    name: 'Santiago Lopez',
    location: 'Ciudad de México',
    text: 'Santiago soy de Ciudad de México y llevo 12.567 dólares facturados en 4 meses. Todavía no me la creo. Tengo 27 años y estoy muy agradecido.',
    likes: 12,
    time: '2 d',
  },
  {
    name: 'Sofia Cadavid',
    location: 'Lima, Perú',
    text: 'Te conocí en el evento de marketing en Lima, Perú, estabas con tu socio, te admiro un montón y obvio ya estoy adentro de Magneto. 🙌',
    likes: 23,
    time: '12 min',
  },
  {
    name: 'Jorge Gonzalez',
    location: 'Colombia',
    text: 'Muy interesante todo lo que estamos viviendo con el comercio electrónico y que se ven las ganancias realmente. Estoy listo para aprovechar esta oportunidad…',
    likes: 2,
    time: '23 min',
  },
  {
    name: 'Sara Martinez',
    location: 'Venezuela',
    text: 'Agradezco el momento en el que vi tu video en redes sociales, sigo trabajando en una empresa de repuestos pero el otro mes voy a retirarme para enfocarme en el comercio electrónico…',
    likes: 10,
    time: '1 h',
  },
  {
    name: 'Juan H.',
    location: 'Argentina',
    text: 'Hola a todos, estoy ahorrando el 20% de lo que me gano aunque la idea es llegar al 40% para pagar la cuota inicial de un departamento propio, no tengo sino agradecimientos para Santi y su equipo. 🔥',
    likes: 43,
    time: '3 h',
  },
  {
    name: 'Fabiana M.',
    location: 'Bogotá, Colombia',
    text: 'Santi, estoy feliz con todo lo que he aprendido en Magneto. Que chimba todo esto del comercio electrónico. Que gran oportunidad. Saludos desde Bogotá, Colombia 🫶',
    likes: 31,
    time: '1 d',
  },
  {
    name: 'Jonathan Florez',
    location: 'Quito, Ecuador',
    text: 'Hola tengo 33 años, vivo en Quito y quiero darles las gracias por revelar esto al público, es increíble como muchas veces estamos ciegos ante las oportunidades…',
    likes: 12,
    time: '1 d',
  },
  {
    name: 'Ana Paula',
    location: 'Brasil',
    text: 'Definitivamente el mejor mentor y el mejor equipo, gracias a Dios por conocer esta oportunidad, llevo 2 meses y ya he logrado 2654 dólares, gracias gracias gracias 🙏🏽.',
    likes: 67,
    time: '3 d',
  },
]

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

// ── Comment card ───────────────────────────────────────────────────────────

function Comment({ c }: { c: typeof COMMENTS[0] }) {
  const [liked, setLiked] = useState(false)
  return (
    <div className="flex gap-3 py-4">
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">
        {initials(c.name)}
      </div>

      <div className="flex-1 min-w-0">
        {/* Bubble */}
        <div className="bg-[#1a1a1a] rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="font-bold text-sm text-white">{c.name}</p>
          <p className="text-gray-400 text-xs mb-1">{c.location}</p>
          <p className="text-gray-300 text-sm leading-relaxed">{c.text}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-1 pl-3">
          <button
            onClick={() => setLiked(l => !l)}
            className={`text-xs font-semibold transition-colors ${liked ? 'text-brand-orange' : 'text-gray-600 hover:text-gray-400'}`}
          >
            Me gusta
          </button>
          <button className="text-xs font-semibold text-gray-600 hover:text-gray-400 transition-colors">
            Responder
          </button>
          <span className="text-xs text-gray-700">{c.time}</span>
          {(c.likes + (liked ? 1 : 0)) > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-600">
              <span className="w-4 h-4 rounded-full bg-brand-orange flex items-center justify-center text-[10px]">👍</span>
              {c.likes + (liked ? 1 : 0)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [ctaVisible, setCtaVisible] = useState(false)
  const videoRef = useRef<HTMLDivElement>(null)

  // Show CTA after 5 seconds (simula que apareció al final del video)
  useEffect(() => {
    const t = setTimeout(() => setCtaVisible(true), 5000)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Subheadline gancho ──────────────────────────────────── */}
      <div className="w-full bg-[#111] border-b border-white/5 py-3 px-4 text-center">
        <p className="text-sm md:text-base font-bold text-white leading-snug">
          ¿Por qué estos jóvenes están ganando miles de dólares con solo{' '}
          <span className="text-brand-orange">3 comandos de IA</span>?{' '}
          Descúbrelo YA ⬇
        </p>
      </div>

      {/* ── Contenido central ───────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Logo / imagen del producto */}
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
              <span className="text-white font-black text-lg">M</span>
            </div>
            <span className="text-2xl font-black tracking-tight">MAGNETO</span>
          </div>
        </div>

        {/* ── Video ───────────────────────────────────────────── */}
        <div ref={videoRef}>
          <VideoPlayer />
        </div>

        {/* ── CTA button (aparece después de 5s) ──────────────── */}
        <div
          className={`text-center transition-all duration-700 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <a
            href={SITE_CONFIG.hotmartUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full max-w-lg py-5 rounded-xl bg-gradient-brand text-white
                       font-black text-lg uppercase tracking-wide glow-button text-center"
          >
            {SITE_CONFIG.ctaButtonText}
          </a>
          <p className="text-gray-600 text-xs mt-2">{SITE_CONFIG.ctaGuarantee}</p>
        </div>

        {/* ── Sección de comentarios ───────────────────────────── */}
        <div className="border border-white/5 rounded-2xl overflow-hidden">
          {/* Header tipo Facebook */}
          <div className="bg-[#111] px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-300">
              Mostrando {COMMENTS.length} comentarios
            </p>
            <span className="text-xs text-gray-600">más relevantes ▾</span>
          </div>

          <div className="bg-[#0d0d0d] px-4 divide-y divide-white/5">
            {COMMENTS.map((c, i) => (
              <Comment key={i} c={c} />
            ))}
          </div>

          {/* Footer tipo Facebook */}
          <div className="bg-[#111] px-4 py-3 border-t border-white/5 text-center">
            <p className="text-xs text-gray-600">
              Debes iniciar sesión para dejar un comentario.
            </p>
          </div>
        </div>

        {/* CTA final (abajo de los comentarios) */}
        <div className="text-center space-y-3 pb-8">
          <a
            href={SITE_CONFIG.hotmartUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full max-w-lg py-5 rounded-xl bg-gradient-brand text-white
                       font-black text-lg uppercase tracking-wide glow-button text-center"
          >
            {SITE_CONFIG.ctaButtonText}
          </a>
        </div>

      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="py-6 px-4 border-t border-white/5 text-center space-y-1">
        <p className="text-gray-700 text-xs">
          Copyright {new Date().getFullYear()} – {SITE_CONFIG.siteName}
        </p>
        <p className="text-gray-800 text-xs max-w-xl mx-auto">
          NOT FACEBOOK: This site is not a part of the Facebook website or Facebook Inc.
          Additionally, This site is NOT endorsed by Facebook in any way.
          FACEBOOK is a trademark of FACEBOOK, Inc.
        </p>
        <p className="text-gray-800 text-xs">
          Los resultados individuales pueden variar.
        </p>
      </footer>

    </main>
  )
}
