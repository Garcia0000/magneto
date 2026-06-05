'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  leadId: string
  leadName: string
}

export default function CloseDealButton({ leadId, leadName }: Props) {
  const router   = useRouter()
  const [open,    setOpen]    = useState(false)
  const [value,   setValue]   = useState('')
  const [notes,   setNotes]   = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  async function handleConfirm() {
    if (!value || parseFloat(value) < 0) return
    setLoading(true)
    try {
      await fetch('/api/deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, value: parseFloat(value), notes: notes.trim() || null }),
      })
      setDone(true)
      setTimeout(() => {
        setOpen(false)
        router.refresh()
      }, 800)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex items-center justify-center gap-1.5 py-1.5 text-[#00d084] text-xs font-bold">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        ¡Venta cerrada!
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-2 py-1.5 rounded-lg text-[10px] font-bold text-[#00d084] border border-[#00d084]/25 hover:bg-[#00d084]/10 transition-colors"
      >
        Cerrar venta ✓
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="bg-[#111] border border-white/[0.1] rounded-2xl p-6 w-full max-w-sm space-y-5 shadow-2xl">
            <div>
              <h3 className="text-base font-black text-white">Registrar venta</h3>
              <p className="text-xs text-gray-500 mt-0.5 truncate">Lead: {leadName}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">Valor de la venta (USD)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="997.00"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  className="w-full pl-7 pr-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-white/30 text-sm transition-colors"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">Notas (opcional)</label>
              <textarea
                rows={2}
                placeholder="Ej: Pagó con tarjeta, plan anual"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-white/30 text-sm transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-gray-400 hover:text-white text-sm font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading || !value}
                className="flex-1 py-2.5 rounded-xl text-[#0a0a0a] text-sm font-black transition-colors disabled:opacity-50"
                style={{ background: '#00d084' }}
              >
                {loading ? 'Guardando…' : 'Confirmar →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
