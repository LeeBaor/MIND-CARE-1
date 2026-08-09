import { NextResponse } from 'next/server'

// Integration point for Pusher/SSE. Replace this audit sink with a database and
// publish to the configured provider in production.
export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}))
  const alert = { id: crypto.randomUUID(), type: 'SOS', severity: 'RED', createdAt: new Date().toISOString(), ...payload }
  console.warn('[MIND-CARE SOS]', JSON.stringify(alert))
  return NextResponse.json({ ok: true, alert })
}
