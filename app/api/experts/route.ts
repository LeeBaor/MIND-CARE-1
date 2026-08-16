import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export interface ExpertOption {
  id: string
  name: string
  specialty?: string
  email: string
}

const DEFAULT_EXPERTS: ExpertOption[] = [
  { id: 'exp-1', name: 'ThS. Nguyễn Minh An', specialty: 'Tư vấn Trầm cảm & Lo âu', email: 'minhan@mindcare.vn' },
  { id: 'exp-2', name: 'BS. Trần Thu Hà', specialty: 'Tâm lý Học đường & Giới trẻ', email: 'thuha@mindcare.vn' },
  { id: 'exp-3', name: 'Chuyên gia Lê Gia Hân', specialty: 'Tâm lý Hôn nhân & Gia đình', email: 'giahan@mindcare.vn' },
  { id: 'exp-4', name: 'Đặng Hiếu', specialty: 'Rối loạn Giấc ngủ & Stress', email: 'danghieu@mindcare.vn' },
]

export async function GET() {
  try {
    const pool = await getDb()
    const result = await pool.request().query(
      `SELECT u.id, p.full_name, e.specialty, u.email 
       FROM users u 
       JOIN profiles p ON p.user_id = u.id 
       LEFT JOIN experts e ON e.user_id = u.id 
       WHERE u.role IN ('expert', 'counselor')`
    )

    const dbExperts: ExpertOption[] = result.recordset.map((row) => ({
      id: row.id,
      name: row.full_name,
      specialty: row.specialty || undefined,
      email: row.email,
    }))

    const combined = [...dbExperts]
    DEFAULT_EXPERTS.forEach((def) => {
      if (!combined.some((e) => e.name.trim().toLowerCase() === def.name.trim().toLowerCase())) {
        combined.push(def)
      }
    })

    return NextResponse.json(combined)
  } catch (error) {
    console.error('[MIND-CARE GET EXPERTS]', error)
    return NextResponse.json(DEFAULT_EXPERTS)
  }
}
