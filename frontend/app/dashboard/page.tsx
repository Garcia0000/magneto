import { readFileSync } from 'fs'
import path from 'path'

// ── Data helpers ──────────────────────────────────────────────────────────────

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
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function getStats() {
  try {
    const events = readJsonl<TrackEvent>('track.jsonl')
    const leads  = readJsonl<Lead>('leads.jsonl')

    const plays     = events.filter(e => e.event === 'play')
    const ctaClicks = events.filter(e => e.event === 'cta_click')

    // Unique plays by IP (approximation for "cliques únicos")
    const uniqueIPs   = new Set(plays.map(e => e.ip ?? e.ts))
    const uniquePlays = uniqueIPs.size

    // Auto plays: approximated as all plays (we don't track autoplay flag separately yet)
    const autoPlays = plays.length

    const totalPlays = plays.length
    const totalCTA   = ctaClicks.length
    const convRate   = totalPlays > 0 ? ((totalCTA / totalPlays) * 100) : 0

    // Average seconds watched from cta_click events that have secondsWatched
    const withSeconds = ctaClicks.filter(e => (e.secondsWatched ?? 0) > 0)
    const avgSeconds  = withSeconds.length > 0
      ? withSeconds.reduce((acc, e) => acc + (e.secondsWatched ?? 0), 0) / withSeconds.length
      : 0

    // Completions: watched >80% of 1980s (= 1584s)
    const completions = events.filter(e =>
      e.event === 'cta_click' && (e.secondsWatched ?? 0) > 1584
    ).length

    // Daily data for last 7 days
    const now   = new Date()
    const daily = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (6 - i))
      const key   = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
      return {
        date:   key,
        label:  label.charAt(0).toUpperCase() + label.slice(1),
        plays:  plays.filter(e => e.ts.startsWith(key)).length,
        clicks: ctaClicks.filter(e => e.ts.startsWith(key)).length,
      }
    })

    return {
      totalPlays,
      uniquePlays,
      autoPlays,
      totalCTA,
      avgTime:     fmtTime(avgSeconds),
      convRate:    convRate.toFixed(1),
      completions,
      leads:       leads.length,
      daily,
      recentEvents: events.slice(-10).reverse(),
    }
  } catch {
    return {
      totalPlays: 0,
      uniquePlays: 0,
      autoPlays: 0,
      totalCTA: 0,
      avgTime: '00:00:00',
      convRate: '0.0',
      completions: 0,
      leads: 0,
      daily: Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        return { date: d.toISOString().slice(0, 10), label: 'Seg', plays: 0, clicks: 0 }
      }),
      recentEvents: [] as TrackEvent[],
    }
  }
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M8 5v14l11-7z"/>
    </svg>
  )
}
function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx={9} cy={7} r={4}/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )
}
function IconZap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  )
}
function IconMousePointer() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
      <path d="M13 13l6 6"/>
    </svg>
  )
}
function IconImage() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <rect x={3} y={3} width={18} height={18} rx={2} ry={2}/>
      <circle cx={8.5} cy={8.5} r={1.5}/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  )
}
function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <circle cx={12} cy={12} r={10}/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}
function IconTrendUp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  )
}
function IconCheckCircle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
}
function IconRadio() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <circle cx={12} cy={12} r={2}/>
      <path d="M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14"/>
    </svg>
  )
}

// ── Metric Card ───────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div
      className={[
        'rounded-xl p-5 border flex flex-col gap-3 relative overflow-hidden',
        highlight
          ? 'bg-[#FF6B00]/10 border-[#FF6B00]/30'
          : 'bg-[#111111] border-white/[0.08]',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">{label}</p>
        <span className={highlight ? 'text-[#FF6B00]/60' : 'text-gray-700'}>{icon}</span>
      </div>
      <p className={`text-3xl font-black leading-none ${highlight ? 'text-[#FF6B00]' : 'text-white'}`}>
        {value}
      </p>
    </div>
  )
}

// ── Daily Chart (pure SVG) ────────────────────────────────────────────────────

