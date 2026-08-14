import { NextResponse } from 'next/server'
import { verifyAccount } from '@/lib/auth-store'
import { createSessionToken } from '@/lib/session'

const anonymousId = () => `GSC-${crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase()}`

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json()
    const normalizedRole = role === 'counselor' || role === 'admin' ? 'counselor' : 'student'
    const account = await verifyAccount(email || '', password || '', normalizedRole)
    if (!account) return NextResponse.json({ message: 'Thông tin đăng nhập không chính xác.' }, { status: 401 })

    const studentAnonymousId = normalizedRole === 'student' ? anonymousId() : undefined
    const maxAge = 60 * 60 * 8
    const expiresAt = Date.now() + maxAge * 1000
    const sessionToken = await createSessionToken({ userId: account.id, email: account.email, role: normalizedRole, expiresAt })
    const response = NextResponse.json({ success: true, role: normalizedRole, anonymousId: studentAnonymousId, profileCompleted: account.profileCompleted })
    const common = { sameSite: 'lax' as const, secure: process.env.COOKIE_SECURE === 'true', path: '/', maxAge }
    response.cookies.set('auth_session', sessionToken, { ...common, httpOnly: true })
    response.cookies.set('is_logged_in', 'true', { ...common, httpOnly: false })
    response.cookies.set('user_role', normalizedRole, { ...common, httpOnly: false })
    response.cookies.set('user_name', account.name, { ...common, httpOnly: false })
    response.cookies.set('user_email', account.email, { ...common, httpOnly: false })
    if (studentAnonymousId) response.cookies.set('anonymous_id', studentAnonymousId, { ...common, httpOnly: false })
    return response
  } catch (error) {
    console.error('[MIND-CARE LOGIN]', error)
    return NextResponse.json({ message: 'Không thể kết nối database để đăng nhập.' }, { status: 503 })
  }
}
