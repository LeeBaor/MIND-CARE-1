'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, Lock, Mail, ArrowRight, UserPlus, ShieldAlert } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'student', // Always default to patient / student role for self-registration
        }),
      })

      setLoading(false)
      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Không thể đăng ký tài khoản.')
        return
      }
      router.push('/login?registered=success')
    } catch {
      setLoading(false)
      setError('Không thể kết nối máy chủ đăng ký.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => router.push('/')}>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
          <Heart className="w-6 h-6 fill-white/20 stroke-[2.5]" />
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-2xl font-extrabold text-teal-900 tracking-tight">MIND CARE</span>
          <span className="text-[10px] font-bold tracking-wider text-teal-600 uppercase">TƯ VẤN SỨC KHỎE TINH THẦN</span>
        </div>
      </div>

      {/* Register Container Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-heading font-extrabold text-teal-900 mb-1">Đăng ký tài khoản Bệnh nhân</h1>
          <p className="text-slate-500 text-xs font-medium">
            Tạo tài khoản cá nhân để đăng ký lịch hẹn & theo dõi lộ trình chăm sóc sức khỏe
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">Họ và tên Bệnh nhân</label>
            <div className="relative">
              <UserPlus className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-10 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">Email liên hệ</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="nguyenvana@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-10 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-10 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">Xác nhận mật khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-10 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all active:scale-98"
          >
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký Bệnh nhân'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Doctor Notice */}
        <div className="mt-5 rounded-2xl bg-amber-50 p-3.5 border border-amber-200/70 text-left">
          <p className="text-[11px] text-amber-900 font-medium leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Chú ý dành cho Bác sĩ / Chuyên gia:</strong> Tài khoản Chuyên gia được cấp và quản lý trực tiếp bởi Quản trị viên (Admin). Vui lòng dùng tài khoản do Admin cấp để Đăng nhập.
            </span>
          </p>
        </div>

        <p className="text-center text-xs font-medium text-slate-500 mt-6">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-teal-700 hover:underline font-extrabold">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  )
}

