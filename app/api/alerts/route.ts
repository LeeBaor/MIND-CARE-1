import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getDb, sql } from '@/lib/db'
import { getOrEnsureDbUserId } from '@/lib/db-user'
import { readSessionToken } from '@/lib/session'

export async function POST(request:Request) {
  const session=await readSessionToken((await cookies()).get('auth_session')?.value); const payload=await request.json().catch(()=>({}));
  try {
    const pool = await getDb()
    const dbUserId = session ? await getOrEnsureDbUserId(pool, session) : null
    const id=randomUUID(); const createdAt=new Date(); await pool.request().input('id',sql.UniqueIdentifier,id).input('userId',sql.UniqueIdentifier,dbUserId).input('payload',sql.NVarChar(sql.MAX),JSON.stringify(payload)).query('INSERT INTO sos_requests(id,user_id,payload) VALUES(@id,@userId,@payload)'); console.warn('[MIND-CARE SOS]',JSON.stringify({id,userId:dbUserId,createdAt})); return NextResponse.json({ok:true,alert:{id,status:'open',createdAt,payload}})
  } catch(error) { console.error('[MIND-CARE SOS ERROR]',error); return NextResponse.json({message:'Không thể gửi tín hiệu SOS. Hãy gọi 111 nếu bạn đang không an toàn.'},{status:503}) }
}
