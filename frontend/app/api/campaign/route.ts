import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ campaigns: data })
}

export async function POST(req: NextRequest) {
  try {
    const { name, source, adSpend, periodStart, periodEnd } = await req.json()

    if (!name) return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })

    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        name,
        source:       source ?? 'organic',
        ad_spend:     adSpend ?? 0,
        period_start: periodStart ?? null,
        period_end:   periodEnd ?? null,
      })
      .select('id')
      .single()

    if (error) throw error
    return NextResponse.json({ ok: true, id: data.id })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
