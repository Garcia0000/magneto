import { supabase } from '@/lib/supabase'

function Locked() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-gray-500 text-sm">Agrega <code className="bg-white/10 px-1 rounded">?key=tu_clave</code> a la URL.</p>
    </div>
  )
}

function Sidebar({ dashKey }: { dashKey: string }) {
  const q = `?key=${dashKey}`
  const items = [
    { label: 'Overview',  href: `/dashboard${q}` },
    { label: 'Revenue',   href: `/dashboard/revenue${q}` },
    { label: 'Intención', href: `/dashboard/intent${q}`, active: true },
    { label: 'CRM',       href: `/dashboard/crm${q}` },
  ]
  return (
    <aside className="w-56 border-r border-white/[0.07] flex-shrink-0 flex flex-col py-4 px-3 sticky top-14 h-[calc(100vh-3.5rem)]">
      <nav className="space-y-0.5">
        {items.map(n => (
          <a key={n.label} href={n.href}
            className={[
              'flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors',
              n.active ? 'bg-white/[0.09] text-white font-semibold' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]',
            ].join(' ')}>
            {n.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

// ── Donut chart (pure SVG) ────────────────────────────────────────────────────

function DonutChart({ cold, warm, hot }: { cold: number; warm: number; hot: number }) {
  const total = cold + warm + hot
  if (total === 0) return (
    <div className="w-40 h-40 rounded-full border-4 border-white/[0.06] flex items-center justify-center mx-auto">
      <p className="text-xs text-gray-600">Sin datos</p>
    </div>
  )

  const R = 70, CX = 80, CY = 80, r = 45
  const circ = 2 * Math.PI * R

  const segments = [
    { pct: cold / total, color: '#3b82f6',  label: 'Cold' },
    { pct: warm / total, color: '#f59e0b',  label: 'Warm' },
    { pct: hot  / total, color: '#ef4444',  label: 'Hot'  },
  ]

  let offset = 0
  const arcs = segments.map(s => {
    const dash    = s.pct * circ
    const gap     = circ - dash
    const rotate  = offset * 360 - 90
    offset += s.pct
    return { ...s, dash, gap, rotate }
  })

  return (
    <svg viewBox="0 0 160 160" className="w-40 h-40 mx-auto">
      {arcs.map((a, i) => (
        <circle
          key={i}
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke={a.color}
          strokeWidth={r * 0.5}
          strokeDasharray={`${a.dash} ${a.gap}`}
          strokeDashoffset={0}
          transform={`rotate(${a.rotate} ${CX} ${CY})`}
        />
      ))}
      <text x={CX} y={CY - 8} textAnchor="middle" fill="white" fontSize={22} fontWeight="900" fontFamily="sans-serif">
        {total}
      </text>
      <text x={CX} y={CY + 10} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={10} fontFamily="sans-serif">
        sesiones
      </text>
    </svg>
  )
}

// ── Score bar ─────────────────────────────────────────────────────────────────

function ScoreBar({ score, level }: { score: number; level: string }) {
  const color = level === 'hot' ? '#ef4444' : level === 'warm' ? '#f59e0b' : '#3b82f6'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }}/>
      </div>
      <span className="text-xs font-bold w-6 text-right" style={{ color }}>{score}</span>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function IntentPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }> | { key?: string }
}) {
  const params      = searchParams instanceof Promise ? await searchParams : searchParams
  const expectedKey = process.env.DASHBOARD_KEY ?? 'magneto2025'
  if (params.key !== expectedKey) return <Locked/>

  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, intent_score, intent_level, max_watch_pct, created_at, source')
    .order('created_at', { ascending: false })
    .limit(200)

  const all   = sessions ?? []
  const cold  = all.filter(s => s.intent_level === 'cold').length
  const warm  = all.filter(s => s.intent_level === 'warm').length
  const hot   = all.filter(s => s.intent_level === 'hot').length
  const total = all.length

  const avgScore = total > 0
    ? Math.round(all.reduce((s, x) => s + (x.intent_score ?? 0), 0) / total)
    : 0

  const levelColor: Record<string, string> = {
    cold: 'text-blue-400',
    warm: 'text-amber-400',
    hot:  'text-red-400',
  }
  const levelBg: Record<string, string> = {
    cold: 'bg-blue-500/10 border-blue-500/20',
    warm: 'bg-amber-500/10 border-amber-500/20',
    hot:  'bg-red-500/10 border-red-500/20',
  }
  const levelLabel: Record<string, string> = { cold: 'Frío', warm: 'Tibio', hot: 'Caliente' }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <header className="h-14 border-b border-white/[0.07] flex items-center px-6 gap-4 flex-shrink-0 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-20">
        <div className="flex items-center gap-2 mr-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[#0a0a0a] text-xs" style={{ background: '#00d084' }}>V</div>
          <span className="font-black text-base tracking-tight" style={{ color: '#00d084' }}>VPlay</span>
        </div>
        <span className="text-gray-700">/</span>
        <span className="text-sm font-semibold">Intención</span>
        <div className="flex-1"/>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#ff9500] flex items-center justify-center text-xs font-black">M</div>
      </header>

      <div className="flex flex-1 min-h-0">
        <Sidebar dashKey={expectedKey}/>

        <main className="flex-1 min-w-0 p-7 space-y-6 overflow-auto">
          <div>
            <h1 className="text-[22px] font-black tracking-tight">Motor de Intención</h1>
            <p className="text-gray-500 text-sm mt-1">Clasifica automáticamente cada visitante como Frío, Tibio o Caliente</p>
          </div>

          {/* Distribution */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5 flex flex-col items-center gap-4 col-span-1">
              <DonutChart cold={cold} warm={warm} hot={hot}/>
              <div className="w-full space-y-2">
                {[
                  { label: 'Frío',     count: cold,  color: '#3b82f6' },
                  { label: 'Tibio',    count: warm,  color: '#f59e0b' },
                  { label: 'Caliente', count: hot,   color: '#ef4444' },
                ].map(l => (
                  <div key={l.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: l.color }}/>
                      <span className="text-gray-400">{l.label}</span>
                    </div>
                    <span className="font-bold text-white">{l.count} <span className="text-gray-600 font-normal">({total > 0 ? ((l.count/total)*100).toFixed(0) : 0}%)</span></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-3 grid grid-cols-3 gap-3 content-start">
              {[
                { label: 'Score promedio',   value: avgScore,          color: '#8b5cf6', sub: 'Calidad media de atención' },
                { label: 'Sesiones calientes', value: hot,             color: '#ef4444', sub: 'Score ≥ 70' },
                { label: 'Tasa de calor',    value: total > 0 ? `${((hot/total)*100).toFixed(1)}%` : '0%', color: '#FF6B00', sub: 'Hot / Total sesiones' },
              ].map(c => (
                <div key={c.label} className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
                  <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-3">{c.label}</p>
                  <p className="text-3xl font-black" style={{ color: c.color }}>{c.value}</p>
                  <p className="text-xs text-gray-600 mt-1">{c.sub}</p>
                </div>
              ))}

              {/* Scoring breakdown */}
              <div className="col-span-3 bg-[#111] border border-white/[0.07] rounded-xl p-5">
                <h3 className="font-bold text-sm mb-4">Cómo se calcula el score</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { event: 'Vio 10% del video',    pts: '+10' },
                    { event: 'Vio 25% del video',    pts: '+15' },
                    { event: 'Vio 50% del video',    pts: '+15' },
                    { event: 'Vio 75% del video',    pts: '+20' },
                    { event: 'Vio 90% del video',    pts: '+15' },
                    { event: 'Clic en CTA',          pts: '+20' },
                    { event: 'Envió formulario',     pts: '= 100' },
                    { event: 'Cambió de pestaña',    pts: '-5 c/u' },
                  ].map(r => (
                    <div key={r.event} className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                      <span className="text-xs text-gray-500">{r.event}</span>
                      <span className={`text-xs font-bold ${r.pts.startsWith('+') ? 'text-[#00d084]' : r.pts.startsWith('-') ? 'text-red-400' : 'text-[#FF6B00]'}`}>{r.pts}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-4 text-xs text-gray-500">
                  <span><span className="text-blue-400 font-bold">Frío</span> &lt; 30</span>
                  <span><span className="text-amber-400 font-bold">Tibio</span> 30–69</span>
                  <span><span className="text-red-400 font-bold">Caliente</span> ≥ 70</span>
                </div>
              </div>
            </div>
          </div>

          {/* Session list */}
          <div className="bg-[#111] border border-white/[0.07] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.07]">
              <h2 className="font-bold text-base">Sesiones recientes</h2>
            </div>
            {all.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-gray-600 text-sm">Sin sesiones aún. Los datos aparecen cuando alguien visite la página.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {all.slice(0, 50).map((s, i) => (
                  <div key={i} className="px-6 py-3 flex items-center gap-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${levelBg[s.intent_level ?? 'cold']} ${levelColor[s.intent_level ?? 'cold']}`}>
                      {levelLabel[s.intent_level ?? 'cold']}
                    </span>
                    <div className="flex-1 min-w-0">
                      <ScoreBar score={s.intent_score ?? 0} level={s.intent_level ?? 'cold'}/>
                    </div>
                    <div className="text-xs text-gray-600 w-16 text-center">
                      {s.max_watch_pct ?? 0}% visto
                    </div>
                    <div className="text-xs text-gray-600 w-12 text-center">
                      {s.source ?? 'direct'}
                    </div>
                    <span className="text-xs text-gray-700 w-28 text-right tabular-nums flex-shrink-0">
                      {new Date(s.created_at).toLocaleString('es', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}
