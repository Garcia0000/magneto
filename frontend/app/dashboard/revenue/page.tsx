import { supabase } from '@/lib/supabase'

// ── Auth helper ────────────────────────────────────────────────────────────────

function Locked() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center space-y-3 max-w-xs px-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth={2} className="w-7 h-7">
            <rect x={3} y={11} width={18} height={11} rx={2}/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </div>
        <p className="text-white font-bold">Acceso restringido</p>
        <p className="text-gray-500 text-sm">Agrega <code className="bg-white/10 px-1 rounded text-xs">?key=tu_clave</code> a la URL.</p>
      </div>
    </div>
  )
}

// ── Icons ──────────────────────────────────────────────────────────────────────

const IconDollar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <line x1={12} y1={1} x2={12} y2={23}/>
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
)
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx={9} cy={7} r={4}/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
)
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx={12} cy={12} r={3}/>
  </svg>
)
const IconFire = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10c0-1.5-.4-3-1-4.2C19.5 10 17 12 14 12c1-2.5.5-5.5-2-8z"/>
  </svg>
)
const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <circle cx={12} cy={12} r={10}/><circle cx={12} cy={12} r={6}/><circle cx={12} cy={12} r={2}/>
  </svg>
)
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

// ── Sidebar (shared across dashboard pages) ────────────────────────────────────

