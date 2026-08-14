'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, User, ShieldCheck, Lock, Mail, ArrowRight, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<'patient' | 'counselor'>('patient')
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

    const response = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, role }) })
    setLoading(false)
    if (!response.ok) { const data = await response.json(); setError(data.message || 'Không thể đăng ký tài khoản.'); return }
    router.push('/login?registered=success')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => router.push('/login')}>
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
          <h1 className="text-2xl font-heading font-extrabold text-teal-900 mb-1">Tạo tài khoản mới</h1>
          <p className="text-slate-500 text-xs font-medium">
            Đăng ký để khám tư vấn & theo dõi sức khỏe tâm lý cùng Mind Care
          </p>
        </div>

        {/* Role Switcher */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1.5 rounded-2xl mb-6 border border-slate-200/80">
          <button
            type="button"
            onClick={() => { setRole('patient'); setError('') }}
            className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              role === 'patient'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 hover:text-teal-700'
            }`}
          >
            <User className="w-4 h-4" /> Bệnh nhân / Người dùng
          </button>
          <button
            type="button"
            onClick={() => { setRole('counselor'); setError('') }}
            className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              role === 'counselor'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 hover:text-teal-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Chuyên viên / Bác sĩ
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">Họ và tên</label>
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

          {role === 'counselor' && <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">Mã mời chuyên viên</label>
            <div className="relative"><ShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="password" required value={formData.inviteCode} onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-10 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-600 focus:bg-white" placeholder="Nhập mã do quản trị viên cung cấp" /></div>
          </div>}

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
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

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
