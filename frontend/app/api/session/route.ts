import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/session
// Creates a new session and returns its id.
// Called once per page load before any tracking events.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const ip     = req.headers.get('x-forwarded-for') ?? 'unknown'
    const ua     = req.headers.get('user-agent') ?? ''
    const source = (body.source as string | undefined) ?? 'direct'

    const { data, error } = await supabase
      .from('sessions')
      .insert({ ip, ua, source })
      .select('id')
      .single()

    if (error || !data) throw error

    return NextResponse.json({ sessionId: data.id })
  } catch {
    return NextResponse.json({ sessionId: null }, { status: 500 })
  }
}
