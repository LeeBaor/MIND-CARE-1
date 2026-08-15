import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getDb, sql } from '@/lib/db'
import { getOrEnsureDbUserId } from '@/lib/db-user'
import { readSessionToken } from '@/lib/session'

async function session() { return readSessionToken((await cookies()).get('auth_session')?.value) }
export async function GET() {
  const current=await session(); if(!current) return NextResponse.json({message:'Bạn cần đăng nhập.'},{status:401})
  try {
    const pool = await getDb()
    const dbUserId = await getOrEnsureDbUserId(pool, current)
    const result = await pool.request().input('id',sql.UniqueIdentifier,dbUserId).query('SELECT id,full_name,birth_date,identity_number,phone FROM family_members WHERE user_id=@id ORDER BY created_at'); return NextResponse.json(result.recordset.map(row=>({id:row.id,name:row.full_name,dob:row.birth_date,cccd:row.identity_number||'',phone:row.phone})))
  } catch { return NextResponse.json({message:'Không thể tải danh sách người thân.'},{status:503}) }
}
export async function POST(request:Request) {
  const current=await session(); if(!current) return NextResponse.json({message:'Bạn cần đăng nhập.'},{status:401}); const body=await request.json().catch(()=>({})); if(!body.name?.trim()||!body.dob||!body.phone?.trim()) return NextResponse.json({message:'Vui lòng điền đủ thông tin bắt buộc.'},{status:400})
  try {
    const pool = await getDb()
    const dbUserId = await getOrEnsureDbUserId(pool, current)
    const id=randomUUID(); await pool.request().input('id',sql.UniqueIdentifier,id).input('userId',sql.UniqueIdentifier,dbUserId).input('name',sql.NVarChar(255),body.name.trim()).input('dob',sql.Date,body.dob).input('identity',sql.NVarChar(30),body.cccd?.trim()||null).input('phone',sql.NVarChar(30),body.phone.trim()).query('INSERT INTO family_members(id,user_id,full_name,birth_date,identity_number,phone) VALUES(@id,@userId,@name,@dob,@identity,@phone)'); return NextResponse.json({id,name:body.name.trim(),dob:body.dob,cccd:body.cccd||'',phone:body.phone.trim()},{status:201})
  } catch { return NextResponse.json({message:'Không thể thêm người thân.'},{status:503}) }
}
