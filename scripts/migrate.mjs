import { readFile } from 'node:fs/promises'
import process from 'node:process'
import sql from 'mssql'

const required = ['DB_SERVER', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']
const missing = required.filter((key) => !process.env[key])
if (missing.length) { console.error(`Thiếu cấu hình: ${missing.join(', ')}`); process.exit(1) }

const config = {
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT || '14330'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: { encrypt: false, trustServerCertificate: true },
}

let pool
try {
  pool = await sql.connect(config)
  await pool.request().query("IF OBJECT_ID('mindcare_migrations','U') IS NULL CREATE TABLE mindcare_migrations(name nvarchar(255) PRIMARY KEY,applied_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME())")
  const name = '0001_mindcare.sql'
  const existing = await pool.request().input('name', sql.NVarChar(255), name).query('SELECT name FROM mindcare_migrations WHERE name=@name')
  if (existing.recordset.length) console.log(`${name} đã được áp dụng.`)
  else {
    const migration = await readFile(new URL(`../database/migrations/${name}`, import.meta.url), 'utf8')
    const transaction = new sql.Transaction(pool); await transaction.begin()
    try { await new sql.Request(transaction).batch(migration); await new sql.Request(transaction).input('name', sql.NVarChar(255), name).query('INSERT INTO mindcare_migrations(name) VALUES(@name)'); await transaction.commit(); console.log(`Đã áp dụng ${name}.`) }
    catch (error) { await transaction.rollback(); throw error }
  }
} catch (error) { console.error('Migration thất bại:', error.message); process.exitCode = 1 }
finally { if (pool) await pool.close() }
