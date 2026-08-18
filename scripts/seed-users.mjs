import process from 'node:process'
import { randomBytes, scryptSync, randomUUID } from 'node:crypto'
import sql from 'mssql'

const required = ['DB_SERVER', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']
const missing = required.filter((key) => !process.env[key])
if (missing.length) {
  console.error(`Thiếu cấu hình: ${missing.join(', ')}`)
  process.exit(1)
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
}

const config = {
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT || '14330'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: { encrypt: false, trustServerCertificate: true },
}

const SEED_USERS = [
  {
    email: 'admin@mindcare.vn',
    password: 'admin123',
    name: 'Quản trị viên Hệ thống',
    role: 'admin',
  },
  {
    email: 'bacsi@mindcare.vn',
    password: '123456',
    name: 'ThS. Bác sĩ Nguyễn Minh An',
    role: 'expert',
    specialty: 'Tư vấn Tâm lý & Căng thẳng Học đường',
    yearsExperience: 10,
  },
  {
    email: 'chuyenvien@mindcare.vn',
    password: '123456',
    name: 'ThS. Nguyễn Minh An',
    role: 'expert',
    specialty: 'Tư vấn & Trị liệu Tâm lý',
    yearsExperience: 8,
  },
  {
    email: 'benhnhan@mindcare.vn',
    password: '123456',
    name: 'Nguyễn Văn An (Bệnh nhân Demo)',
    role: 'student',
  },
  {
    email: 'student@mindcare.vn',
    password: '123456',
    name: 'Lê Thị Bình (Học sinh Demo)',
    role: 'student',
  },
]

async function seed() {
  let pool
  try {
    console.log('🔄 Đang kết nối CSDL SQL Server để tạo tài khoản seed...')
    pool = await sql.connect(config)

    for (const u of SEED_USERS) {
      const existing = await pool
        .request()
        .input('email', u.email)
        .query('SELECT TOP 1 id FROM users WHERE email = @email')

      const passwordHash = hashPassword(u.password)

      if (existing.recordset.length > 0) {
        const userId = existing.recordset[0].id
        // Update password hash and profile
        await pool
          .request()
          .input('id', userId)
          .input('hash', passwordHash)
          .query('UPDATE users SET password_hash = @hash, updated_at = SYSUTCDATETIME() WHERE id = @id')

        await pool
          .request()
          .input('userId', userId)
          .input('name', u.name)
          .query('UPDATE profiles SET full_name = @name WHERE user_id = @userId')

        console.log(`✅ Đã cập nhật tài khoản: ${u.email} (${u.role})`)
      } else {
        const userId = randomUUID()
        const transaction = new sql.Transaction(pool)
        await transaction.begin()

        try {
          await new sql.Request(transaction)
            .input('id', userId)
            .input('email', u.email)
            .input('hash', passwordHash)
            .input('role', u.role)
            .query('INSERT INTO users(id, email, password_hash, role, profile_completed) VALUES(@id, @email, @hash, @role, 1)')

          await new sql.Request(transaction)
            .input('userId', userId)
            .input('name', u.name)
            .query('INSERT INTO profiles(user_id, full_name) VALUES(@userId, @name)')

          if (u.role === 'expert') {
            const expertId = randomUUID()
            await new sql.Request(transaction)
              .input('id', expertId)
              .input('userId', userId)
              .input('specialty', u.specialty || 'Tư vấn tâm lý')
              .input('years', u.yearsExperience || 5)
              .query('INSERT INTO experts(id, user_id, specialty, years_experience, verified) VALUES(@id, @userId, @specialty, @years, 1)')
          }

          await transaction.commit()
          console.log(`✨ Đã tạo mới tài khoản: ${u.email} (${u.role})`)
        } catch (err) {
          await transaction.rollback()
          throw err
        }
      }
    }

    console.log('🎉 Hoàn tất khởi tạo danh sách User mẫu!')
  } catch (error) {
    console.error('❌ Khởi tạo user thất bại:', error.message)
  } finally {
    if (pool) await pool.close()
  }
}

seed()
