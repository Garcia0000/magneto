import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(req: NextRequest) {
  try {
    const { leadId, stage } = await req.json()

    const validStages = ['oportunidad', 'venta']
    if (!leadId || !validStages.includes(stage)) {
      return NextResponse.json({ error: 'leadId y stage válido requeridos' }, { status: 400 })
    }

    await supabase.from('leads').update({ stage }).eq('id', leadId)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
