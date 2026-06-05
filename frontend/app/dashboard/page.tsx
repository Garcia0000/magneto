import { supabase } from '@/lib/supabase'

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtTime(s: number): string {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

function cutoffISO(period: string): string {
  const d = new Date()
  if (period === '7d')       d.setDate(d.getDate() - 7)
  else if (period === '30d') d.setDate(d.getDate() - 30)
  else                       d.setFullYear(2000)
  return d.toISOString()
}

async function getStats(period: string) {
  const cutoff = cutoffISO(period)

  const [
    { data: events },
    { data: leads },
    { count: totalAllTime },
  ] = await Promise.all([
    supabase.from('events').select('event, player, cta_text, seconds_watched, watch_pct, ts').gte('ts', cutoff).order('ts', { ascending: false }),
    supabase.from('leads').select('ts').gte('ts', cutoff),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('event', 'play'),
  ])

  const evts      = events ?? []
  const plays     = evts.filter(e => e.event === 'play')
  const ctaClicks = evts.filter(e => e.event === 'cta_click')
  const autoPlays = evts.filter(e => e.event === 'autoplay')

  const totalPlays = plays.length
  const totalCTA   = ctaClicks.length
  const convRate   = totalPlays > 0 ? (totalCTA / totalPlays) * 100 : 0

  const withSecs   = evts.filter(e => (e.seconds_watched ?? 0) > 0)
  const avgSeconds = withSecs.length > 0
    ? withSecs.reduce((acc, e) => acc + (e.seconds_watched ?? 0), 0) / withSecs.length
    : 0

  const completions = evts.filter(e => (e.seconds_watched ?? 0) > 1584).length

  const days = period === '30d' ? 30 : 7
  const now  = new Date()
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (days - 1 - i))
    const key   = d.toISOString().slice(0, 10)
    const label = period === '30d'
      ? d.getDate().toString()
      : d.toLocaleDateString('es', { weekday: 'short' }).replace('.', '').slice(0, 3)
    return {
      label:  label.charAt(0).toUpperCase() + label.slice(1),
      plays:  plays.filter(e => e.ts.startsWith(key)).length,
      clicks: ctaClicks.filter(e => e.ts.startsWith(key)).length,
    }
  })

  return {
    totalPlays,
    autoPlays:    autoPlays.length,
    totalCTA,
    avgTime:      fmtTime(avgSeconds),
    convRate:     convRate.toFixed(1),
    completions,
    leads:        (leads ?? []).length,
    daily,
    recentEvents: evts.slice(0, 20),
    totalAllTime: totalAllTime ?? 0,
  }
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────

const IconEye      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx={12} cy={12} r={3}/></svg>
const IconPlay     = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]"><polygon points="5 3 19 12 5 21 5 3"/></svg>
const IconZap      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
const IconCursor   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>
const IconFile     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1={16} y1={13} x2={8} y2={13}/><line x1={16} y1={17} x2={8} y2={17}/></svg>
const IconClock    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]"><circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/></svg>
const IconTarget   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]"><circle cx={12} cy={12} r={10}/><circle cx={12} cy={12} r={6}/><circle cx={12} cy={12} r={2}/></svg>
const IconCheck    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
const IconRadio    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]"><circle cx={12} cy={12} r={2}/><path d="M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14"/></svg>
const IconDollar   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><line x1={12} y1={1} x2={12} y2={23}/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
const IconFire     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10c0-1.5-.4-3-1-4.2C19.5 10 17 12 14 12c1-2.5.5-5.5-2-8z"/></svg>
const IconRefresh  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
const IconGrid     = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><rect x={3} y={3} width={7} height={7} rx={1}/><rect x={14} y={3} width={7} height={7} rx={1}/><rect x={3} y={14} width={7} height={7} rx={1}/><rect x={14} y={14} width={7} height={7} rx={1}/></svg>
const IconBarChart = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><line x1={18} y1={20} x2={18} y2={10}/><line x1={12} y1={20} x2={12} y2={4}/><line x1={6} y1={20} x2={6} y2={14}/></svg>
const IconPlus     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx={12} cy={12} r={10}/><line x1={12} y1={8} x2={12} y2={16}/><line x1={8} y1={12} x2={16} y2={12}/></svg>
const IconBell     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>

// ── Metric Card ───────────────────────────────────────────────────────────────

type CardColor = 'blue' | 'orange' | 'green' | 'gray'