function DailyChart({
  daily,
}: {
  daily: { label: string; plays: number; clicks: number }[]
}) {
  const W = 560
  const H = 130
  const PAD = { t: 10, r: 16, b: 30, l: 28 }
  const iW  = W - PAD.l - PAD.r
  const iH  = H - PAD.t - PAD.b
  const n   = daily.length
  const maxVal = Math.max(...daily.map(d => d.plays), ...daily.map(d => d.clicks), 1)

  const xs     = daily.map((_, i) => PAD.l + (n === 1 ? iW / 2 : (i / (n - 1)) * iW))
  const yPlays = daily.map(d => PAD.t + iH - (d.plays  / maxVal) * iH)
  const yClicks = daily.map(d => PAD.t + iH - (d.clicks / maxVal) * iH)

  const pts = (ys: number[]) => ys.map((y, i) => `${xs[i].toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = (ys: number[]) =>
    `${xs[0].toFixed(1)},${(PAD.t + iH).toFixed(1)} ${pts(ys)} ${xs[n - 1].toFixed(1)},${(PAD.t + iH).toFixed(1)}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
        <line key={i}
          x1={PAD.l} x2={W - PAD.r}
          y1={PAD.t + iH * r} y2={PAD.t + iH * r}
          stroke="rgba(255,255,255,0.05)" strokeWidth={1}
        />
      ))}

      {/* Plays area */}
      <polygon points={area(yPlays)} fill="rgba(59,130,246,0.12)" />
      <polyline points={pts(yPlays)} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

      {/* Clicks area */}
      <polygon points={area(yClicks)} fill="rgba(255,107,0,0.12)" />
      <polyline points={pts(yClicks)} fill="none" stroke="#FF6B00" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

      {/* Dots — plays */}
      {yPlays.map((y, i) => (
        <circle key={`p${i}`} cx={xs[i]} cy={y} r={3} fill="#3b82f6" />
      ))}
      {/* Dots — clicks */}
      {yClicks.map((y, i) => (
        <circle key={`c${i}`} cx={xs[i]} cy={y} r={3} fill="#FF6B00" />
      ))}

      {/* X-axis labels */}
      {daily.map((d, i) => (
        <text key={i} x={xs[i]} y={H - 6}
          textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={10} fontFamily="sans-serif">
          {d.label}
        </text>
      ))}
    </svg>
  )
}

// ── Sidebar nav item ──────────────────────────────────────────────────────────

function NavItem({
  label,
  active,
  icon,
}: {
  label: string
  active?: boolean
  icon: React.ReactNode
}) {
  return (
    <div
      className={[
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors',
        active
          ? 'bg-white/[0.08] text-white font-semibold'
          : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]',
      ].join(' ')}
    >
      <span className="w-4 h-4 flex-shrink-0">{icon}</span>
      {label}
    </div>
  )
}

