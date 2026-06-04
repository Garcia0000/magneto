'use client'

import { useEffect, useState } from 'react'

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

function getDeadline(hours: number): number {
  const key = 'magneto_deadline'
  if (typeof window === 'undefined') return Date.now() + hours * 3600 * 1000
  const stored = localStorage.getItem(key)
  if (stored) return parseInt(stored, 10)
  const deadline = Date.now() + hours * 3600 * 1000
  localStorage.setItem(key, String(deadline))
  return deadline
}

export default function CountdownTimer({ hours }: { hours: number }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const deadline = getDeadline(hours)

    const tick = () => {
      const diff = Math.max(0, deadline - Date.now())
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [hours])

  if (!mounted) return null

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center justify-center gap-1 text-center">
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-black text-gradient tabular-nums">
          {pad(timeLeft.hours)}
        </span>
        <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">horas</span>
      </div>
      <span className="text-2xl font-black text-brand-orange mb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-black text-gradient tabular-nums">
          {pad(timeLeft.minutes)}
        </span>
        <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">min</span>
      </div>
      <span className="text-2xl font-black text-brand-orange mb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-black text-gradient tabular-nums">
          {pad(timeLeft.seconds)}
        </span>
        <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">seg</span>
      </div>
    </div>
  )
}
