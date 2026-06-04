import { NextRequest, NextResponse } from 'next/server'
import { appendFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const { name, contact } = await req.json()

    if (!name || !contact) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const dataDir = path.join(process.cwd(), 'data')
    await mkdir(dataDir, { recursive: true })

    const line = JSON.stringify({
      name,
      contact,
      ip: req.headers.get('x-forwarded-for') ?? 'unknown',
      ua: req.headers.get('user-agent') ?? '',
      ts: new Date().toISOString(),
    })

    await appendFile(path.join(dataDir, 'leads.jsonl'), line + '\n', 'utf8')

    return NextResponse.json({ ok: true })
  } catch {
    // Don't expose internal errors
    return NextResponse.json({ ok: true })
  }
}
