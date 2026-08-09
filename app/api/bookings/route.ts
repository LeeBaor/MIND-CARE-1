import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const booking = await request.json()
  // In production this is where the appointment and encrypted Case File are persisted.
  return NextResponse.json({ ok: true, bookingId: `MC-${Date.now().toString().slice(-8)}`, caseFileId: `CASE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, ...booking })
}
