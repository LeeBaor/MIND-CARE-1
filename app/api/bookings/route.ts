import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getDb, sql } from '@/lib/db'
import { readSessionToken } from '@/lib/session'

export async function POST(request:Request) {
  const session=await readSessionToken((await cookies()).get('auth_session')?.value); if(!session) return NextResponse.json({message:'Bạn cần đăng nhập.'},{status:401})
  try { const booking=await request.json(); const scheduledAt=new Date(booking.scheduledAt); if(!booking.patientName?.trim()||!booking.patientPhone?.trim()||!booking.selectedCounselor?.trim()||Number.isNaN(scheduledAt.getTime())) return NextResponse.json({message:'Thông tin lịch hẹn chưa hợp lệ.'},{status:400}); const id=randomUUID(); const notes=JSON.stringify({patientName:booking.patientName.trim(),phone:booking.patientPhone.trim(),specialty:booking.selectedSpecialty,symptoms:booking.symptoms||''}); await (await getDb()).request().input('id',sql.UniqueIdentifier,id).input('userId',sql.UniqueIdentifier,session.userId).input('expertName',sql.NVarChar(255),booking.selectedCounselor.trim()).input('scheduledAt',sql.DateTime2,scheduledAt).input('mode',sql.NVarChar(20),booking.mode==='offline'?'offline':'online').input('notes',sql.NVarChar(sql.MAX),notes).query('INSERT INTO appointments(id,user_id,expert_name,scheduled_at,mode,notes) VALUES(@id,@userId,@expertName,@scheduledAt,@mode,@notes)'); return NextResponse.json({ok:true,bookingId:id},{status:201}) } catch(error) { console.error('[MIND-CARE BOOKING]',error); return NextResponse.json({message:'Không thể lưu lịch hẹn vào database.'},{status:503}) }
}