function MetricCard({ label, value, icon, color = 'gray', sublabel }: {
  label: string; value: string | number; icon: React.ReactNode; color?: CardColor; sublabel?: string
}) {
  const bg: Record<CardColor,string>  = { blue:'bg-blue-500/15 text-blue-400', orange:'bg-[#FF6B00]/15 text-[#FF6B00]', green:'bg-emerald-500/15 text-emerald-400', gray:'bg-white/[0.07] text-gray-400' }
  const vc: Record<CardColor,string>  = { blue:'text-blue-400', orange:'text-[#FF6B00]', green:'text-emerald-400', gray:'text-white' }
  const bc: Record<CardColor,string>  = { blue:'border-blue-500/20', orange:'border-[#FF6B00]/25', green:'border-emerald-500/20', gray:'border-white/[0.07]' }
  return (
    <div className={`bg-[#111] rounded-xl p-5 border ${bc[color]} flex flex-col gap-4`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold leading-none">{label}</p>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${bg[color]}`}>{icon}</span>
      </div>
      <div>
        <p className={`text-[2rem] font-black leading-none ${vc[color]}`}>{value}</p>
        {sublabel && <p className="text-[11px] text-gray-600 mt-1">{sublabel}</p>}
      </div>
    </div>
  )
}

// ── Daily Chart ───────────────────────────────────────────────────────────────

function DailyChart({ daily }: { daily: { label: string; plays: number; clicks: number }[] }) {
  const W=700,H=160,PAD={t:12,r:20,b:32,l:32}
  const iW=W-PAD.l-PAD.r,iH=H-PAD.t-PAD.b,n=daily.length
  const maxVal=Math.max(...daily.map(d=>d.plays),...daily.map(d=>d.clicks),1)
  const xs=daily.map((_,i)=>PAD.l+(n===1?iW/2:(i/(n-1))*iW))
  const yP=daily.map(d=>PAD.t+iH-(d.plays/maxVal)*iH)
  const yC=daily.map(d=>PAD.t+iH-(d.clicks/maxVal)*iH)
  const pts=(ys:number[])=>ys.map((y,i)=>`${xs[i].toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area=(ys:number[])=>`${xs[0].toFixed(1)},${(PAD.t+iH).toFixed(1)} ${pts(ys)} ${xs[n-1].toFixed(1)},${(PAD.t+iH).toFixed(1)}`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
      <defs>
        <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/><stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/></linearGradient>
        <linearGradient id="gO" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF6B00" stopOpacity="0.25"/><stop offset="100%" stopColor="#FF6B00" stopOpacity="0"/></linearGradient>
      </defs>
      {[0,0.25,0.5,0.75,1].map((r,i)=><line key={i} x1={PAD.l} x2={W-PAD.r} y1={PAD.t+iH*r} y2={PAD.t+iH*r} stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4 4"/>)}
      <polygon points={area(yP)} fill="url(#gB)"/>
      <polyline points={pts(yP)} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"/>
      <polygon points={area(yC)} fill="url(#gO)"/>
      <polyline points={pts(yC)} fill="none" stroke="#FF6B00" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"/>
      {yP.map((y,i)=><circle key={`p${i}`} cx={xs[i]} cy={y} r={3.5} fill="#3b82f6" stroke="#111" strokeWidth={1.5}/>)}
      {yC.map((y,i)=><circle key={`c${i}`} cx={xs[i]} cy={y} r={3.5} fill="#FF6B00" stroke="#111" strokeWidth={1.5}/>)}
      {daily.map((d,i)=><text key={i} x={xs[i]} y={H-8} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={n>15?8:10} fontFamily="sans-serif">{d.label}</text>)}
    </svg>
  )
}

// ── Period Button ─────────────────────────────────────────────────────────────

function PeriodBtn({ label, period, current, dashKey }: { label: string; period: string; current: string; dashKey: string }) {
  const active = period === current
  return (
    <a href={`/dashboard?key=${dashKey}&period=${period}`}
      className={['px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors', active ? 'bg-white text-black' : 'text-gray-500 border border-white/[0.08] hover:text-white hover:border-white/20'].join(' ')}>
      {label}
    </a>
  )
}

// ── Page (Server Component) ───────────────────────────────────────────────────

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; period?: string }> | { key?: string; period?: string }
}) {
  const params      = searchParams instanceof Promise ? await searchParams : searchParams
  const expectedKey = process.env.DASHBOARD_KEY ?? 'magneto2025'
  const period      = (['7d','30d','all'] as const).includes(params.period as never) ? (params.period ?? '7d') : '7d'

  if (params.key !== expectedKey) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-xs mx-auto px-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth={2} className="w-7 h-7"><rect x={3} y={11} width={18} height={11} rx={2}/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <p className="text-white font-bold text-lg">Acceso restringido</p>
          <p className="text-gray-500 text-sm">Agrega <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">?key=tu_clave</code> a la URL.</p>
        </div>
      </div>
    )
  }

  const s = await getStats(period)
  const periodLabel: Record<string, string> = { '7d': '7 días', '30d': '30 días', all: 'Todo' }

  const metrics: { label: string; value: string | number; icon: React.ReactNode; color?: CardColor; sublabel?: string }[] = [
    { label: 'Visualizaciones',    value: s.totalPlays,     icon: <IconEye/>,    color: 'blue',   sublabel: 'Reproducciones totales' },
    { label: 'Clics en el botón',  value: s.totalCTA,       icon: <IconCursor/>, color: 'orange', sublabel: 'CTA presionado' },
    { label: 'Auto-interacciones', value: s.autoPlays,      icon: <IconZap/>,    color: 'blue',   sublabel: 'Autoplay disparado' },
    { label: 'Leads captados',     value: s.leads,          icon: <IconFile/>,   color: 'green',  sublabel: 'Formularios enviados' },
    { label: 'Tasa de conversión', value: `${s.convRate}%`, icon: <IconTarget/>, color: 'orange', sublabel: 'Clics / Visualizaciones' },
    { label: 'Finalizaciones',     value: s.completions,    icon: <IconCheck/>,  color: 'orange', sublabel: '>80% del video visto' },
    { label: 'Tiempo medio visto', value: s.avgTime,        icon: <IconClock/>,  color: 'gray',   sublabel: 'Promedio por sesión' },
    { label: 'En vivo ahora',      value: 0,                icon: <IconRadio/>,  color: 'gray',   sublabel: 'Espectadores activos' },
  ]

  const navLinks = [
    { label: 'Overview',  href: `/dashboard?key=${expectedKey}&period=${period}`,    active: true },
    { label: 'Revenue',   href: `/dashboard/revenue?key=${expectedKey}` },
    { label: 'Intención', href: `/dashboard/intent?key=${expectedKey}` },
    { label: 'CRM',       href: `/dashboard/crm?key=${expectedKey}` },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

      {/* Top bar */}
      <header className="h-14 border-b border-white/[0.07] flex items-center px-6 gap-6 flex-shrink-0 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-20">
        <div className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[#0a0a0a] text-xs" style={{ background: '#00d084' }}>V</div>
          <span className="font-black text-base tracking-tight" style={{ color: '#00d084' }}>VPlay</span>
        </div>
        <nav className="flex items-center gap-1">
          {navLinks.map(n => (
            <a key={n.label} href={n.href}
              className={['px-3 py-1.5 text-sm font-semibold rounded-md transition-colors', n.active ? 'text-white bg-white/[0.08]' : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'].join(' ')}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex-1"/>
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00d084] text-[#0a0a0a] text-sm font-bold hover:bg-[#00b873] transition-colors">
            <IconPlus/> Crear Player
          </a>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.07] transition-colors"><IconBell/></button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#ff9500] flex items-center justify-center text-xs font-black text-white">M</div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">

        {/* Sidebar */}
        <aside className="w-56 border-r border-white/[0.07] flex-shrink-0 flex flex-col py-4 px-3 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="space-y-0.5 flex-1">
            {navLinks.map(n => (
              <a key={n.label} href={n.href}
                className={['flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors', n.active ? 'bg-white/[0.09] text-white font-semibold' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]'].join(' ')}>
                <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                  {n.label === 'Overview'  && <IconGrid/>}
                  {n.label === 'Revenue'   && <IconDollar/>}
                  {n.label === 'Intención' && <IconFire/>}
                  {n.label === 'CRM'       && <IconTarget/>}
                </span>
                {n.label}
              </a>
            ))}
            <a href={`/dashboard?key=${expectedKey}&period=${period}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] transition-colors">
              <span className="w-4 h-4"><IconBarChart/></span> Analytics
            </a>
          </div>

          <div className="mt-4 border border-white/[0.08] rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div><p className="text-[11px] text-gray-500 font-medium">Impulso</p><p className="text-sm font-bold text-white">Master</p></div>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded-full font-bold">Activo</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">PLAYS</span>
                <span className="text-gray-400">{s.totalAllTime.toLocaleString()}</span>
              </div>
              <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${Math.min((s.totalAllTime / 15000) * 100, 100).toFixed(1)}%`, background: '#00d084' }}/>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2.5 px-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#ff9500] flex items-center justify-center text-[11px] font-black text-white flex-shrink-0">M</div>
            <div className="min-w-0"><p className="text-xs font-semibold text-white truncate">Magneto</p><p className="text-[10px] text-gray-600 truncate">Admin</p></div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 p-7 space-y-6 overflow-auto">

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[22px] font-black tracking-tight leading-none">Analytics</h1>
              <p className="text-gray-500 text-sm mt-1">Métricas Generales · {periodLabel[period]}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <div className="flex items-center gap-1 border border-white/[0.08] rounded-lg p-0.5">
                <PeriodBtn label="7d"   period="7d"  current={period} dashKey={expectedKey}/>
                <PeriodBtn label="30d"  period="30d" current={period} dashKey={expectedKey}/>
                <PeriodBtn label="Todo" period="all" current={period} dashKey={expectedKey}/>
              </div>
              <a href={`/dashboard?key=${expectedKey}&period=${period}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.08] text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors font-medium">
                <IconRefresh/> Actualizar
              </a>
            </div>
          </div>

          {/* Revenue shortcut banner */}
          <a href={`/dashboard/revenue?key=${expectedKey}`}
            className="flex items-center justify-between gap-4 bg-gradient-to-r from-[#FF6B00]/10 to-transparent border border-[#FF6B00]/20 rounded-xl px-5 py-4 group hover:border-[#FF6B00]/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00]"><IconDollar/></div>
              <div>
                <p className="text-sm font-bold text-white">Ver Revenue Dashboard</p>
                <p className="text-xs text-gray-500">Inversión → Atención → Oportunidades → Ventas</p>
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-600 group-hover:text-[#FF6B00] transition-colors flex-shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
          </a>

          <div className="grid grid-cols-4 gap-3">
            {metrics.map(m => <MetricCard key={m.label} label={m.label} value={m.value} icon={m.icon} color={m.color} sublabel={m.sublabel}/>)}
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-base">Actividad Diaria</h2>
                <p className="text-xs text-gray-500 mt-0.5">Visualizaciones y clics en los últimos {periodLabel[period].toLowerCase()}</p>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 text-xs"><span className="w-3 h-0.5 bg-blue-500 rounded-full inline-block"/><span className="text-gray-400">Visualizaciones</span><span className="font-bold text-white">{s.totalPlays.toLocaleString()}</span></div>
                <div className="flex items-center gap-2 text-xs"><span className="w-3 h-0.5 bg-[#FF6B00] rounded-full inline-block"/><span className="text-gray-400">Clics</span><span className="font-bold text-white">{s.totalCTA.toLocaleString()}</span></div>
              </div>
            </div>
            <DailyChart daily={s.daily}/>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between">
              <h2 className="font-bold text-base">Actividad Reciente</h2>
              <span className="text-xs text-gray-600">Últimas 20 acciones</span>
            </div>
            {s.recentEvents.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-gray-600 text-sm">Sin eventos aún. Los datos aparecen cuando alguien reproduzca el video.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {s.recentEvents.map((e, i) => {
                  const isClick = e.event === 'cta_click'
                  return (
                    <div key={i} className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`flex-shrink-0 w-2 h-2 rounded-full ${isClick ? 'bg-[#FF6B00]' : e.event === 'autoplay' ? 'bg-emerald-500' : e.event === 'watch_depth' ? 'bg-purple-500' : 'bg-blue-500'}`}/>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {e.event === 'play'       && 'Video reproducido'}
                            {e.event === 'autoplay'   && 'Autoplay activado'}
                            {e.event === 'cta_click'  && `CTA → ${e.cta_text ?? 'botón'}`}
                            {e.event === 'watch_depth'&& `Profundidad: ${e.watch_pct}% visto`}
                            {e.event === 'tab_blur'   && 'Cambió de pestaña'}
                            {e.event === 'tab_focus'  && 'Volvió a la pestaña'}
                            {!['play','autoplay','cta_click','watch_depth','tab_blur','tab_focus'].includes(e.event) && e.event}
                          </p>
                          <p className="text-[11px] text-gray-600 mt-0.5">Player: {e.player}{e.seconds_watched ? ` · ${fmtTime(e.seconds_watched)} visto` : ''}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-700 flex-shrink-0 tabular-nums">
                        {new Date(e.ts).toLocaleString('es', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}
