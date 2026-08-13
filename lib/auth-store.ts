import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import { getDb, sql } from '@/lib/db'

type Role = 'student' | 'counselor'

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
}

function passwordMatches(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) return false
  const expected = Buffer.from(hash, 'hex')
  const actual = scryptSync(password, salt, 64)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export async function registerAccount(name: string, email: string, password: string, role: Role) {
  const pool = await getDb()
  const normalizedEmail = email.trim().toLowerCase()
  const existing = await pool.request().input('email', sql.NVarChar(255), normalizedEmail).query('SELECT TOP 1 id FROM users WHERE email = @email')
  if (existing.recordset.length) return false

  const transaction = new sql.Transaction(pool)
  await transaction.begin()
  try {
    const id = randomUUID()
    await new sql.Request(transaction).input('id', sql.UniqueIdentifier, id).input('email', sql.NVarChar(255), normalizedEmail).input('hash', sql.NVarChar(sql.MAX), hashPassword(password)).input('role', sql.NVarChar(20), role === 'counselor' ? 'expert' : 'student').query('INSERT INTO users(id,email,password_hash,role) VALUES(@id,@email,@hash,@role)')
    await new sql.Request(transaction).input('userId', sql.UniqueIdentifier, id).input('name', sql.NVarChar(255), name.trim()).query('INSERT INTO profiles(user_id,full_name) VALUES(@userId,@name)')
    await transaction.commit()
  } catch (error) { await transaction.rollback(); throw error }
  return true
}

export async function verifyAccount(email: string, password: string, role: Role) {
  const result = await (await getDb()).request().input('email', sql.NVarChar(255), email.trim().toLowerCase()).query('SELECT TOP 1 u.id,u.email,u.password_hash,u.role,p.full_name,u.profile_completed FROM users u JOIN profiles p ON p.user_id=u.id WHERE u.email=@email')
  const account = result.recordset[0]
  const expectedRole = role === 'counselor' ? 'expert' : 'student'
  if (!account || account.role !== expectedRole || !passwordMatches(password, account.password_hash)) return undefined
  return { id: account.id, email: account.email, name: account.full_name, profileCompleted: account.profile_completed, role }
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const pool = await getDb()
  const result = await pool.request().input('id', sql.UniqueIdentifier, userId).query('SELECT TOP 1 password_hash FROM users WHERE id=@id')
  const account = result.recordset[0]
  if (!account || !passwordMatches(currentPassword, account.password_hash)) return false
  await pool.request().input('id', sql.UniqueIdentifier, userId).input('hash', sql.NVarChar(sql.MAX), hashPassword(newPassword)).query('UPDATE users SET password_hash=@hash,updated_at=SYSUTCDATETIME() WHERE id=@id')
  return true
}
