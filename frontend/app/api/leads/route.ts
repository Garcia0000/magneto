import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { name, contact, sessionId } = await req.json()

    if (!name || !contact) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    const ua = req.headers.get('user-agent') ?? ''

    let intentScore = 70
    let intentLvl   = 'hot'

    if (sessionId) {
      const { data: session } = await supabase
        .from('sessions')
        .select('intent_score, intent_level')
        .eq('id', sessionId)
        .single()

      if (session) {
        intentScore = Math.max(session.intent_score, 70)
      }
    }

    await supabase.from('leads').insert({
      session_id:   sessionId ?? null,
      name,
      contact,
      intent_score: intentScore,
      intent_level: intentLvl,
      stage:        'oportunidad',
      ip,
      ua,
    })

    if (sessionId) {
      await supabase
        .from('sessions')
        .update({ intent_score: intentScore, intent_level: 'hot', updated_at: new Date().toISOString() })
        .eq('id', sessionId)
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
