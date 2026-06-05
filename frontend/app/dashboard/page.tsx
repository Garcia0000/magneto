import { readFileSync } from 'fs'
import path from 'path'

// ── Types ─────────────────────────────────────────────────────────────────────

interface TrackEvent {
  event: string
  player: string
  ctaText?: string
  secondsWatched?: number
  ip?: string
  ts: string
}

interface Lead {
  name: string
  contact: string
  ts: string
}

// ── Data helpers ──────────────────────────────────────────────────────────────

function readJsonl<T>(filename: string): T[] {
  try {
    const file = path.join(process.cwd(), 'data', filename)
    return readFileSync(file, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map(l => JSON.parse(l) as T)
  } catch {
    return []
  }
}

function fmtTime(s: number): string {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

function periodCutoff(period: string): Date {
  const d = new Date()
  if (period === '7d')  d.setDate(d.getDate() - 7)
  else if (period === '30d') d.setDate(d.getDate() - 30)
  else d.setFullYear(2000)
  return d
}

function getStats(period: string) {
  const cutoff = periodCutoff(period)

  const allEvents = readJsonl<TrackEvent>('track.jsonl')
  const allLeads  = readJsonl<Lead>('leads.jsonl')

  const events = allEvents.filter(e => new Date(e.ts) >= cutoff)
  const leads  = allLeads.filter(l => new Date(l.ts) >= cutoff)

  const plays     = events.filter(e => e.event === 'play')
  const ctaClicks = events.filter(e => e.event === 'cta_click')
  const autoPlays = events.filter(e => e.event === 'autoplay')

  const uniqueIPs   = new Set(plays.map(e => e.ip ?? e.ts))

  const totalPlays   = plays.length
  const totalCTA     = ctaClicks.length
  const convRate     = totalPlays > 0 ? (totalCTA / totalPlays) * 100 : 0

  const withSeconds  = events.filter(e => (e.secondsWatched ?? 0) > 0)
  const avgSeconds   = withSeconds.length > 0
    ? withSeconds.reduce((acc, e) => acc + (e.secondsWatched ?? 0), 0) / withSeconds.length
    : 0

  // >80% of 1980s = 1584s
  const completions = events.filter(e => (e.secondsWatched ?? 0) > 1584).length

  // Daily data
  const days = period === '30d' ? 30 : 7
  const now  = new Date()
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (days - 1 - i))
    const key   = d.toISOString().slice(0, 10)
    const label = period === '30d'
      ? d.getDate().toString()
      : d.toLocaleDateString('es', { weekday: 'short' }).replace('.', '').slice(0,3)
    return {
      date:   key,
      label:  label.charAt(0).toUpperCase() + label.slice(1),
      plays:  plays.filter(e => e.ts.startsWith(key)).length,
      clicks: ctaClicks.filter(e => e.ts.startsWith(key)).length,
    }
  })

  return {
    totalPlays,
    uniquePlays:  uniqueIPs.size,
    autoPlays:    autoPlays.length,
    totalCTA,
    avgTime:      fmtTime(avgSeconds),
    convRate:     convRate.toFixed(1),
    completions,
    leads:        leads.length,
    daily,
    recentEvents: allEvents.slice(-20).reverse(),
    totalAllTime: allEvents.filter(e => e.event === 'play').length,
  }
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────

const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx={12} cy={12} r={3}/>
  </svg>
)
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)
const IconZap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const IconCursor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/>
  </svg>
)
const IconImage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
    <rect x={3} y={3} width={18} height={18} rx={2}/><circle cx={8.5} cy={8.5} r={1.5}/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
)
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
    <circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
    <circle cx={12} cy={12} r={10}/><circle cx={12} cy={12} r={6}/><circle cx={12} cy={12} r={2}/>
  </svg>
)
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)
const IconRadio = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
    <circle cx={12} cy={12} r={2}/>
    <path d="M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14"/>
  </svg>
)
const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <rect x={3} y={3} width={7} height={7} rx={1}/><rect x={14} y={3} width={7} height={7} rx={1}/>
    <rect x={3} y={14} width={7} height={7} rx={1}/><rect x={14} y={14} width={7} height={7} rx={1}/>
  </svg>
)
const IconBarChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <line x1={18} y1={20} x2={18} y2={10}/><line x1={12} y1={20} x2={12} y2={4}/>
    <line x1={6} y1={20} x2={6} y2={14}/>
  </svg>
)
const IconFilm = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <rect x={2} y={2} width={20} height={20} rx={2.18}/>
    <line x1={7} y1={2} x2={7} y2={22}/><line x1={17} y1={2} x2={17} y2={22}/>
    <line x1={2} y1={12} x2={22} y2={12}/><line x1={2} y1={7} x2={7} y2={7}/>
    <line x1={17} y1={7} x2={22} y2={7}/><line x1={17} y1={17} x2={22} y2={17}/>
    <line x1={2} y1={17} x2={7} y2={17}/>
  </svg>
)
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <circle cx={12} cy={12} r={10}/><line x1={12} y1={8} x2={12} y2={16}/>
    <line x1={8} y1={12} x2={16} y2={12}/>
  </svg>
)
const IconFile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1={16} y1={13} x2={8} y2={13}/>
    <line x1={16} y1={17} x2={8} y2={17}/><polyline points="10 9 9 9 8 9"/>
  </svg>
)
const IconSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <circle cx={12} cy={12} r={3}/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
)
const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
)
const IconRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
  </svg>
)