// ── Page (Server Component) ───────────────────────────────────────────────────

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }> | { key?: string }
}) {
  // Support both Next.js 14 (sync) and 15 (async) searchParams
  const params = searchParams instanceof Promise ? await searchParams : searchParams
  const expectedKey = process.env.DASHBOARD_KEY ?? 'magneto2025'

  if (params.key !== expectedKey) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth={2} className="w-7 h-7">
              <rect x={3} y={11} width={18} height={11} rx={2} ry={2}/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <p className="text-white font-bold text-lg">Acesso restrito</p>
          <p className="text-gray-500 text-sm">Adicione <code className="bg-white/10 px-1 rounded">?key=sua_chave</code> à URL para entrar.</p>
        </div>
      </div>
    )
  }

  const s = getStats()

  const metrics: { label: string; value: string | number; icon: React.ReactNode; highlight?: boolean }[] = [
    { label: 'Visualizações',          value: s.totalPlays,  icon: <IconPlay /> },
    { label: 'Cliques no vídeo',       value: s.uniquePlays, icon: <IconUsers /> },
    { label: 'Auto-interações',        value: s.autoPlays,   icon: <IconZap /> },
    { label: 'Cliques no botão',       value: s.totalCTA,    icon: <IconMousePointer />, highlight: true },
    { label: 'Cliques na imagem',      value: 0,             icon: <IconImage /> },
    { label: 'Tempo médio assistido',  value: s.avgTime,     icon: <IconClock /> },
    { label: 'Taxa de conversão',      value: `${s.convRate}%`, icon: <IconTrendUp />, highlight: true },
    { label: 'Finalizações',           value: s.completions, icon: <IconCheckCircle /> },
    { label: 'Ao vivo',                value: 0,             icon: <IconRadio /> },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className="w-56 border-r border-white/[0.07] flex-shrink-0 flex flex-col py-6 px-3 sticky top-0 h-screen overflow-y-auto">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-[#0a0a0a] text-sm"
            style={{ background: '#00d084' }}
          >
            V
          </div>
          <span className="font-black text-[17px] tracking-tight" style={{ color: '#00d084' }}>
            VPlay
          </span>
        </div>

        <div className="space-y-0.5 flex-1">
          <NavItem label="Dashboard" active icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <rect x={3} y={3} width={7} height={7} rx={1}/><rect x={14} y={3} width={7} height={7} rx={1}/>
              <rect x={3} y={14} width={7} height={7} rx={1}/><rect x={14} y={14} width={7} height={7} rx={1}/>
            </svg>
          }/>
          <NavItem label="Analytics" icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <line x1={18} y1={20} x2={18} y2={10}/><line x1={12} y1={20} x2={12} y2={4}/>
              <line x1={6} y1={20} x2={6} y2={14}/>
            </svg>
          }/>
          <NavItem label="Mis Videos" icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <rect x={2} y={2} width={20} height={20} rx={2.18}/>
              <path d="M10 8l6 4-6 4V8z"/>
            </svg>
          }/>
          <NavItem label="Criar Player" icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <circle cx={12} cy={12} r={10}/><line x1={12} y1={8} x2={12} y2={16}/>
              <line x1={8} y1={12} x2={16} y2={12}/>
            </svg>
          }/>
          <NavItem label="Formulários" icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1={16} y1={13} x2={8} y2={13}/>
              <line x1={16} y1={17} x2={8} y2={17}/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          }/>
        </div>

        {/* Plan card */}
        <div className="border border-white/[0.08] rounded-xl p-3 mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500 font-medium">Plan activo</span>
            <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/25 px-1.5 py-0.5 rounded-full font-semibold">
              Activo
            </span>
          </div>
          <p className="text-sm font-bold text-white">Impulso</p>
          <div className="flex justify-between text-[11px] text-gray-600">
            <span>tiktok-main</span>
            <span>{s.totalPlays} plays</span>
          </div>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 p-8 space-y-6 overflow-auto">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Analytics</h1>
            <p className="text-gray-500 text-sm mt-0.5">Métricas Gerais</p>
          </div>
          <div className="flex items-center gap-1.5">
            {(['7d', '30d', 'Todo'] as const).map((f, i) => (
              <button
                key={f}
                className={[
                  'px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors',
                  i === 0
                    ? 'bg-white text-black'
                    : 'text-gray-500 border border-white/[0.08] hover:text-white',
                ].join(' ')}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics grid — 3 cols × 3 rows */}
        <div className="grid grid-cols-3 gap-3">
          {metrics.map(m => (
            <MetricCard
              key={m.label}
              label={m.label}
              value={m.value}
              icon={m.icon}
              highlight={m.highlight}
            />
          ))}
        </div>

        {/* Daily chart */}
        <div className="bg-[#111111] border border-white/[0.08] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-base">Atividade Diária</h2>
              <p className="text-xs text-gray-500 mt-0.5">Visualizações e cliques nos últimos 7 dias</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="inline-block w-3 h-0.5 bg-blue-500 rounded" />
                Visualizações
                <span className="font-bold text-white">{s.totalPlays}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="inline-block w-3 h-0.5 bg-[#FF6B00] rounded" />
                Cliques
                <span className="font-bold text-white">{s.totalCTA}</span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden">
            <DailyChart daily={s.daily} />
          </div>
        </div>

        {/* Recent activity table */}
        <div className="bg-[#111111] border border-white/[0.08] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between">
            <h2 className="font-bold text-base">Atividade Recente</h2>
            <span className="text-xs text-gray-500">Últimas 10 acciones</span>
          </div>

          {s.recentEvents.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600 text-sm">
                Sin eventos aún. Los datos aparecen cuando alguien reproduzca el video.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {s.recentEvents.map((e, i) => (
                <div key={i} className="px-6 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={[
                        'flex-shrink-0 w-2 h-2 rounded-full',
                        e.event === 'cta_click' ? 'bg-[#FF6B00]' : 'bg-blue-500',
                      ].join(' ')}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {e.event === 'play'
                          ? 'Video reproducido'
                          : `CTA — ${e.ctaText ?? 'sin texto'}`}
                      </p>
                      <p className="text-xs text-gray-600">Player: {e.player}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-700 flex-shrink-0">
                    {new Date(e.ts).toLocaleString('es', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
