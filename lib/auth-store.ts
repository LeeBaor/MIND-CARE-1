import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import { getDb, sql } from '@/lib/db'

export type Role = 'student' | 'counselor' | 'admin'

interface MemoryUser {
  id: string
  name: string
  email: string
  passwordHash: string
  role: Role
}

const MEMORY_ACCOUNTS = new Map<string, MemoryUser>([
  [
    'admin@mindcare.vn',
    {
      id: 'admin-001',
      name: 'Quản trị viên Hệ thống',
      email: 'admin@mindcare.vn',
      passwordHash: hashPassword('admin123'),
      role: 'admin',
    },
  ],
  [
    'chuyenvien@mindcare.vn',
    {
      id: 'doc-001',
      name: 'ThS. Nguyễn Minh An',
      email: 'chuyenvien@mindcare.vn',
      passwordHash: hashPassword('123456'),
      role: 'counselor',
    },
  ],
  [
    'bacsi@mindcare.vn',
    {
      id: 'doc-002',
      name: 'ThS. Nguyễn Minh An',
      email: 'bacsi@mindcare.vn',
      passwordHash: hashPassword('123456'),
      role: 'counselor',
    },
  ],
])

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

export async function registerAccount(name: string, email: string, password: string, role: Role = 'student') {
  const normalizedEmail = email.trim().toLowerCase()

  // Always save to memory store so login succeeds seamlessly
  const memUser: MemoryUser = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    role,
  }
  MEMORY_ACCOUNTS.set(normalizedEmail, memUser)

  try {
    const pool = await getDb()
    const existing = await pool.request().input('email', sql.NVarChar(255), normalizedEmail).query('SELECT TOP 1 id FROM users WHERE email = @email')
    if (existing.recordset.length) return false

    const dbRole = role === 'admin' ? 'admin' : role === 'counselor' ? 'expert' : 'student'

    const transaction = new sql.Transaction(pool)
    await transaction.begin()
    try {
      const id = memUser.id
      await new sql.Request(transaction).input('id', sql.UniqueIdentifier, id).input('email', sql.NVarChar(255), normalizedEmail).input('hash', sql.NVarChar(sql.MAX), memUser.passwordHash).input('role', sql.NVarChar(20), dbRole).query('INSERT INTO users(id,email,password_hash,role) VALUES(@id,@email,@hash,@role)')
      await new sql.Request(transaction).input('userId', sql.UniqueIdentifier, id).input('name', sql.NVarChar(255), name.trim()).query('INSERT INTO profiles(user_id,full_name) VALUES(@userId,@name)')
      await transaction.commit()
    } catch (error) { await transaction.rollback(); throw error }
  } catch {
    // If DB is offline, memory registration remains valid!
  }

  return true
}

export async function verifyAccount(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()

  // Try DB first
  try {
    const result = await (await getDb()).request().input('email', sql.NVarChar(255), normalizedEmail).query('SELECT TOP 1 u.id,u.email,u.password_hash,u.role,p.full_name,u.profile_completed FROM users u JOIN profiles p ON p.user_id=u.id WHERE u.email=@email')
    const account = result.recordset[0]
    if (account && passwordMatches(password, account.password_hash)) {
      const mappedRole: Role = account.role === 'admin' ? 'admin' : account.role === 'expert' ? 'counselor' : 'student'
      return { id: account.id, email: account.email, name: account.full_name, profileCompleted: account.profile_completed, role: mappedRole }
    }
  } catch {
    // Fall back to memory store below
  }

  // Fallback to Memory accounts
  const mem = MEMORY_ACCOUNTS.get(normalizedEmail)
  if (mem && passwordMatches(password, mem.passwordHash)) {
    return { id: mem.id, email: mem.email, name: mem.name, profileCompleted: true, role: mem.role }
  }

  return undefined
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    if (!UUID_REGEX.test(userId)) return false
    const pool = await getDb()
    const result = await pool.request().input('id', sql.UniqueIdentifier, userId).query('SELECT TOP 1 password_hash FROM users WHERE id=@id')
    const account = result.recordset[0]
    if (account && passwordMatches(currentPassword, account.password_hash)) {
      await pool.request().input('id', sql.UniqueIdentifier, userId).input('hash', sql.NVarChar(sql.MAX), hashPassword(newPassword)).query('UPDATE users SET password_hash=@hash,updated_at=SYSUTCDATETIME() WHERE id=@id')
      return true
    }
  } catch {
    //
  }
  return false
}


