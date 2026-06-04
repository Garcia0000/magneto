'use client'

import { useState, useEffect, useRef } from 'react'
import { SITE_CONFIG } from '@/lib/config'
import CountdownTimer from '@/components/CountdownTimer'
import LeadCaptureForm from '@/components/LeadCaptureForm'
import VideoPlayer from '@/components/VideoPlayer'
import TestimonialsSection from '@/components/TestimonialsSection'
import FAQSection from '@/components/FAQSection'

// Pain-point bullets shown in the hero section
const PAIN_POINTS = [
  'Sientes que trabajas demasiado por muy poco resultado',
  'Ya intentaste otras cosas y ninguna funcionó como esperabas',
  'Sabes que hay algo que te falta pero nadie te lo ha explicado claro',
  'Ves a otros avanzar y no entiendes por qué a ti no te pasa lo mismo',
]

const BENEFITS = [
  {
    icon: '🎯',
    title: 'Claridad total',
    desc: 'Entenderás exactamente qué hacer, en qué orden y por qué funciona.',
  },
  {
    icon: '⚡',
    title: 'Resultados rápidos',
    desc: 'El sistema está diseñado para que veas movimiento desde los primeros pasos.',
  },
  {
    icon: '🔁',
    title: 'Repetible y escalable',
    desc: 'Una vez que lo entiendes, puedes aplicarlo una y otra vez.',
  },
]

