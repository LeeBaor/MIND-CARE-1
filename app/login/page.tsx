'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Lock, Mail, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      setLoading(false)

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Email hoặc mật khẩu không chính xác.')
        return
      }

      const data = await response.json()
      const requestedPath = new URLSearchParams(window.location.search).get('next')
      const safePath = requestedPath?.startsWith('/') && !requestedPath.startsWith('//') ? requestedPath : undefined

      // Route according to user role
      if (data.role === 'admin') {
        router.push('/admin')
      } else if (data.role === 'counselor') {
        router.push('/counselor')
      } else {
        router.push(safePath || '/dashboard')
      }
      router.refresh()
    } catch {
      setLoading(false)
      setError('Không thể kết nối máy chủ đăng nhập.')
    }
  }

  const handleQuickLogin = async (email: string, pass: string) => {
    setFormData({ email, password: pass })
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      })

      setLoading(false)

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Email hoặc mật khẩu không chính xác.')
        return
      }

      const data = await response.json()
      const requestedPath = new URLSearchParams(window.location.search).get('next')
      const safePath = requestedPath?.startsWith('/') && !requestedPath.startsWith('//') ? requestedPath : undefined

      if (data.role === 'admin') {
        router.push('/admin')
      } else if (data.role === 'counselor') {
        router.push('/counselor')
      } else {
        router.push(safePath || '/dashboard')
      }
      router.refresh()
    } catch {
      setLoading(false)
      setError('Không thể kết nối máy chủ đăng nhập.')
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

      {/* Login Container Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-heading font-extrabold text-teal-900 mb-1">Đăng nhập hệ thống</h1>
          <p className="text-slate-500 text-xs font-medium">
            Đăng nhập chung dành cho Bệnh nhân, Bác sĩ & Quản trị viên
          </p>
        </div>

        {/* Quick Login Section (Simple & Clean) */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-500 mb-2">Đăng nhập nhanh demo:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('admin@mindcare.vn', 'admin123')}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
            >
              Admin
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('bacsi@mindcare.vn', '123456')}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
            >
              Bác sĩ
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('benhnhan@mindcare.vn', '123456')}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
            >
              Bệnh nhân
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-2.5 text-[11px] font-medium text-slate-400 absolute">
            Hoặc nhập tài khoản
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">Email / SĐT Đăng nhập</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder="nguyenvana@gmail.com hoặc chuyenvien@mindcare.vn"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all active:scale-98"
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

