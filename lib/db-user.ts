import { randomUUID } from 'node:crypto'
import { sql } from '@/lib/db'
import type { Session } from '@/lib/session'

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getOrEnsureDbUserId(pool: any, session: Session): Promise<string> {
  const cleanEmail = (session.email || '').trim().toLowerCase()

  // 1. Check if user already exists in database by email
  if (cleanEmail) {
    try {
      const res = await pool
        .request()
        .input('email', cleanEmail)
        .query('SELECT TOP 1 id FROM users WHERE email = @email')
      if (res.recordset.length > 0) {
        return res.recordset[0].id as string
      }
    } catch {
      // Continue fallback below
    }
  }

  // 2. Ensure we have a valid UUID format
  let validUuid = session.userId
  if (!validUuid || !UUID_REGEX.test(validUuid)) {
    validUuid = randomUUID()
  }

  // 3. Ensure user record exists in users and profiles table so FK constraint passes
  const dbRole = session.role === 'admin' ? 'admin' : session.role === 'counselor' ? 'expert' : 'student'
  const userEmail = cleanEmail || `${validUuid.slice(0, 8)}@mindcare.vn`
  const fullName = cleanEmail ? cleanEmail.split('@')[0] : 'Người dùng Mind Care'

  try {
    const transaction = new sql.Transaction(pool)
    await transaction.begin()
    try {
      await new sql.Request(transaction)
        .input('id', validUuid)
        .input('email', userEmail)
        .input('hash', 'DEMO_HASH')
        .input('role', dbRole)
        .query('INSERT INTO users(id, email, password_hash, role) VALUES(@id, @email, @hash, @role)')

      await new sql.Request(transaction)
        .input('userId', validUuid)
        .input('name', fullName)
        .query('INSERT INTO profiles(user_id, full_name) VALUES(@userId, @name)')

      await transaction.commit()
    } catch {
      await transaction.rollback().catch(() => {})
    }
  } catch {
    // Ignore error if user already exists
  }

  return validUuid
}