function Sidebar({ dashKey }: { dashKey: string }) {
  const q = `?key=${dashKey}`
  const nav = [
    { label: 'Overview',   href: `/dashboard${q}`,           icon: 'grid' },
    { label: 'Revenue',    href: `/dashboard/revenue${q}`,   icon: 'dollar', active: true },
    { label: 'Intención',  href: `/dashboard/intent${q}`,    icon: 'fire' },
    { label: 'CRM',        href: `/dashboard/crm${q}`,       icon: 'target' },
    { label: 'Analytics',  href: `/dashboard${q}&view=analytics`, icon: 'bar' },
  ]
  return (
    <aside className="w-56 border-r border-white/[0.07] flex-shrink-0 flex flex-col py-4 px-3 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
      <nav className="space-y-0.5 flex-1">
        {nav.map(n => (
          <a key={n.label} href={n.href}
            className={[
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
              n.active ? 'bg-white/[0.09] text-white font-semibold' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]',
            ].join(' ')}>
            <span className="w-4 h-4 flex-shrink-0 opacity-70">
              {n.icon === 'grid'   && <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><rect x={3} y={3} width={7} height={7} rx={1}/><rect x={14} y={3} width={7} height={7} rx={1}/><rect x={3} y={14} width={7} height={7} rx={1}/><rect x={14} y={14} width={7} height={7} rx={1}/></svg>}
              {n.icon === 'dollar' && <IconDollar/>}
              {n.icon === 'fire'   && <IconFire/>}
              {n.icon === 'target' && <IconTarget/>}
              {n.icon === 'bar'    && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><line x1={18} y1={20} x2={18} y2={10}/><line x1={12} y1={20} x2={12} y2={4}/><line x1={6} y1={20} x2={6} y2={14}/></svg>}
            </span>
            {n.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

// ── Funnel Bar ─────────────────────────────────────────────────────────────────

function FunnelStep({
  label, value, pct, sublabel, color, icon, isFirst,
}: {
  label: string; value: number | string; pct?: string; sublabel?: string; color: string; icon: React.ReactNode; isFirst?: boolean
}) {
  return (
    <div className="flex items-start gap-5">
      <div className="flex flex-col items-center gap-1">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`} style={{ background: `${color}20`, color }}>
          {icon}
        </div>
        {!isFirst && <div className="w-px h-6 bg-white/[0.08]"/>}
      </div>
      <div className="flex-1 pb-6 border-b border-white/[0.06]">
        <div className="flex items-baseline justify-between gap-4 mb-2">
          <div>
            <p className="text-sm text-gray-400 font-medium">{label}</p>
            {sublabel && <p className="text-xs text-gray-600 mt-0.5">{sublabel}</p>}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-black text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
            {pct && <p className="text-xs font-semibold mt-0.5" style={{ color }}>{pct}</p>}
          </div>
        </div>
        {typeof value === 'number' && (
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: pct ? pct : '100%', background: color }}/>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function RevenuePage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }> | { key?: string }
}) {
  const params      = searchParams instanceof Promise ? await searchParams : searchParams
  const expectedKey = process.env.DASHBOARD_KEY ?? 'magneto2025'
  if (params.key !== expectedKey) return <Locked/>

  // ── Data ──────────────────────────────────────────────────────────────────

  const [
    { count: totalSessions },
    { data: attentionData },
    { data: hotSessions },
    { data: leads },
    { data: deals },
    { data: campaigns },
  ] = await Promise.all([
    supabase.from('sessions').select('*', { count: 'exact', head: true }),
    supabase.from('sessions').select('id', { count: 'exact' }).gte('max_watch_pct', 25),
    supabase.from('sessions').select('id', { count: 'exact' }).eq('intent_level', 'hot'),
    supabase.from('leads').select('id, name, contact, intent_score, ts, stage').order('ts', { ascending: false }),
    supabase.from('deals').select('value, closed_at, lead_id'),
    supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
  ])

  const visitors     = totalSessions ?? 0
  const attention    = attentionData?.length ?? 0
  const hotCount     = hotSessions?.length ?? 0
  const opportunities = leads?.length ?? 0
  const dealCount    = deals?.length ?? 0

  const totalAdSpend = campaigns?.reduce((s, c) => s + Number(c.ad_spend ?? 0), 0) ?? 0
  const totalRevenue = deals?.reduce((s, d) => s + Number(d.value ?? 0), 0) ?? 0

  const cpo = opportunities > 0 && totalAdSpend > 0 ? totalAdSpend / opportunities : 0
  const cpv = dealCount > 0 && totalAdSpend > 0 ? totalAdSpend / dealCount : 0
  const roi = totalAdSpend > 0 ? ((totalRevenue - totalAdSpend) / totalAdSpend) * 100 : 0

  const fmt = (n: number) => n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const pctOf = (n: number, total: number) => total > 0 ? `${((n / total) * 100).toFixed(1)}%` : '0%'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

      {/* Top bar */}
      <header className="h-14 border-b border-white/[0.07] flex items-center px-6 gap-4 flex-shrink-0 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-20">
        <div className="flex items-center gap-2 mr-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[#0a0a0a] text-xs" style={{ background: '#00d084' }}>V</div>
          <span className="font-black text-base tracking-tight" style={{ color: '#00d084' }}>VPlay</span>
        </div>
        <span className="text-gray-700">/</span>
        <span className="text-sm font-semibold text-white">Revenue</span>
        <div className="flex-1"/>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#ff9500] flex items-center justify-center text-xs font-black">M</div>
      </header>

      <div className="flex flex-1 min-h-0">
        <Sidebar dashKey={expectedKey}/>

        <main className="flex-1 min-w-0 p-7 space-y-6 overflow-auto">

          {/* Header */}
          <div>
            <h1 className="text-[22px] font-black tracking-tight">Revenue Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">El único número que importa: cuánto retorna tu inversión en atención</p>
          </div>

          {/* ROI Cards */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Inversión total',       value: `$${fmt(totalAdSpend)}`,  color: '#6366f1', icon: <IconDollar/> },
              { label: 'Revenue generado',      value: `$${fmt(totalRevenue)}`,  color: '#00d084', icon: <IconCheck/> },
              { label: 'Costo por oportunidad', value: cpo > 0 ? `$${fmt(cpo)}` : '—',  color: '#FF6B00', icon: <IconTarget/> },
              { label: 'ROI',                   value: totalAdSpend > 0 ? `${roi.toFixed(0)}%` : '—', color: roi >= 0 ? '#00d084' : '#ef4444', icon: <IconFire/> },
            ].map(c => (
              <div key={c.label} className="bg-[#111] rounded-xl p-5 border border-white/[0.07]">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">{c.label}</p>
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${c.color}18`, color: c.color }}>{c.icon}</span>
                </div>
                <p className="text-2xl font-black" style={{ color: c.color }}>{c.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">

            {/* Funnel */}
            <div className="bg-[#111] border border-white/[0.07] rounded-xl p-6">
              <div className="mb-6">
                <h2 className="font-bold">Embudo de Atención</h2>
                <p className="text-xs text-gray-500 mt-0.5">De visitante a venta — el camino real del dinero</p>
              </div>

              <div className="space-y-0">
                <FunnelStep isFirst label="Inversión publicitaria" value={`$${fmt(totalAdSpend)}`}
                  sublabel="Gasto total en campañas registradas" color="#6366f1" icon={<IconDollar/>}/>
                <FunnelStep label="Visitantes totales" value={visitors}
                  sublabel="Sesiones únicas detectadas" color="#3b82f6" icon={<IconUsers/>}/>
                <FunnelStep label="Prestaron atención" value={attention}
                  pct={pctOf(attention, visitors)} sublabel="Vieron más del 25% del video" color="#8b5cf6" icon={<IconEye/>}/>
                <FunnelStep label="Mostraron intención" value={hotCount}
                  pct={pctOf(hotCount, visitors)} sublabel="Score ≥70 (Hot)" color="#f59e0b" icon={<IconFire/>}/>
                <FunnelStep label="Oportunidades (leads)" value={opportunities}
                  pct={pctOf(opportunities, visitors)} sublabel="Formulario enviado" color="#FF6B00" icon={<IconTarget/>}/>
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#00d08420', color: '#00d084' }}>
                    <IconCheck/>
                  </div>
                  <div className="flex-1 pb-0">
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <div>
                        <p className="text-sm text-gray-400 font-medium">Ventas cerradas</p>
                        <p className="text-xs text-gray-600 mt-0.5">Deals confirmados manualmente</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-white">{dealCount.toLocaleString()}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: '#00d084' }}>{pctOf(dealCount, visitors)}</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: pctOf(dealCount, visitors), background: '#00d084' }}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">

              {/* Unit economics */}
              <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
                <h3 className="font-bold text-sm mb-4">Economía unitaria</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Costo por visitante',     value: visitors > 0 && totalAdSpend > 0 ? `$${fmt(totalAdSpend / visitors)}` : '—' },
                    { label: 'Costo por atención',      value: attention > 0 && totalAdSpend > 0 ? `$${fmt(totalAdSpend / attention)}` : '—' },
                    { label: 'Costo por intención',     value: hotCount > 0 && totalAdSpend > 0 ? `$${fmt(totalAdSpend / hotCount)}` : '—' },
                    { label: 'Costo por oportunidad',   value: cpo > 0 ? `$${fmt(cpo)}` : '—' },
                    { label: 'Costo por venta',         value: cpv > 0 ? `$${fmt(cpv)}` : '—' },
                    { label: 'Ticket promedio',         value: dealCount > 0 ? `$${fmt(totalRevenue / dealCount)}` : '—' },
                  ].map(r => (
                    <div key={r.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.05]">
                      <span className="text-sm text-gray-400">{r.label}</span>
                      <span className="text-sm font-bold text-white tabular-nums">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaigns */}
              <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm">Campañas</h3>
                  <a href={`/dashboard/revenue/campaign?key=${expectedKey}`}
                    className="text-xs text-[#00d084] hover:underline font-medium">+ Agregar</a>
                </div>
                {(campaigns?.length ?? 0) === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600 text-sm">Sin campañas registradas.</p>
                    <p className="text-gray-700 text-xs mt-1">Agrega tu inversión publicitaria para ver el ROI.</p>
                    <a href={`/dashboard/revenue/campaign?key=${expectedKey}`}
                      className="inline-block mt-3 px-4 py-2 rounded-lg bg-[#00d084]/10 text-[#00d084] text-xs font-semibold border border-[#00d084]/20 hover:bg-[#00d084]/20 transition-colors">
                      Registrar campaña →
                    </a>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {campaigns!.map(c => (
                      <div key={c.id} className="flex items-center justify-between py-2 border-b border-white/[0.05]">
                        <div>
                          <p className="text-sm font-medium text-white">{c.name}</p>
                          <p className="text-xs text-gray-600">{c.source} · {c.period_start ?? '—'}</p>
                        </div>
                        <p className="text-sm font-bold text-[#FF6B00]">${fmt(Number(c.ad_spend))}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent deals */}
              <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
                <h3 className="font-bold text-sm mb-4">Ventas recientes</h3>
                {(deals?.length ?? 0) === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-4">Sin ventas registradas aún.</p>
                ) : (
                  <div className="space-y-2">
                    {deals!.slice(0, 5).map((d, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5">
                        <span className="text-xs text-gray-400">{new Date(d.closed_at).toLocaleDateString('es')}</span>
                        <span className="text-sm font-bold text-[#00d084]">${fmt(Number(d.value ?? 0))}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
