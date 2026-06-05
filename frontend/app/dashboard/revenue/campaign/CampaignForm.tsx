'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  dashKey: string
}

export default function CampaignForm({ dashKey }: Props) {
  const router = useRouter()
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')

  const [name,    setName]      = useState('')
  const [source,  setSource]    = useState('facebook')
  const [spend,   setSpend]     = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo,  setDateTo]    = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !spend) { setError('Nombre e inversión son obligatorios.'); return }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        name.trim(),
          source,
          adSpend:     parseFloat(spend),
          periodStart: dateFrom || null,
          periodEnd:   dateTo   || null,
        }),
      })
      if (!res.ok) throw new Error('Error al guardar')
      setSuccess(true)
      setTimeout(() => router.push(`/dashboard/revenue?key=${dashKey}`), 1200)
    } catch {
      setError('No se pudo guardar. Verifica tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="w-14 h-14 rounded-full bg-[#00d084]/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00d084" strokeWidth={2.5} className="w-7 h-7">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p className="text-white font-bold text-lg">Campaña registrada</p>
        <p className="text-gray-500 text-sm">Redirigiendo al Revenue Dashboard…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5">

      {/* Nombre */}
      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Nombre de la campaña</label>
        <input
          type="text"
          placeholder="Ej: Facebook Junio 2025"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-white/30 text-sm transition-colors"
          required
        />
      </div>

      {/* Fuente */}
      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Fuente de tráfico</label>
        <select
          value={source}
          onChange={e => setSource(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/[0.08] text-white focus:outline-none focus:border-white/30 text-sm transition-colors"
        >
          <option value="facebook">Facebook / Instagram</option>
          <option value="google">Google Ads</option>
          <option value="tiktok">TikTok Ads</option>
          <option value="email">Email</option>
          <option value="organic">Orgánico</option>
          <option value="other">Otro</option>
        </select>
      </div>

      {/* Inversión */}
      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Inversión publicitaria (USD)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="500.00"
            value={spend}
            onChange={e => setSpend(e.target.value)}
            className="w-full pl-8 pr-4 py-3 rounded-xl bg-[#111] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-white/30 text-sm transition-colors"
            required
          />
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Fecha inicio</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/[0.08] text-white focus:outline-none focus:border-white/30 text-sm transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Fecha fin</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/[0.08] text-white focus:outline-none focus:border-white/30 text-sm transition-colors"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push(`/dashboard/revenue?key=${dashKey}`)}
          className="flex-1 py-3 rounded-xl border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 rounded-xl text-[#0a0a0a] text-sm font-black transition-colors disabled:opacity-60"
          style={{ background: '#00d084' }}
        >
          {loading ? 'Guardando…' : 'Registrar campaña →'}
        </button>
      </div>
    </form>
  )
}
