import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getDb, sql } from '@/lib/db'
import { readSessionToken } from '@/lib/session'

async function currentSession() { return readSessionToken((await cookies()).get('auth_session')?.value) }
function mapBooking(row: Record<string, unknown>) {
  const notes = JSON.parse(String(row.notes || '{}'))
  const scheduled = new Date(String(row.scheduled_at))
  return { id: row.id, patientName: notes.patientName || row.patient_name, patientEmail: row.patient_email, counselor: row.expert_name, specialty: notes.specialty || '', date: scheduled.toLocaleDateString('vi-VN'), time: scheduled.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }), scheduledAt: scheduled.toISOString(), mode: row.mode, status: row.status === 'completed' ? 'completed' : 'upcoming' }
}

export async function GET() {
  const session = await currentSession(); if (!session) return NextResponse.json({ message: 'Bạn cần đăng nhập.' }, { status: 401 })
  try {
    const request = (await getDb()).request().input('userId', sql.UniqueIdentifier, session.userId)
    const query = session.role === 'counselor'
      ? `SELECT a.*,p.full_name patient_name,u.email patient_email FROM appointments a JOIN users u ON u.id=a.user_id JOIN profiles p ON p.user_id=u.id JOIN profiles cp ON cp.user_id=@userId WHERE a.expert_name=cp.full_name ORDER BY a.scheduled_at DESC`
      : `SELECT a.*,p.full_name patient_name,u.email patient_email FROM appointments a JOIN users u ON u.id=a.user_id JOIN profiles p ON p.user_id=u.id WHERE a.user_id=@userId ORDER BY a.scheduled_at DESC`
    const result = await request.query(query)
    return NextResponse.json(result.recordset.map(mapBooking))
  } catch (error) { console.error('[MIND-CARE BOOKINGS GET]', error); return NextResponse.json({ message: 'Không thể tải lịch hẹn.' }, { status: 503 }) }
}

export async function POST(request: Request) {
  const session = await currentSession(); if (!session) return NextResponse.json({ message: 'Bạn cần đăng nhập.' }, { status: 401 })
  try { const booking=await request.json(); const scheduledAt=new Date(booking.scheduledAt); if(!booking.patientName?.trim()||!booking.patientPhone?.trim()||!booking.selectedCounselor?.trim()||Number.isNaN(scheduledAt.getTime())) return NextResponse.json({message:'Thông tin lịch hẹn chưa hợp lệ.'},{status:400}); const id=randomUUID(); const notes=JSON.stringify({patientName:booking.patientName.trim(),phone:booking.patientPhone.trim(),specialty:booking.selectedSpecialty,symptoms:booking.symptoms||''}); await (await getDb()).request().input('id',sql.UniqueIdentifier,id).input('userId',sql.UniqueIdentifier,session.userId).input('expertName',sql.NVarChar(255),booking.selectedCounselor.trim()).input('scheduledAt',sql.DateTime2,scheduledAt).input('mode',sql.NVarChar(20),booking.mode==='offline'?'offline':'online').input('notes',sql.NVarChar(sql.MAX),notes).query('INSERT INTO appointments(id,user_id,expert_name,scheduled_at,mode,notes) VALUES(@id,@userId,@expertName,@scheduledAt,@mode,@notes)'); return NextResponse.json({ok:true,bookingId:id},{status:201}) } catch(error) { console.error('[MIND-CARE BOOKING]',error); return NextResponse.json({message:'Không thể lưu lịch hẹn vào database.'},{status:503}) }
}

export async function PATCH(request: Request) {
  const session = await currentSession(); if (!session || session.role !== 'counselor') return NextResponse.json({ message: 'Bạn không có quyền.' }, { status: 403 })
  const body = await request.json().catch(() => ({})); if (!body.bookingId || !body.summary?.trim()) return NextResponse.json({ message: 'Thiếu lịch hẹn hoặc ghi chú.' }, { status: 400 })
  const pool = await getDb(); const transaction = new sql.Transaction(pool); await transaction.begin()
  try {
    const assigned = await new sql.Request(transaction).input('bookingId', sql.UniqueIdentifier, body.bookingId).input('counselorId', sql.UniqueIdentifier, session.userId).query(`SELECT a.user_id FROM appointments a JOIN profiles p ON p.user_id=@counselorId WHERE a.id=@bookingId AND a.expert_name=p.full_name`)
    if (!assigned.recordset[0]) { await transaction.rollback(); return NextResponse.json({ message: 'Lịch hẹn không thuộc chuyên viên này.' }, { status: 403 }) }
    await new sql.Request(transaction).input('id',sql.UniqueIdentifier,randomUUID()).input('bookingId',sql.UniqueIdentifier,body.bookingId).input('userId',sql.UniqueIdentifier,assigned.recordset[0].user_id).input('counselorId',sql.UniqueIdentifier,session.userId).input('summary',sql.NVarChar(sql.MAX),body.summary.trim()).query(`IF NOT EXISTS(SELECT 1 FROM clinical_records WHERE booking_id=@bookingId) INSERT INTO clinical_records(id,booking_id,user_id,counselor_id,summary) VALUES(@id,@bookingId,@userId,@counselorId,@summary); UPDATE appointments SET status='completed' WHERE id=@bookingId`)
    await transaction.commit(); return NextResponse.json({ success: true })
  } catch (error) { await transaction.rollback(); console.error('[MIND-CARE BOOKING PATCH]', error); return NextResponse.json({ message: 'Không thể hoàn tất buổi khám.' }, { status: 503 }) }
}
