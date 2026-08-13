import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { changePassword } from '@/lib/auth-store'
import { readSessionToken } from '@/lib/session'

export async function POST(request: Request) {
  const session = await readSessionToken((await cookies()).get('auth_session')?.value)
  if (!session) return NextResponse.json({ message: 'Bạn cần đăng nhập.' }, { status: 401 })
  const { currentPassword, newPassword } = await request.json().catch(() => ({}))
  if (!currentPassword || !newPassword || newPassword.length < 8) return NextResponse.json({ message: 'Mật khẩu mới cần có ít nhất 8 ký tự.' }, { status: 400 })
  try {
    if (!await changePassword(session.userId, currentPassword, newPassword)) return NextResponse.json({ message: 'Mật khẩu hiện tại không chính xác.' }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[MIND-CARE PASSWORD]', error)
    return NextResponse.json({ message: 'Không thể đổi mật khẩu.' }, { status: 503 })
  }
}
