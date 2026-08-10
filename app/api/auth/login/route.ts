import { NextResponse } from 'next/server'
import { verifyAccount } from '@/lib/auth-store'

const anonymousId = () => `GSC-${crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase()}`

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json()
    const normalizedRole = role === 'counselor' || role === 'admin' ? 'counselor' : 'student'
    const account = verifyAccount(email || '', password || '', normalizedRole)
    if (!account) {
      return NextResponse.json({ message: 'Thông tin đăng nhập không chính xác.' }, { status: 401 })
    }

    const studentAnonymousId = normalizedRole === 'student' ? anonymousId() : undefined
    const response = NextResponse.json({ success: true, role: normalizedRole, anonymousId: studentAnonymousId })
    // The header is a client component and needs these display values to
    // immediately switch from the sign-in actions to the signed-in profile.
    // They contain no credential or secret; authentication is still enforced
    // by protected server routes rather than by trusting these values alone.
    const common = { httpOnly: false, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 8 }
    response.cookies.set('is_logged_in', 'true', common)
    response.cookies.set('user_role', normalizedRole, common)
    response.cookies.set('user_name', account.name, common)
    response.cookies.set('user_email', email.trim().toLowerCase(), common)
    if (studentAnonymousId) response.cookies.set('anonymous_id', studentAnonymousId, common)
    return response
  } catch {
    return NextResponse.json({ message: 'Không thể xử lý yêu cầu đăng nhập.' }, { status: 400 })
  }
}
