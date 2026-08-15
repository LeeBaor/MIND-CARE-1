import { NextResponse } from 'next/server'
import { registerAccount } from '@/lib/auth-store'

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json().catch(() => ({}))
  if (!name?.trim() || !email?.trim() || !password) return NextResponse.json({ message: 'Vui lòng điền đầy đủ thông tin.' }, { status: 400 })
  if (password.length < 4) return NextResponse.json({ message: 'Mật khẩu cần có ít nhất 4 ký tự.' }, { status: 400 })
  const normalizedRole = role === 'counselor' ? 'counselor' : role === 'admin' ? 'admin' : 'student'

  try {
    const registered = await registerAccount(name, email, password, normalizedRole)
    if (!registered) return NextResponse.json({ message: 'Email này đã được đăng ký.' }, { status: 409 })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('[MIND-CARE REGISTER]', error)
    return NextResponse.json({ message: 'Không thể xử lý tạo tài khoản.' }, { status: 500 })
  }
}

