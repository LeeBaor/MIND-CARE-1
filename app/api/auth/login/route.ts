import { NextResponse } from 'next/server'
import { verifyAccount, type Role } from '@/lib/auth-store'
import { createSessionToken } from '@/lib/session'

const anonymousId = () => `GSC-${crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase()}`

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const cleanEmail = (email || '').trim().toLowerCase()

    let account = await verifyAccount(cleanEmail, password || '').catch(() => undefined)

    // Fallback demo accounts if database is not initialized or for demo testing
    if (!account) {
      if (cleanEmail === 'admin@mindcare.vn' && password === 'admin123') {
        account = { id: 'admin-001', email: 'admin@mindcare.vn', name: 'Quản trị viên Hệ thống', profileCompleted: true, role: 'admin' }
      } else if ((cleanEmail === 'chuyenvien@mindcare.vn' || cleanEmail === 'bacsi@mindcare.vn') && password === '123456') {
        account = { id: 'doc-001', email: cleanEmail, name: 'ThS. Nguyễn Minh An', profileCompleted: true, role: 'counselor' }
      }
    }

    if (!account) return NextResponse.json({ message: 'Thông tin đăng nhập không chính xác.' }, { status: 401 })

    const userRole: Role = account.role
    const studentAnonymousId = userRole === 'student' ? anonymousId() : undefined
    const maxAge = 60 * 60 * 8
    const expiresAt = Date.now() + maxAge * 1000
    const sessionToken = await createSessionToken({ userId: account.id, email: account.email, role: userRole, expiresAt })

    const response = NextResponse.json({
      success: true,
      role: userRole,
      anonymousId: studentAnonymousId,
      profileCompleted: account.profileCompleted,
    })

    const common = { sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/', maxAge }
    response.cookies.set('auth_session', sessionToken, { ...common, httpOnly: true })
    response.cookies.set('is_logged_in', 'true', { ...common, httpOnly: false })
    response.cookies.set('user_role', userRole, { ...common, httpOnly: false })
    response.cookies.set('user_name', account.name, { ...common, httpOnly: false })
    response.cookies.set('user_email', account.email, { ...common, httpOnly: false })
    if (studentAnonymousId) response.cookies.set('anonymous_id', studentAnonymousId, { ...common, httpOnly: false })
    return response
  } catch (error) {
    console.error('[MIND-CARE LOGIN]', error)
    return NextResponse.json({ message: 'Không thể xử lý yêu cầu đăng nhập.' }, { status: 500 })
  }
}

