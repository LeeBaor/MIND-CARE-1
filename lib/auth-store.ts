import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

type Role = 'student' | 'counselor'
type Account = { name: string; passwordHash: string; role: Role }

// API routes can run in different workers, so an in-memory Map makes an
// account created by /register invisible to /login. Keep the demo accounts in
// a small local data file instead. The file is ignored by Git and is created
// only after the first registration.
const dataDirectory = join(process.cwd(), 'data')
const accountsFile = join(dataDirectory, 'mind-care-accounts.json')

function readAccounts(): Record<string, Account> {
  if (!existsSync(accountsFile)) return {}

  try {
    const parsed: unknown = JSON.parse(readFileSync(accountsFile, 'utf8'))
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as Record<string, Account>
      : {}
  } catch {
    return {}
  }
}

function saveAccounts(accounts: Record<string, Account>) {
  if (!existsSync(dataDirectory)) mkdirSync(dataDirectory, { recursive: true })
  writeFileSync(accountsFile, JSON.stringify(accounts, null, 2), 'utf8')
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function passwordMatches(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) return false

  const expected = Buffer.from(hash, 'hex')
  const actual = scryptSync(password, salt, 64)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export function registerAccount(name: string, email: string, password: string, role: Role) {
  const key = email.trim().toLowerCase()
  const accounts = readAccounts()
  if (accounts[key]) return false

  accounts[key] = { name: name.trim(), passwordHash: hashPassword(password), role }
  saveAccounts(accounts)
  return true
}

export function verifyAccount(email: string, password: string, role: Role) {
  const account = readAccounts()[email.trim().toLowerCase()]
  return account && passwordMatches(password, account.passwordHash) && account.role === role ? account : undefined
}
