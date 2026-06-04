'use client'

import { useEffect, useRef, useState } from 'react'
import { SITE_CONFIG } from '@/lib/config'
import VideoPlayer from '@/components/VideoPlayer'
import LeadCaptureForm from '@/components/LeadCaptureForm'
import CountdownTimer from '@/components/CountdownTimer'

// ── Hooks ──────────────────────────────────────────────────────────────────

function useScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setP(max > 0 ? (window.scrollY / max) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return p
}

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ── Chapter wrapper ────────────────────────────────────────────────────────

function Beat({
  children,
  id,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  id?: string
  delay?: number
  className?: string
}) {
  const { ref, visible } = useReveal()
  return (
    <div
      id={id}
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
    >
      {children}
    </div>
  )
}

function Divider() {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className="flex items-center justify-center my-6">
      <div
        className={`h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000 ${
          visible ? 'w-full opacity-100' : 'w-0 opacity-0'
        }`}
      />
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  const progress = useScrollProgress()
  const [optinDone, setOptinDone] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('magneto_optin')) setOptinDone(true)
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
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden">

      {/* ── Progress bar ─────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-brand-orange to-brand-red transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-[680px] mx-auto px-6 pb-32 pt-20 space-y-28">

        {/* ── 1. HOOK ──────────────────────────────────────────────── */}
        <section className="space-y-5 pt-10">
          <Beat delay={0}>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
              Antes de que cierres esta página
            </p>
          </Beat>
          <Beat delay={100}>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              Ya has estado en el lugar de ese payaso.
            </h1>
          </Beat>
          <Beat delay={200}>
            <p className="text-5xl md:text-7xl font-black text-gradient leading-none">Yo también.</p>
          </Beat>
        </section>

        <Divider />

        {/* ── 2. LO QUE NADIE MENCIONA ─────────────────────────────── */}
        <Beat>
          <div className="space-y-6">
            <p className="text-xl text-gray-400 leading-relaxed">
              Al fin y al cabo, es exactamente lo que todo gurú enseña, ¿verdad?
            </p>
            <p className="text-2xl md:text-3xl font-black">
              Pero te voy a decir lo que nadie menciona.
            </p>
            <div className="space-y-2 text-gray-500 text-lg mt-6">
              <p>No era el gancho.</p>
              <p>No era el creativo.</p>
              <p>No era la tipografía.</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white mt-4 leading-snug border-l-4 border-brand-orange pl-5">
              Era que tu página pedía atención sin haberla conquistado nunca.
            </p>
          </div>
        </Beat>

        <Divider />

        {/* ── 3. LA DIFERENCIA ─────────────────────────────────────── */}
        <Beat>
          <div className="space-y-4">
            <p className="text-gray-500 text-lg">Existe una diferencia brutal entre</p>
            <p className="text-3xl md:text-4xl font-black">intentar atrapar a alguien</p>
            <p className="text-gray-600 text-2xl">y</p>
            <p className="text-3xl md:text-4xl font-black text-gradient">
              hacer que esa persona quiera quedarse.
            </p>
            <p className="text-gray-400 text-lg pt-4">Y acabas de vivir esta diferencia.</p>
          </div>
        </Beat>

        <Divider />

        {/* ── 4. QUÉ TE ATRAPÓ ─────────────────────────────────────── */}
        <Beat>
          <div className="space-y-6">
            <p className="text-gray-400 text-lg">
              Si llegaste hasta aquí es porque algo te atrapó.
            </p>
            <p className="text-2xl font-bold">
              Y te voy a decir exactamente qué fue.
            </p>
            <div className="space-y-3 text-gray-600 text-xl mt-6">
              <p>No fue la novedad.</p>
              <p>No fue el diseño.</p>
              <p>No fue el texto bonito.</p>
            </div>
            <div className="bg-white/3 border border-white/10 rounded-2xl p-8 mt-8">
              <p className="text-2xl md:text-3xl font-black leading-snug">
                Fue que tu cerebro no logró predecir lo que venía a continuación.
              </p>
            </div>
            <p className="text-brand-orange font-bold text-sm uppercase tracking-widest">
              Eso tiene un nombre: interrupción de patrón.
            </p>
          </div>
        </Beat>

        <Divider />

        {/* ── 5. LOS 0.3 SEGUNDOS ──────────────────────────────────── */}
        <Beat>
          <div className="space-y-6">
            <p className="text-lg text-gray-400 leading-relaxed">
              Cuando entras a una landing page común, tu cerebro tarda exactamente
            </p>
            <div className="text-center py-8">
              <p className="text-8xl md:text-[10rem] font-black text-gradient leading-none">0.3s</p>
              <p className="text-gray-500 mt-2">en clasificarla.</p>
            </div>
            <div className="space-y-2 font-mono text-base text-gray-600">
              <p>&ldquo;Ya visto.&rdquo;</p>
              <p>&ldquo;Vendedor de cursos.&rdquo;</p>
              <p className="text-brand-red">&ldquo;Cierra la pestaña.&rdquo;</p>
            </div>
            <p className="text-2xl font-black mt-4">Y la cierras.</p>
          </div>
        </Beat>

        <Divider />

        {/* ── 6. NO ERA UNA LANDING PAGE ───────────────────────────── */}
        <Beat>
          <div className="space-y-4">
            <p className="text-3xl md:text-4xl font-black leading-tight">
              Pero esto de aquí no era una landing page.
            </p>
            <p className="text-4xl md:text-5xl font-black text-gradient">Era una experiencia.</p>
            <p className="text-gray-400 text-lg mt-6 leading-relaxed">
              Y tu cerebro — ese órgano adicto a resolver misterios — se negó a irse.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              Porque cada paso te llevó a algo que no esperabas.
              No sabías lo que venía. Querías saber. Avanzaste.
            </p>
          </div>
        </Beat>

        <Divider />

        {/* ── 7. EL MECANISMO ──────────────────────────────────────── */}
        <Beat>
          <div className="border-gradient rounded-2xl p-8 space-y-6">
            <p className="text-xs uppercase tracking-widest text-gray-500">El mecanismo</p>
            <p className="text-xl text-gray-300 leading-relaxed">
              Es usar la estructura psicológica que ya existe en ti —
            </p>
            <div className="space-y-4 mt-2">
              {[
                ['01', 'Progresión'],
                ['02', 'Curiosidad'],
                ['03', 'Recompensa'],
              ].map(([n, label]) => (
                <div key={n} className="flex items-center gap-4">
                  <span className="text-brand-orange font-mono text-sm">{n}</span>
                  <span className="text-2xl font-black">{label}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed">
              — para guiarte por una experiencia donde, sin darte cuenta,{' '}
              <span className="text-white font-bold">fuiste educado. Contextualizado.
              Tu nivel de conciencia subió. El problema se volvió claro.</span>
            </p>
          </div>
          <p className="mt-8 text-2xl font-black text-gradient leading-snug">
            Y cuando llegues a la oferta, ya no eres el mismo lead que entró.
          </p>
          <p className="mt-3 text-xl text-gray-300">
            Eres alguien que entiende por qué necesita esto.
          </p>
        </Beat>

        <Divider />

        {/* ── 8. VIDEO ─────────────────────────────────────────────── */}
        <Beat>
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <p className="text-xs uppercase tracking-widest text-gray-500">
                El sistema completo
              </p>
              <h2 className="text-3xl md:text-4xl font-black">
                Míralo completo. De principio a fin.
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Lo que viene en este video es el mapa exacto.<br />
                Cada minuto importa.
              </p>
              <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-sm px-4 py-2 rounded-full">
                ⏱ Minuto 21:00 — ahí empieza lo más importante
              </div>
            </div>
            <VideoPlayer />
          </div>
        </Beat>

        <Divider />

        {/* ── 9. ¿POR QUÉ NO VENDES? ───────────────────────────────── */}
        <Beat>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black">¿Sabes por qué no vendes?</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              O a veces hasta vendes, pero tu ROI no llega ni a 1.5.
              O peor aún: <span className="text-white font-bold">pagaste para trabajar.</span>
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              Pensando que el problema es el anuncio, el creativo, el pixel,
              la plataforma, el tráfico, el gestor…
            </p>
            <div className="py-6 border-y border-white/10">
              <p className="text-2xl md:text-3xl font-black text-brand-red leading-snug">
                El problema es que estás haciendo exactamente lo que todo el mundo hace.
              </p>
            </div>
            <p className="text-gray-500 text-lg font-bold">
              Está saturado, hermano.
            </p>
          </div>
        </Beat>

        <Divider />

        {/* ── 10. LA PAYASADA ──────────────────────────────────────── */}
        <Beat>
          <div className="space-y-5 text-gray-500 text-lg">
            <p>Esa VSL trillada.</p>
            <p>Ese quiz ridículo que todo el mundo sabe que es falso.</p>
            <p className="text-gray-400 font-bold">El lead entra y sale en dos segundos.</p>
          </div>
          <div className="mt-8 space-y-2 text-gray-600">
            <p>Contador regresivo.</p>
            <p>Oferta falsa.</p>
            <p>Descuento parpadeando en la pantalla.</p>
            <p>Bonus 1. Bonus 2. Bonus 3.</p>
          </div>
          <p className="mt-8 text-2xl md:text-3xl font-black text-gradient">
            El 2018 llamó pidiendo que le devuelvan esa payasada.
          </p>
        </Beat>

        <Divider />

        {/* ── 11. LA VERDAD ────────────────────────────────────────── */}
        <Beat>
          <div className="space-y-5">
            <p className="text-xl font-bold text-brand-red">No vendes porque eres predecible.</p>
            <p className="text-xl font-bold text-brand-red">No vendes porque eres genérico.</p>
            <p className="text-xl font-bold text-brand-red leading-relaxed">
              No vendes porque lanzas siempre la misma estructura que el mercado ya se sabe de memoria.
            </p>
          </div>
          <div className="mt-12 space-y-5 text-2xl md:text-3xl font-black text-gray-300">
            <p>Hoy no es una página bonita.</p>
            <p>No es un quiz.</p>
            <p>No es una VSL motivacional.</p>
          </div>
          <p className="mt-10 text-4xl md:text-5xl font-black text-gradient leading-tight">
            Hoy lo que vende es experiencia.
          </p>
        </Beat>

        <Divider />

        {/* ── 12. MOMENTO META ─────────────────────────────────────── */}
        <Beat>
          <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-8 space-y-4">
            <p className="text-2xl font-black">¿Crees que esto es una exageración?</p>
            <p className="text-gray-400 text-lg font-bold">Mira lo que acaba de pasar contigo.</p>
            <p className="text-gray-500">¿Crees que caíste aquí por casualidad?</p>
            <p className="text-gray-500">¿Crees que te quedaste por tu propia voluntad?</p>
            <p className="text-white font-black text-2xl mt-4">No.</p>
            <p className="text-gray-300 leading-relaxed">
              Te quedaste porque todo esto fue milimétricamente calculado para retenerte.
            </p>
          </div>
        </Beat>

        <Divider />

        {/* ── 13. ATENCIÓN ─────────────────────────────────────────── */}
        <Beat>
          <div className="space-y-6">
            <p className="text-gray-400 text-lg">
              Primero conquistamos el mayor activo del mercado:
            </p>
            <p className="text-6xl md:text-8xl font-black text-gradient">la atención.</p>
            <p className="text-gray-400 text-lg leading-relaxed">
              Después te mantenemos tan hipnotizado, tan atrapado, tan adicto…
              que ni siquiera te das cuenta del tiempo que pasa.
            </p>
            <p className="text-gray-300 text-xl font-bold leading-relaxed">
              Estás tan dentro de la narrativa, tan inmerso, tan parte de la historia…
              que cuando presento mi producto, no parece venta.
            </p>
            <div className="space-y-2 text-gray-600 font-mono text-sm">
              <p>No suena a venta.</p>
              <p>No huele a venta.</p>
            </div>
            <p className="text-xl font-bold text-white">
              Es solo la continuación natural de lo que ya quieres ver.
            </p>
          </div>
        </Beat>

        <Divider />

        {/* ── 14. TRES COMANDOS ────────────────────────────────────── */}
        <Beat>
          <div className="space-y-6">
            <p className="text-gray-400 text-lg">¿Y quieres saber la parte más aterradora?</p>
            <p className="text-2xl font-bold">Nada de esto lo creé yo a mano.</p>
            <div className="text-center py-12 border-y border-white/5">
              <p className="text-[9rem] md:text-[12rem] font-black text-gradient leading-none select-none">
                3
              </p>
              <p className="text-4xl font-black -mt-4">comandos.</p>
              <p className="text-gray-600 mt-3 text-lg">Solo eso.</p>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Todo este embudo, esta estructura, esta narrativa, este impacto emocional…
              fue creado por agentes de IA entrenados para entregarte todo esto listo.
            </p>
            <p className="text-gray-300 text-lg">
              Adaptados para cualquier nicho que quieras manejar.
            </p>
            <p className="text-xl font-bold">
              Solo le di unos retoques y listo.{' '}
              <span className="text-gradient">Embudo con ROI de 10 creado.</span>
            </p>
          </div>
        </Beat>

        <Divider />

        {/* ── 15. CIERRE ───────────────────────────────────────────── */}
        <Beat>
          <div className="space-y-5">
            <p className="text-gray-400 text-lg">Y aun así… lo sentiste.</p>
            <p className="text-gray-400 text-lg">Porque la verdad es una sola:</p>
            <div className="py-10 border-y border-white/10 space-y-4 text-center">
              <p className="text-2xl md:text-3xl font-black">
                Esto no se trata de vender.
              </p>
              <p className="text-3xl md:text-4xl font-black text-gradient leading-tight">
                Se trata de hacer que el lead sienta la necesidad de comprar.
              </p>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">
              Es meterlo tanto en la historia, tan involucrado emocionalmente,
              tan atado psicológicamente… que necesite saber qué viene después.
            </p>
            <p className="text-gray-300 text-xl font-bold text-center mt-4">
              Quien controla la atención, controla la conversión.
            </p>
          </div>
        </Beat>

        <Divider />

        {/* ── 16. CTA ──────────────────────────────────────────────── */}
        <Beat id="cta">
          <div className="text-center space-y-6">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Y mira dónde estás ahora.
            </p>
            <h2 className="text-3xl md:text-4xl font-black">
              Quieres saber qué viene después.
            </h2>

            {!optinDone ? (
              <div className="space-y-4 pt-2">
                <p className="text-gray-400">
                  Deja tu información. Te mando el acceso ahora.
                </p>
                <LeadCaptureForm onSuccess={handleOptinSuccess} />
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <p className="text-gray-400">El siguiente paso está aquí.</p>
                <a
                  href={SITE_CONFIG.hotmartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full max-w-md mx-auto py-6 rounded-2xl bg-gradient-brand
                             text-white font-black text-xl uppercase tracking-wide glow-button text-center"
                >
                  {SITE_CONFIG.ctaButtonText}
                </a>
                <p className="text-gray-600 text-xs">{SITE_CONFIG.ctaGuarantee}</p>

                {SITE_CONFIG.countdownHours > 0 && (
                  <div className="pt-6 space-y-2">
                    <p className="text-gray-600 text-xs">El acceso cierra en:</p>
                    <CountdownTimer hours={SITE_CONFIG.countdownHours} />
                  </div>
                )}
              </div>
            )}
          </div>
        </Beat>

      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="py-8 px-4 border-t border-white/5 text-center">
        <p className="text-gray-700 text-xs">
          © {new Date().getFullYear()} {SITE_CONFIG.siteName}. Los resultados individuales pueden variar.
        </p>
      </footer>
    </main>
  )
}
