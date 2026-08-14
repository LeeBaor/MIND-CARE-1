import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getDb, sql } from '@/lib/db'
import { readSessionToken } from '@/lib/session'

async function session() { return readSessionToken((await cookies()).get('auth_session')?.value) }

export async function GET() {
  const current = await session()
  if (!current) return NextResponse.json({ message: 'Bạn cần đăng nhập.' }, { status: 401 })
  try {
    const result = await (await getDb()).request().input('id', sql.UniqueIdentifier, current.userId).query('SELECT TOP 1 u.email,u.profile_completed,p.full_name,p.birth_date,p.gender,p.phone,p.school_class,p.emergency_contact FROM users u JOIN profiles p ON p.user_id=u.id WHERE u.id=@id')
    const row = result.recordset[0]
    if (!row) return NextResponse.json({ message: 'Không tìm thấy hồ sơ.' }, { status: 404 })
    return NextResponse.json({ email: row.email, profileCompleted: row.profile_completed, fullName: row.full_name, birthDate: row.birth_date, gender: row.gender, phone: row.phone, schoolClass: row.school_class, emergencyContact: row.emergency_contact ? JSON.parse(row.emergency_contact) : null })
  } catch (error) { console.error('[MIND-CARE PROFILE GET]', error); return NextResponse.json({ message: 'Không thể tải hồ sơ.' }, { status: 503 }) }
}

export async function PATCH(request: Request) {
  const current = await session()
  if (!current) return NextResponse.json({ message: 'Bạn cần đăng nhập.' }, { status: 401 })
  try {
    const body = await request.json()
    if (!body.fullName?.trim()) return NextResponse.json({ message: 'Họ và tên không được để trống.' }, { status: 400 })
    const pool = await getDb()
    const transaction = new sql.Transaction(pool); await transaction.begin()
    try {
      await new sql.Request(transaction).input('id', sql.UniqueIdentifier, current.userId).input('name', sql.NVarChar(255), body.fullName.trim()).input('phone', sql.NVarChar(30), body.phone?.trim() || null).input('birthDate', sql.Date, body.birthDate || null).input('gender', sql.NVarChar(30), body.gender?.trim() || null).input('schoolClass', sql.NVarChar(50), body.schoolClass?.trim() || null).input('emergency', sql.NVarChar(sql.MAX), body.emergencyContact ? JSON.stringify(body.emergencyContact) : null).query('UPDATE profiles SET full_name=@name,phone=@phone,birth_date=@birthDate,gender=@gender,school_class=@schoolClass,emergency_contact=@emergency WHERE user_id=@id')
      await new sql.Request(transaction).input('id', sql.UniqueIdentifier, current.userId).query('UPDATE users SET profile_completed=1,updated_at=SYSUTCDATETIME() WHERE id=@id')
      await transaction.commit()
    } catch (error) { await transaction.rollback(); throw error }
    const response = NextResponse.json({ success: true }); response.cookies.set('user_name', body.fullName.trim(), { httpOnly: false, sameSite: 'lax', secure: process.env.COOKIE_SECURE === 'true', path: '/', maxAge: 28800 }); return response
  } catch (error) { console.error('[MIND-CARE PROFILE PATCH]', error); return NextResponse.json({ message: 'Không thể cập nhật hồ sơ.' }, { status: 503 }) }
}