export default function HomePage() {
  const [unlocked, setUnlocked] = useState(false)
  const [visible, setVisible] = useState(false)
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if user already opted in this session
    const done = sessionStorage.getItem('magneto_optin')
    if (done) setUnlocked(true)
    // Fade in hero
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  function handleOptinSuccess() {
    sessionStorage.setItem('magneto_optin', '1')
    setUnlocked(true)
    setTimeout(() => {
      videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)
  }

  return (
    <main className="min-h-screen bg-brand-dark overflow-x-hidden">
      {/* ── URGENCY BAR ──────────────────────────────────────── */}
      <div className="bg-gradient-brand py-2 px-4 text-center">
        <p className="text-white text-xs md:text-sm font-semibold tracking-wide">
          ⏳ Esta información no estará disponible por tiempo indefinido — actúa hoy
        </p>
      </div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className={`relative min-h-screen flex flex-col items-center justify-center px-4 py-20 transition-opacity duration-700 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#FF6B00 1px, transparent 1px), linear-gradient(90deg, #FF6B00 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #FF6B00, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl w-full text-center space-y-6">
          {/* Tagline pill */}
          <div className="inline-block">
            <span className="bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs md:text-sm font-bold px-4 py-2 rounded-full uppercase tracking-widest">
              {SITE_CONFIG.heroTagline}
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
            <span className="text-gradient">{SITE_CONFIG.heroHeadline}</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {SITE_CONFIG.heroSubheadline}
          </p>

          {/* Pain points */}
          <div className="mt-8 text-left max-w-xl mx-auto space-y-3">
            {PAIN_POINTS.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-brand-red text-lg mt-0.5 flex-shrink-0">✗</span>
                <p className="text-gray-400 text-sm md:text-base">{point}</p>
              </div>
            ))}
          </div>

          {/* CTA arrow down */}
          <div className="pt-8 flex flex-col items-center gap-2">
            <p className="text-gray-400 text-sm">
              Sigue leyendo — lo que viene abajo lo cambia todo
            </p>
            <span className="text-brand-orange text-2xl animate-bounce-soft">↓</span>
          </div>
        </div>
      </section>

      {/* ── COUNTDOWN ────────────────────────────────────────── */}
      {SITE_CONFIG.countdownHours > 0 && (
        <section className="py-10 px-4 bg-white/2 border-y border-white/5">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <p className="text-gray-400 text-sm uppercase tracking-widest">
              Tiempo restante para ver esta información
            </p>
            <CountdownTimer hours={SITE_CONFIG.countdownHours} />
          </div>
        </section>
      )}

      {/* ── TURN / AGITATION ─────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black">
            El problema no eres tú.{' '}
            <span className="text-gradient">Es el sistema que te vendieron.</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Desde pequeños nos enseñaron a seguir un camino lineal: estudia, trabaja, ahorra,
            espera. Pero ese modelo ya no funciona como antes. Y los pocos que lo saben, tienen
            acceso a una forma completamente distinta de generar resultados.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed font-medium">
            Lo que estás a punto de ver en este video es exactamente ese otro camino —{' '}
            <span className="text-gradient-gold">explicado de forma simple, sin rodeos.</span>
          </p>
        </div>
      </section>

      {/* ── OPTIN / VIDEO GATE ───────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          {!unlocked ? (
            /* ── OPT-IN WALL ── */
            <div className="border-gradient rounded-3xl p-8 md:p-12 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-brand flex items-center justify-center text-3xl">
                🔐
              </div>
              <h2 className="text-3xl md:text-4xl font-black">
                {SITE_CONFIG.optinHeadline}
              </h2>
              <p className="text-gray-400">{SITE_CONFIG.optinSubheadline}</p>
              <LeadCaptureForm onSuccess={handleOptinSuccess} />
            </div>
          ) : (
            /* ── VIDEO UNLOCKED ── */
            <div ref={videoRef} className="space-y-6 text-center">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                ✓ Video desbloqueado — míralo completo
              </div>
              <h2 className="text-3xl md:text-4xl font-black">
                {SITE_CONFIG.videoHeadline}
              </h2>
              <p className="text-gray-400">{SITE_CONFIG.videoSubheadline}</p>
              <VideoPlayer />
              <p className="text-gray-500 text-sm">
                🔇 Sube el volumen y mira en pantalla completa para la mejor experiencia
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── BENEFITS (only when unlocked) ────────────────────── */}
      {unlocked && (
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-3xl md:text-4xl font-black mb-12">
              Lo que obtienes cuando aplicas esto
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {BENEFITS.map((b, i) => (
                <div
                  key={i}
                  className="border-gradient rounded-2xl p-8 text-center space-y-4 hover:bg-white/5 transition-colors"
                >
                  <div className="text-4xl">{b.icon}</div>
                  <h3 className="text-xl font-black">{b.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      {unlocked && <TestimonialsSection />}

      {/* ── MAIN CTA ─────────────────────────────────────────── */}
      {unlocked && (
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-black">
              {SITE_CONFIG.ctaHeadline}
            </h2>
            <p className="text-gray-400 text-lg">{SITE_CONFIG.ctaSubheadline}</p>

            <a
              href={SITE_CONFIG.hotmartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full max-w-md py-6 rounded-2xl bg-gradient-brand text-white font-black text-xl uppercase tracking-wide glow-button text-center"
            >
              {SITE_CONFIG.ctaButtonText}
            </a>

            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <span>🔒</span>
              <span>{SITE_CONFIG.ctaGuarantee}</span>
            </div>

            {/* Urgency repeat */}
            {SITE_CONFIG.countdownHours > 0 && (
              <div className="pt-4">
                <p className="text-gray-500 text-sm mb-3">Oferta expira en:</p>
                <CountdownTimer hours={SITE_CONFIG.countdownHours} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────── */}
      {unlocked && <FAQSection />}

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      {unlocked && (
        <section className="py-16 px-4 bg-gradient-brand/10 border-t border-brand-orange/20">
          <div className="max-w-xl mx-auto text-center space-y-5">
            <p className="text-gray-400 text-sm uppercase tracking-widest">
              Última oportunidad
            </p>
            <h2 className="text-2xl md:text-3xl font-black">
              Las personas que actúan hoy no se arrepienten mañana.
            </h2>
            <a
              href={SITE_CONFIG.hotmartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full max-w-md py-5 rounded-2xl bg-gradient-brand text-white font-black text-lg uppercase tracking-wide glow-button text-center"
            >
              {SITE_CONFIG.ctaButtonText}
            </a>
          </div>
        </section>
      )}

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="py-8 px-4 border-t border-white/5 text-center">
        <p className="text-gray-600 text-xs">
          © {new Date().getFullYear()} {SITE_CONFIG.siteName}. Todos los derechos reservados.
        </p>
        <p className="text-gray-700 text-xs mt-1">
          Los resultados individuales pueden variar. Este sitio no garantiza resultados específicos.
        </p>
      </footer>
    </main>
  )
}
