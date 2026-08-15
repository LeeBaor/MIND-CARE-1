import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getDb, sql } from '@/lib/db'
import { readSessionToken } from '@/lib/session'

function formatHHMM(dateObj: Date): string {
  const hours = dateObj.getHours().toString().padStart(2, '0')
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

function formatDateISO(dateObj: Date): string {
  const yyyy = dateObj.getFullYear()
  const mm = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const dd = dateObj.getDate().toString().padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function formatDateVN(dateObj: Date): string {
  const yyyy = dateObj.getFullYear()
  const mm = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const dd = dateObj.getDate().toString().padStart(2, '0')
  return `${dd}/${mm}/${yyyy}`
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const counselor = searchParams.get('counselor')
  const dateParam = searchParams.get('date')
  const action = searchParams.get('action')

  try {
    const pool = await getDb()

    // 1. If checking busy slots for a specific counselor and date
    if (action === 'busySlots' || (counselor && dateParam)) {
      const result = await pool
        .request()
        .input('counselor', sql.NVarChar(255), counselor || '')
        .query(
          `SELECT scheduled_at, status 
           FROM appointments 
           WHERE expert_name = @counselor 
             AND status IN ('pending', 'confirmed')`
        )

      const busySlots: string[] = []
      result.recordset.forEach((row) => {
        const d = new Date(row.scheduled_at)
        const rowIso = formatDateISO(d)
        const rowVn = formatDateVN(d)
        // Match either YYYY-MM-DD or DD/MM/YYYY or dateParam containment
        if (!dateParam || rowIso === dateParam || rowVn === dateParam || dateParam.includes(rowIso) || dateParam.includes(rowVn)) {
          busySlots.push(formatHHMM(d))
        }
      })

      return NextResponse.json({ busySlots })
    }

    // 2. Fetch full appointment list based on user session or counselor filter
    const cookieStore = await cookies()
    const session = await readSessionToken(cookieStore.get('auth_session')?.value)

    let query = ''
    const req = pool.request()

    if (counselor) {
      query = `SELECT a.id, a.user_id, a.expert_name, a.scheduled_at, a.mode, a.status, a.notes 
               FROM appointments a 
               WHERE a.expert_name = @counselor 
               ORDER BY a.scheduled_at DESC`
      req.input('counselor', sql.NVarChar(255), counselor)
    } else if (session) {
      if (session.role === 'counselor') {
        // Find counselor full name from profile
        const profRes = await pool
          .request()
          .input('userId', sql.UniqueIdentifier, session.userId)
          .query(`SELECT full_name FROM profiles WHERE user_id = @userId`)
        const counselorName = profRes.recordset[0]?.full_name || session.email

        query = `SELECT a.id, a.user_id, a.expert_name, a.scheduled_at, a.mode, a.status, a.notes 
                 FROM appointments a 
                 WHERE a.expert_name = @counselorName OR a.user_id = @userId 
                 ORDER BY a.scheduled_at DESC`
        req.input('counselorName', sql.NVarChar(255), counselorName)
        req.input('userId', sql.UniqueIdentifier, session.userId)
      } else {
        query = `SELECT a.id, a.user_id, a.expert_name, a.scheduled_at, a.mode, a.status, a.notes 
                 FROM appointments a 
                 WHERE a.user_id = @userId 
                 ORDER BY a.scheduled_at DESC`
        req.input('userId', sql.UniqueIdentifier, session.userId)
      }
    } else {
      return NextResponse.json({ message: 'Bạn cần đăng nhập.' }, { status: 401 })
    }

    const result = await req.query(query)

    const appointments = result.recordset.map((row) => {
      let parsedNotes: { patientName?: string; phone?: string; specialty?: string; symptoms?: string } = {}
      try {
        if (row.notes) parsedNotes = JSON.parse(row.notes)
      } catch {
        // fallback if notes is plain string
        parsedNotes = { symptoms: row.notes }
      }

      const d = new Date(row.scheduled_at)
      return {
        id: row.id,
        userId: row.user_id,
        patientName: parsedNotes.patientName || 'Bệnh nhân',
        patientPhone: parsedNotes.phone || '',
        counselor: row.expert_name,
        specialty: parsedNotes.specialty || 'Tư vấn Tâm lý',
        symptoms: parsedNotes.symptoms || '',
        scheduledAt: row.scheduled_at,
        date: formatDateVN(d),
        dateIso: formatDateISO(d),
        time: formatHHMM(d),
        mode: row.mode as 'online' | 'offline',
        status: row.status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('[MIND-CARE GET BOOKINGS]', error)
    return NextResponse.json({ message: 'Không thể truy vấn danh sách lịch hẹn.' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  const session = await readSessionToken((await cookies()).get('auth_session')?.value)
  if (!session) return NextResponse.json({ message: 'Bạn cần đăng nhập để đặt lịch.' }, { status: 401 })

  try {
    const booking = await request.json()
    const scheduledAt = new Date(booking.scheduledAt)

    if (
      !booking.patientName?.trim() ||
      !booking.patientPhone?.trim() ||
      !booking.selectedCounselor?.trim() ||
      Number.isNaN(scheduledAt.getTime())
    ) {
      return NextResponse.json({ message: 'Thông tin lịch hẹn chưa hợp lệ.' }, { status: 400 })
    }

    const pool = await getDb()

    // Conflict check: Check if this counselor already has a pending or confirmed booking at exact scheduledAt
    const conflictResult = await pool
      .request()
      .input('expertName', sql.NVarChar(255), booking.selectedCounselor.trim())
      .input('scheduledAt', sql.DateTime2, scheduledAt)
      .query(
        `SELECT TOP 1 id 
         FROM appointments 
         WHERE expert_name = @expertName 
           AND scheduled_at = @scheduledAt 
           AND status IN ('pending', 'confirmed')`
      )

    if (conflictResult.recordset.length > 0) {
      return NextResponse.json(
        { message: 'Khung giờ này đã có bệnh nhân khác đặt với chuyên gia. Vui lòng chọn khung giờ khác.' },
        { status: 409 }
      )
    }

    const id = randomUUID()
    const notes = JSON.stringify({
      patientName: booking.patientName.trim(),
      phone: booking.patientPhone.trim(),
      specialty: booking.selectedSpecialty || '',
      symptoms: booking.symptoms || '',
    })

    await pool
      .request()
      .input('id', sql.UniqueIdentifier, id)
      .input('userId', sql.UniqueIdentifier, session.userId)
      .input('expertName', sql.NVarChar(255), booking.selectedCounselor.trim())
      .input('scheduledAt', sql.DateTime2, scheduledAt)
      .input('mode', sql.NVarChar(20), booking.mode === 'offline' ? 'offline' : 'online')
      .input('notes', sql.NVarChar(sql.MAX), notes)
      .query(
        `INSERT INTO appointments(id, user_id, expert_name, scheduled_at, mode, status, notes) 
         VALUES(@id, @userId, @expertName, @scheduledAt, @mode, 'pending', @notes)`
      )

    return NextResponse.json({ ok: true, bookingId: id }, { status: 201 })
  } catch (error) {
    console.error('[MIND-CARE POST BOOKING]', error)
    return NextResponse.json({ message: 'Không thể lưu lịch hẹn vào database.' }, { status: 503 })
  }
}

export async function PATCH(request: Request) {
  const session = await readSessionToken((await cookies()).get('auth_session')?.value)
  if (!session) return NextResponse.json({ message: 'Bạn cần đăng nhập.' }, { status: 401 })

  try {
    const { bookingId, status } = await request.json()

    if (!bookingId || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json({ message: 'Dữ liệu cập nhật trạng thái không hợp lệ.' }, { status: 400 })
    }

    const pool = await getDb()

    const result = await pool
      .request()
      .input('id', sql.UniqueIdentifier, bookingId)
      .input('status', sql.NVarChar(20), status)
      .query(`UPDATE appointments SET status = @status WHERE id = @id`)

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ message: 'Không tìm thấy lịch hẹn cần cập nhật.' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, bookingId, status })
  } catch (error) {
    console.error('[MIND-CARE PATCH BOOKING]', error)
    return NextResponse.json({ message: 'Không thể cập nhật trạng thái lịch hẹn.' }, { status: 503 })
  }
}

