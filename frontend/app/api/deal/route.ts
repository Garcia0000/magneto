import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { leadId, value, notes } = await req.json()

    if (!leadId) return NextResponse.json({ error: 'leadId requerido' }, { status: 400 })

    // Create deal
    await supabase.from('deals').insert({
      lead_id:   leadId,
      value:     value ?? 0,
      notes:     notes ?? null,
      closed_at: new Date().toISOString(),
    })

    // Mark lead as venta
    await supabase.from('leads').update({ stage: 'venta' }).eq('id', leadId)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
