'use client'

import { useState } from 'react'
import { SITE_CONFIG } from '@/lib/config'

interface Props {
  onSuccess: () => void
}

export default function LeadCaptureForm({ onSuccess }: Props) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !contact.trim()) {
      setError('Por favor completa todos los campos.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const sessionId = typeof window !== 'undefined' ? sessionStorage.getItem('_msid') : null
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), contact: contact.trim(), sessionId }),
      })
    } catch {
      // silently continue — don't block user flow on network errors
    }

    setLoading(false)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
      <div>
        <input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange transition-colors text-lg"
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Tu WhatsApp (con código de país, ej: +52...)"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange transition-colors text-lg"
          required
        />
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 rounded-xl bg-gradient-brand text-white font-black text-xl uppercase tracking-wide glow-button disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? 'Procesando...' : SITE_CONFIG.optinCTA}
      </button>

      <p className="text-center text-xs text-gray-600">
        🔒 Tus datos están protegidos. Cero spam, promesa.
      </p>
    </form>
  )
}
