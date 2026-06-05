import { supabase } from '@/lib/supabase'
import CloseDealButton from './CloseDealButton'

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
    { label: 'Intención', href: `/dashboard/intent${q}` },
    { label: 'CRM',       href: `/dashboard/crm${q}`, active: true },
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

// ── Stage column ──────────────────────────────────────────────────────────────

interface Lead {
  id: string
  name: string | null
  contact: string | null
  intent_score: number | null
  intent_level: string | null
  stage: string | null
  ts: string
}

function intentColor(level: string | null) {
  if (level === 'hot')  return { text: 'text-red-400',  bg: 'bg-red-500/10 border-red-500/20' }
  if (level === 'warm') return { text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' }
  return { text: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' }
}

function LeadCard({ lead, showClose }: { lead: Lead; showClose?: boolean }) {
  const ic  = intentColor(lead.intent_level)
  const lvl: Record<string, string> = { hot: 'Caliente', warm: 'Tibio', cold: 'Frío' }
  return (
    <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-4 space-y-3 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{lead.name ?? 'Sin nombre'}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{lead.contact ?? '—'}</p>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${ic.bg} ${ic.text}`}>
          {lvl[lead.intent_level ?? 'cold'] ?? '—'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{
            width: `${lead.intent_score ?? 0}%`,
            background: lead.intent_level === 'hot' ? '#ef4444' : lead.intent_level === 'warm' ? '#f59e0b' : '#3b82f6',
          }}/>
        </div>
        <span className="text-[10px] text-gray-600 tabular-nums">{lead.intent_score ?? 0}</span>
      </div>
      <p className="text-[10px] text-gray-700">
        {new Date(lead.ts).toLocaleDateString('es', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </p>
      {showClose && <CloseDealButton leadId={lead.id} leadName={lead.name ?? 'Lead'}/>}
    </div>
  )
}

// ── Funnel column (auto-computed stages) ──────────────────────────────────────

interface FunnelColumnData {
  label: string
  sublabel: string
  count: number
  color: string
  borderColor: string
}

function FunnelColumn({ col, children }: { col: FunnelColumnData; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col min-w-[200px] flex-1">
      <div className={`rounded-t-xl border-t-2 bg-[#111] border-x border-b border-white/[0.07] p-4 mb-3`}
        style={{ borderTopColor: col.color }}>
        <p className="text-sm font-bold text-white">{col.label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{col.sublabel}</p>
        <p className="text-2xl font-black mt-2" style={{ color: col.color }}>{col.count.toLocaleString()}</p>
      </div>
      <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px] pr-0.5">
        {children}
        {col.count === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-700 text-xs">Sin registros</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function CRMPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }> | { key?: string }
}) {
  const params      = searchParams instanceof Promise ? await searchParams : searchParams
  const expectedKey = process.env.DASHBOARD_KEY ?? 'magneto2025'
  if (params.key !== expectedKey) return <Locked/>

  const [
    { count: totalSessions },
    { count: attentionCount },
    { count: hotCount },
    { data: leads },
    { data: deals },
  ] = await Promise.all([
    supabase.from('sessions').select('*', { count: 'exact', head: true }),
    supabase.from('sessions').select('*', { count: 'exact', head: true }).gte('max_watch_pct', 25),
    supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('intent_level', 'hot'),
    supabase.from('leads').select('id, name, contact, intent_score, intent_level, stage, ts').order('ts', { ascending: false }),
    supabase.from('deals').select('lead_id'),
  ])

  const allLeads     = leads ?? []
  const dealLeadIds  = new Set((deals ?? []).map(d => d.lead_id))
  const opps         = allLeads.filter(l => l.stage !== 'venta')
  const ventas       = allLeads.filter(l => l.stage === 'venta')

  const columns: FunnelColumnData[] = [
    { label: 'Atención',    sublabel: 'Visitaron la página',     count: totalSessions ?? 0, color: '#6366f1', borderColor: '#6366f1' },
    { label: 'Interés',     sublabel: 'Vieron >25% del video',   count: attentionCount ?? 0, color: '#3b82f6', borderColor: '#3b82f6' },
    { label: 'Intención',   sublabel: 'Score caliente (≥70)',     count: hotCount ?? 0,     color: '#f59e0b', borderColor: '#f59e0b' },
    { label: 'Oportunidad', sublabel: 'Formulario enviado',       count: opps.length,        color: '#FF6B00', borderColor: '#FF6B00' },
    { label: 'Venta',       sublabel: 'Venta confirmada',         count: ventas.length,      color: '#00d084', borderColor: '#00d084' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <header className="h-14 border-b border-white/[0.07] flex items-center px-6 gap-4 flex-shrink-0 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-20">
        <div className="flex items-center gap-2 mr-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[#0a0a0a] text-xs" style={{ background: '#00d084' }}>V</div>
          <span className="font-black text-base tracking-tight" style={{ color: '#00d084' }}>VPlay</span>
        </div>
        <span className="text-gray-700">/</span>
        <span className="text-sm font-semibold">CRM</span>
        <div className="flex-1"/>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#ff9500] flex items-center justify-center text-xs font-black">M</div>
      </header>

      <div className="flex flex-1 min-h-0">
        <Sidebar dashKey={expectedKey}/>

        <main className="flex-1 min-w-0 p-7 overflow-auto">
          <div className="mb-6">
            <h1 className="text-[22px] font-black tracking-tight">Pipeline de Oportunidades</h1>
            <p className="text-gray-500 text-sm mt-1">
              Atención → Interés → Intención → Oportunidad → Venta
            </p>
          </div>

          {/* Pipeline */}
          <div className="flex gap-4 overflow-x-auto pb-4">

            {/* Atención (sessions only — no lead cards) */}
            <FunnelColumn col={columns[0]}/>

            {/* Interés (sessions only) */}
            <FunnelColumn col={columns[1]}/>

            {/* Intención (hot sessions) */}
            <FunnelColumn col={columns[2]}/>

            {/* Oportunidades (leads with cards + close button) */}
            <FunnelColumn col={columns[3]}>
              {opps.map(l => <LeadCard key={l.id} lead={l} showClose/>)}
            </FunnelColumn>

            {/* Ventas */}
            <FunnelColumn col={columns[4]}>
              {ventas.map(l => <LeadCard key={l.id} lead={l}/>)}
            </FunnelColumn>

          </div>

          {/* Summary stats */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            {[
              {
                label: 'Tasa atención→interés',
                value: (totalSessions ?? 0) > 0
                  ? `${(((attentionCount ?? 0) / (totalSessions ?? 1)) * 100).toFixed(1)}%` : '—',
                color: '#3b82f6',
              },
              {
                label: 'Tasa interés→intención',
                value: (attentionCount ?? 0) > 0
                  ? `${(((hotCount ?? 0) / (attentionCount ?? 1)) * 100).toFixed(1)}%` : '—',
                color: '#f59e0b',
              },
              {
                label: 'Tasa intención→oportunidad',
                value: (hotCount ?? 0) > 0
                  ? `${((opps.length / (hotCount ?? 1)) * 100).toFixed(1)}%` : '—',
                color: '#FF6B00',
              },
              {
                label: 'Tasa oportunidad→venta',
                value: opps.length + ventas.length > 0
                  ? `${((ventas.length / (opps.length + ventas.length)) * 100).toFixed(1)}%` : '—',
                color: '#00d084',
              },
            ].map(s => (
              <div key={s.label} className="bg-[#111] border border-white/[0.07] rounded-xl p-4">
                <p className="text-[11px] uppercase tracking-widest text-gray-600 font-medium">{s.label}</p>
                <p className="text-2xl font-black mt-2" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}
