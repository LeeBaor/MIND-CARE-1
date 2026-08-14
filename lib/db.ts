import sql from 'mssql'

declare global {
  var mindCareSqlPool: Promise<sql.ConnectionPool> | undefined
}

function configuration(): sql.config {
  const server = process.env.DB_SERVER
  const port = process.env.DB_PORT || '14330'
  const user = process.env.DB_USER
  const password = process.env.DB_PASSWORD
  const database = process.env.DB_NAME
  if (!server || !user || !password || !database) throw new Error('SQLSERVER_NOT_CONFIGURED')
  return {
    server,
    port: Number(port),
    user,
    password,
    database,
    pool: { min: 0, max: 10, idleTimeoutMillis: 30_000 },
    options: { encrypt: false, trustServerCertificate: true },
  }
}

export function getDb() {
  if (!globalThis.mindCareSqlPool) globalThis.mindCareSqlPool = new sql.ConnectionPool(configuration()).connect()
  return globalThis.mindCareSqlPool
}

export { sql }
