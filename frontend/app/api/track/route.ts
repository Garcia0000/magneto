import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function computeScore(maxWatchPct: number, hasCTAClick: boolean, tabBlurCount: number): number {
  let score = 0
  if (maxWatchPct >= 10) score += 10
  if (maxWatchPct >= 25) score += 15
  if (maxWatchPct >= 50) score += 15
  if (maxWatchPct >= 75) score += 20
  if (maxWatchPct >= 90) score += 15
  if (hasCTAClick)       score += 20
  score -= Math.min(tabBlurCount * 5, 15)
  return Math.max(0, Math.min(100, score))
}

function intentLevel(score: number): string {
  if (score >= 70) return 'hot'
  if (score >= 30) return 'warm'
  return 'cold'
}

export async function POST(req: NextRequest) {
  try {
    const { event, player, ctaText, secondsWatched, watchPct, sessionId } = await req.json()

    if (!event || !player) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    await supabase.from('events').insert({
      session_id:      sessionId ?? null,
      event,
      player,
      cta_text:        ctaText ?? null,
      seconds_watched: secondsWatched ?? null,
      watch_pct:       watchPct ?? null,
    })

    // Recompute intent score after watch_depth / cta_click / tab_blur events
    if (sessionId && ['watch_depth', 'cta_click', 'tab_blur'].includes(event)) {
      const { data: evts } = await supabase
        .from('events')
        .select('event, watch_pct')
        .eq('session_id', sessionId)

      if (evts) {
        const maxWatch = Math.max(0, ...evts.filter(e => e.watch_pct != null).map(e => e.watch_pct as number))
        const hasCTA   = evts.some(e => e.event === 'cta_click')
        const blurs    = evts.filter(e => e.event === 'tab_blur').length
        const score    = computeScore(maxWatch, hasCTA, blurs)
        const level    = intentLevel(score)

        await supabase
          .from('sessions')
          .update({ intent_score: score, intent_level: level, max_watch_pct: maxWatch, updated_at: new Date().toISOString() })
          .eq('id', sessionId)
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
