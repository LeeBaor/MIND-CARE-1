export type SessionRole = 'student' | 'counselor' | 'admin'

export type Session = {
  userId: string
  email: string
  role: SessionRole
  expiresAt: number
}

const encoder = new TextEncoder()

function secret() {
  const value = process.env.AUTH_SECRET
  if (!value && process.env.NODE_ENV === 'production') throw new Error('AUTH_SECRET_NOT_CONFIGURED')
  return value || 'mind-care-local-development-secret-change-me'
}

function toBase64Url(value: Uint8Array | string) {
  const binary = typeof value === 'string' ? value : String.fromCharCode(...value)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  return atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='))
}

async function signature(payload: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return toBase64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload))))
}

export async function createSessionToken(session: Session) {
  const payload = toBase64Url(JSON.stringify(session))
  return `${payload}.${await signature(payload)}`
}

export async function readSessionToken(token?: string | null): Promise<Session | null> {
  if (!token) return null
  const [payload, suppliedSignature] = token.split('.')
  if (!payload || !suppliedSignature || suppliedSignature !== await signature(payload)) return null

  try {
    const session = JSON.parse(fromBase64Url(payload)) as Session
    return session.userId && session.expiresAt > Date.now() ? session : null
  } catch {
    return null
  }
}
