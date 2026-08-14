import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getDb, sql } from '@/lib/db'
import { readSessionToken } from '@/lib/session'

async function currentSession() { return readSessionToken((await cookies()).get('auth_session')?.value) }

export async function GET(request: Request) {
  const session = await currentSession()
  if (!session) return NextResponse.json({ message: 'Bạn cần đăng nhập.' }, { status: 401 })
  const date = new URL(request.url).searchParams.get('date')
  if (!date) return NextResponse.json({ message: 'Thiếu ngày thực hiện.' }, { status: 400 })
  try {
    const result = await (await getDb()).request().input('userId', sql.UniqueIdentifier, session.userId).input('date', sql.Date, date).query('SELECT TOP 1 * FROM daily_practice_logs WHERE user_id=@userId AND practice_date=@date')
    const row = result.recordset[0]
    if (!row) return NextResponse.json({})
    return NextResponse.json({ breatheStartedAt: row.breathe_started_at, breatheCompletedAt: row.breathe_completed_at, breatheSeconds: row.breathe_seconds, journal: row.journal || '', journalCompleted: row.journal_completed, sleepStartedAt: row.sleep_started_at, sleepCompletedAt: row.sleep_completed_at, sleepMinutes: row.sleep_minutes })
  } catch (error) { console.error('[MIND-CARE DAILY PRACTICES GET]', error); return NextResponse.json({ message: 'Không thể tải bài tập hằng ngày.' }, { status: 503 }) }
}

export async function PUT(request: Request) {
  const session = await currentSession()
  if (!session) return NextResponse.json({ message: 'Bạn cần đăng nhập.' }, { status: 401 })
  try {
    const body = await request.json()
    if (!body.practiceDate) return NextResponse.json({ message: 'Thiếu ngày thực hiện.' }, { status: 400 })
    const seconds = body.breatheSeconds == null ? null : 60
    const sleepMinutes = body.sleepMinutes == null ? null : Math.max(1, Number(body.sleepMinutes))
    await (await getDb()).request()
      .input('id', sql.UniqueIdentifier, randomUUID()).input('userId', sql.UniqueIdentifier, session.userId).input('date', sql.Date, body.practiceDate)
      .input('breatheStart', sql.DateTime2, body.breatheStartedAt ? new Date(body.breatheStartedAt) : null).input('breatheEnd', sql.DateTime2, body.breatheCompletedAt ? new Date(body.breatheCompletedAt) : null).input('breatheSeconds', sql.Int, seconds)
      .input('journal', sql.NVarChar(sql.MAX), body.journal?.trim() || null).input('journalCompleted', sql.Bit, Boolean(body.journalCompleted))
      .input('sleepStart', sql.DateTime2, body.sleepStartedAt ? new Date(body.sleepStartedAt) : null).input('sleepEnd', sql.DateTime2, body.sleepCompletedAt ? new Date(body.sleepCompletedAt) : null).input('sleepMinutes', sql.Int, sleepMinutes)
      .query(`MERGE daily_practice_logs AS target USING (SELECT @userId user_id,@date practice_date) AS source ON target.user_id=source.user_id AND target.practice_date=source.practice_date WHEN MATCHED THEN UPDATE SET breathe_started_at=@breatheStart,breathe_completed_at=@breatheEnd,breathe_seconds=@breatheSeconds,journal=@journal,journal_completed=@journalCompleted,sleep_started_at=@sleepStart,sleep_completed_at=@sleepEnd,sleep_minutes=@sleepMinutes,updated_at=SYSUTCDATETIME() WHEN NOT MATCHED THEN INSERT(id,user_id,practice_date,breathe_started_at,breathe_completed_at,breathe_seconds,journal,journal_completed,sleep_started_at,sleep_completed_at,sleep_minutes) VALUES(@id,@userId,@date,@breatheStart,@breatheEnd,@breatheSeconds,@journal,@journalCompleted,@sleepStart,@sleepEnd,@sleepMinutes);`)
    return NextResponse.json({ success: true })
  } catch (error) { console.error('[MIND-CARE DAILY PRACTICES PUT]', error); return NextResponse.json({ message: 'Không thể lưu bài tập hằng ngày.' }, { status: 503 }) }
}
