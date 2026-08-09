import { NextResponse } from 'next/server'
import { registerAccount } from '@/lib/auth-store'

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json().catch(() => ({}))
  if (!name?.trim() || !email?.trim() || !password) return NextResponse.json({ message: 'Vui lòng điền đầy đủ thông tin.' }, { status: 400 })
  if (password.length < 6) return NextResponse.json({ message: 'Mật khẩu cần có ít nhất 6 ký tự.' }, { status: 400 })
  const normalizedRole = role === 'counselor' ? 'counselor' : 'student'
  if (!registerAccount(name, email, password, normalizedRole)) return NextResponse.json({ message: 'Email hoặc mã học sinh này đã được đăng ký.' }, { status: 409 })
  return NextResponse.json({ success: true }, { status: 201 })
}
