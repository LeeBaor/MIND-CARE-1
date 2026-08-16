import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { registerAccount } from '@/lib/auth-store'
import { readSessionToken } from '@/lib/session'

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json().catch(() => ({}))
  if (!name?.trim() || !email?.trim() || !password) return NextResponse.json({ message: 'Vui lòng điền đầy đủ thông tin.' }, { status: 400 })
  if (password.length < 4) return NextResponse.json({ message: 'Mật khẩu cần có ít nhất 4 ký tự.' }, { status: 400 })
  const session = await readSessionToken((await cookies()).get('auth_session')?.value)
  let normalizedRole: 'student' | 'counselor' = 'student'

  if (role === 'counselor') {
    if (session?.role !== 'admin') {
      return NextResponse.json({ message: 'Chỉ quản trị viên mới có thể tạo tài khoản bác sĩ.' }, { status: 403 })
    }
    normalizedRole = 'counselor'
  } else if (role && role !== 'student') {
    return NextResponse.json({ message: 'Vai trò tài khoản không hợp lệ.' }, { status: 400 })
  }

  try {
    const registered = await registerAccount(name, email, password, normalizedRole)
    if (!registered) return NextResponse.json({ message: 'Email này đã được đăng ký.' }, { status: 409 })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('[MIND-CARE REGISTER]', error)
    return NextResponse.json({ message: 'Không thể xử lý tạo tài khoản.' }, { status: 500 })
  }
}