// ── Metric Card ───────────────────────────────────────────────────────────────

type CardColor = 'blue' | 'orange' | 'green' | 'gray'

function MetricCard({
  label, value, icon, color = 'gray', sublabel,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  color?: CardColor
  sublabel?: string
}) {
  const iconBg: Record<CardColor, string> = {
    blue:   'bg-blue-500/15 text-blue-400',
    orange: 'bg-[#FF6B00]/15 text-[#FF6B00]',
    green:  'bg-emerald-500/15 text-emerald-400',
    gray:   'bg-white/[0.07] text-gray-400',
  }
  const valueCls: Record<CardColor, string> = {
    blue:   'text-blue-400',
    orange: 'text-[#FF6B00]',
    green:  'text-emerald-400',
    gray:   'text-white',
  }
  const borderCls: Record<CardColor, string> = {
    blue:   'border-blue-500/20',
    orange: 'border-[#FF6B00]/25',
    green:  'border-emerald-500/20',
    gray:   'border-white/[0.07]',
  }

  return (
    <div className={`bg-[#111] rounded-xl p-5 border ${borderCls[color]} flex flex-col gap-4`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold leading-none">{label}</p>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg[color]}`}>
          {icon}
        </span>
      </div>
      <div>
        <p className={`text-[2rem] font-black leading-none ${valueCls[color]}`}>{value}</p>
        {sublabel && <p className="text-[11px] text-gray-600 mt-1">{sublabel}</p>}
      </div>
    </div>
  )
}

// ── Daily Chart ───────────────────────────────────────────────────────────────

function DailyChart({ daily }: { daily: { label: string; plays: number; clicks: number }[] }) {
  const W   = 700
  const H   = 160
  const PAD = { t: 12, r: 20, b: 32, l: 32 }
  const iW  = W - PAD.l - PAD.r
  const iH  = H - PAD.t - PAD.b
  const n   = daily.length
  const maxVal = Math.max(...daily.map(d => d.plays), ...daily.map(d => d.clicks), 1)

  const xs      = daily.map((_, i) => PAD.l + (n === 1 ? iW / 2 : (i / (n - 1)) * iW))
  const yP      = daily.map(d => PAD.t + iH - (d.plays  / maxVal) * iH)
  const yC      = daily.map(d => PAD.t + iH - (d.clicks / maxVal) * iH)
  const pts     = (ys: number[]) => ys.map((y, i) => `${xs[i].toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area    = (ys: number[]) =>
    `${xs[0].toFixed(1)},${(PAD.t + iH).toFixed(1)} ${pts(ys)} ${xs[n-1].toFixed(1)},${(PAD.t + iH).toFixed(1)}`

  const gridVals = [0, 0.25, 0.5, 0.75, 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
      <defs>
        <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="gOrange" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#FF6B00" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {gridVals.map((r, i) => (
        <line key={i}
          x1={PAD.l} x2={W - PAD.r}
          y1={PAD.t + iH * r} y2={PAD.t + iH * r}
          stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4 4"
        />
      ))}

      <polygon points={area(yP)}  fill="url(#gBlue)"/>
      <polyline points={pts(yP)}  fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"/>

      <polygon points={area(yC)}  fill="url(#gOrange)"/>
      <polyline points={pts(yC)}  fill="none" stroke="#FF6B00" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"/>

      {yP.map((y, i) => (
        <circle key={`p${i}`} cx={xs[i]} cy={y} r={3.5} fill="#3b82f6" stroke="#111" strokeWidth={1.5}/>
      ))}
      {yC.map((y, i) => (
        <circle key={`c${i}`} cx={xs[i]} cy={y} r={3.5} fill="#FF6B00" stroke="#111" strokeWidth={1.5}/>
      ))}

      {daily.map((d, i) => (
        <text key={i} x={xs[i]} y={H - 8}
          textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={n > 15 ? 8 : 10} fontFamily="sans-serif">
          {d.label}
        </text>
      ))}
    </svg>
  )
}

// ── Sidebar Nav Item ──────────────────────────────────────────────────────────

function NavItem({ label, active, icon, badge }: {
  label: string; active?: boolean; icon: React.ReactNode; badge?: string
}) {
  return (
    <div className={[
      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all select-none',
      active ? 'bg-white/[0.09] text-white font-semibold' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]',
    ].join(' ')}>
      <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="text-[10px] bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30 px-1.5 py-0.5 rounded-full font-bold">
          {badge}
        </span>
      )}
    </div>
  )
}

// ── Period Filter Link ─────────────────────────────────────────────────────────

function PeriodBtn({ label, period, current, dashKey }: {
  label: string; period: string; current: string; dashKey: string
}) {
  const active = period === current
  return (
    <a
      href={`/dashboard?key=${dashKey}&period=${period}`}
      className={[
        'px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors',
        active ? 'bg-white text-black' : 'text-gray-500 border border-white/[0.08] hover:text-white hover:border-white/20',
      ].join(' ')}
    >
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
            <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth={2} className="w-7 h-7">
              <rect x={3} y={11} width={18} height={11} rx={2}/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <p className="text-white font-bold text-lg">Acceso restringido</p>
          <p className="text-gray-500 text-sm">
            Agrega <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">?key=tu_clave</code> a la URL.
          </p>
        </div>
      </div>
    )
  }

  const s = getStats(period)
  const periodLabel: Record<string, string> = { '7d': '7 días', '30d': '30 días', all: 'Todo' }

  const metrics: {
    label: string; value: string | number; icon: React.ReactNode; color?: CardColor; sublabel?: string
  }[] = [
    { label: 'Visualizaciones',      value: s.totalPlays,          icon: <IconEye />,    color: 'blue',   sublabel: 'Reproducciones totales' },
    { label: 'Clics en el video',     value: s.uniquePlays,         icon: <IconPlay />,   color: 'blue',   sublabel: 'IPs únicas' },
    { label: 'Auto-interacciones',    value: s.autoPlays,           icon: <IconZap />,    color: 'blue',   sublabel: 'Autoplay disparado' },
    { label: 'Clics en el botón',     value: s.totalCTA,            icon: <IconCursor />, color: 'orange', sublabel: 'CTA presionado' },
    { label: 'Leads captados',        value: s.leads,               icon: <IconFile />,   color: 'green',  sublabel: 'Formularios enviados' },
    { label: 'Tiempo medio visto',    value: s.avgTime,             icon: <IconClock />,  color: 'gray',   sublabel: 'Promedio por sesión' },
    { label: 'Tasa de conversión',    value: `${s.convRate}%`,      icon: <IconTarget />, color: 'orange', sublabel: 'Clics / Visualizaciones' },
    { label: 'Finalizaciones',        value: s.completions,         icon: <IconCheck />,  color: 'orange', sublabel: '>80% del video visto' },
    { label: 'En vivo ahora',         value: 0,                     icon: <IconRadio />,  color: 'gray',   sublabel: 'Espectadores activos' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <header className="h-14 border-b border-white/[0.07] flex items-center px-6 gap-6 flex-shrink-0 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-20">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[#0a0a0a] text-xs" style={{ background: '#00d084' }}>V</div>
          <span className="font-black text-base tracking-tight" style={{ color: '#00d084' }}>VPlay</span>
        </div>

        {/* Tabs */}
        <nav className="flex items-center gap-1">
          <a href={`/dashboard?key=${expectedKey}&period=${period}`}
            className="px-3 py-1.5 text-sm font-semibold text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/[0.05]">
            Dashboard
          </a>
          <a href={`/dashboard?key=${expectedKey}&period=${period}`}
            className="px-3 py-1.5 text-sm font-semibold text-white bg-white/[0.08] rounded-md">
            Analytics
          </a>
        </nav>

        <div className="flex-1"/>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00d084] text-[#0a0a0a] text-sm font-bold hover:bg-[#00b873] transition-colors">
            <IconPlus/>
            Crear Player
          </a>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.07] transition-colors relative">
            <IconBell/>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#ff9500] flex items-center justify-center text-xs font-black text-white select-none">
            M
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside className="w-56 border-r border-white/[0.07] flex-shrink-0 flex flex-col py-4 px-3 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">

          <div className="space-y-0.5 flex-1">
            <NavItem label="Dashboard" active icon={<IconGrid/>}/>
            <NavItem label="Analytics" icon={<IconBarChart/>}/>
            <NavItem label="Mis Videos" icon={<IconFilm/>}/>
            <NavItem label="Crear Player" icon={<IconPlus/>}/>
            <NavItem label="Formularios" icon={<IconFile/>}/>
            <NavItem label="Configuración" icon={<IconSettings/>}/>
          </div>

          {/* Plan card */}
          <div className="mt-4 border border-white/[0.08] rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-gray-500 font-medium">Impulso</p>
                <p className="text-sm font-bold text-white">Master</p>
              </div>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded-full font-bold">Activo</span>
            </div>

            <div className="space-y-1 text-[11px] text-gray-600">
              <div className="flex justify-between">
                <span>Videos</span>
                <span className="text-gray-400">tiktok-main</span>
              </div>
              <div className="flex justify-between">
                <span>Analytics</span>
                <span className="text-gray-400">{s.totalAllTime}</span>
              </div>
            </div>

            {/* Plays progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">PLAYS</span>
                <span className="text-gray-400">{s.totalAllTime.toLocaleString()}</span>
              </div>
              <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min((s.totalAllTime / 15000) * 100, 100).toFixed(1)}%`,
                    background: '#00d084',
                  }}
                />
              </div>
            </div>
          </div>

          {/* User avatar */}
          <div className="mt-3 flex items-center gap-2.5 px-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#ff9500] flex items-center justify-center text-[11px] font-black text-white flex-shrink-0">M</div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Magneto</p>
              <p className="text-[10px] text-gray-600 truncate">Admin</p>
            </div>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 p-7 space-y-6 overflow-auto">

          {/* Page header */}
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

          {/* Metrics grid */}
          <div className="grid grid-cols-3 gap-3">
            {metrics.map(m => (
              <MetricCard key={m.label} label={m.label} value={m.value} icon={m.icon} color={m.color} sublabel={m.sublabel}/>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-[#111] border border-white/[0.07] rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-base">Actividad Diaria</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Visualizaciones y clics en los últimos {periodLabel[period].toLowerCase()}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-0.5 bg-blue-500 rounded-full inline-block"/>
                  <span className="text-gray-400">Visualizaciones</span>
                  <span className="font-bold text-white">{s.totalPlays.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-0.5 bg-[#FF6B00] rounded-full inline-block"/>
                  <span className="text-gray-400">Clics</span>
                  <span className="font-bold text-white">{s.totalCTA.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <DailyChart daily={s.daily}/>
          </div>

          {/* Recent events */}
          <div className="bg-[#111] border border-white/[0.07] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between">
              <h2 className="font-bold text-base">Actividad Reciente</h2>
              <span className="text-xs text-gray-600">Últimas 20 acciones</span>
            </div>

            {s.recentEvents.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
                  <IconBarChart/>
                </div>
                <p className="text-gray-600 text-sm">Sin eventos aún.</p>
                <p className="text-gray-700 text-xs mt-1">Los datos aparecen cuando alguien reproduzca el video.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {s.recentEvents.map((e, i) => {
                  const isClick = e.event === 'cta_click'
                  return (
                    <div key={i} className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`flex-shrink-0 w-2 h-2 rounded-full ${isClick ? 'bg-[#FF6B00]' : e.event === 'autoplay' ? 'bg-emerald-500' : 'bg-blue-500'}`}/>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {e.event === 'play'     && 'Video reproducido'}
                            {e.event === 'autoplay' && 'Autoplay activado'}
                            {e.event === 'cta_click'&& `CTA → ${e.ctaText ?? 'botón'}`}
                            {!['play','autoplay','cta_click'].includes(e.event) && e.event}
                          </p>
                          <p className="text-[11px] text-gray-600 mt-0.5">
                            Player: {e.player}
                            {e.secondsWatched ? ` · ${fmtTime(e.secondsWatched)} visto` : ''}
                          </p>
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
