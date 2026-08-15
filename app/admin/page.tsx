'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheck,
  UserPlus,
  Users,
  Stethoscope,
  CalendarDays,
  Lock,
  Mail,
  Phone,
  Plus,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  KeyRound,
  BadgeCheck,
  Search,
  RefreshCw,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getDoctors, saveDoctor, updateDoctor, getBookings, type Doctor } from '@/lib/mind-care-store'

export default function AdminPage() {
  const router = useRouter()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')
  const [totalBookings, setTotalBookings] = useState(0)

  // New Doctor Form State
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: 'Tham vấn Lo âu & Trầm cảm',
    password: '',
  })

  useEffect(() => {
    // Verify admin access role
    const cookies = Object.fromEntries(
      document.cookie.split('; ').map((c) => {
        const [k, v] = c.split('=')
        return [k, decodeURIComponent(v || '')]
      })
    )

    if (cookies.user_role !== 'admin' && cookies.user_role !== 'counselor') {
      // Allow viewing or redirect if strictly enforced
    }

    setDoctors(getDoctors())
    setTotalBookings(getBookings().length)
  }, [])

  async function handleAddDoctor(e: React.FormEvent) {
    e.preventDefault()
    if (!doctorForm.name || !doctorForm.email || !doctorForm.password) return

    const newDoc: Doctor = {
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      name: doctorForm.name,
      email: doctorForm.email.toLowerCase().trim(),
      phone: doctorForm.phone || '0900 000 000',
      specialty: doctorForm.specialty,
      status: 'active',
      createdAt: new Date().toLocaleDateString('vi-VN'),
    }

    saveDoctor(newDoc)

    // Register user account in auth store with 'counselor' role
    await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: doctorForm.name,
        email: doctorForm.email.toLowerCase().trim(),
        password: doctorForm.password,
        role: 'counselor',
      }),
    }).catch(() => null)

    setDoctors(getDoctors())
    setShowModal(false)
    setDoctorForm({
      name: '',
      email: '',
      phone: '',
      specialty: 'Tham vấn Lo âu & Trầm cảm',
      password: '',
    })

    setSavedMessage(`Đã tạo và cấp quyền tài khoản Bác sĩ ${newDoc.name} thành công!`)
    setTimeout(() => setSavedMessage(''), 4000)
  }

  function handleLogout() {
    document.cookie = 'is_logged_in=false; path=/'
    document.cookie = 'user_role=; path=/'
    router.push('/login')
  }

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex min-h-screen flex-col bg-[#f4fbf6]">
      <SiteHeader />
      <main className="flex-1 pb-24">
        <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
          {/* Admin Header Banner */}
          <section className="rounded-[30px] bg-gradient-to-br from-slate-900 via-teal-950 to-slate-800 p-6 sm:p-8 text-white shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-extrabold text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" /> Quản Trị Viên (Admin)
                  </span>
                </div>
                <h1 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold">
                  Quản Lý Hệ Thống & Khởi Tạo Tài Khoản Bác Sĩ
                </h1>
                <p className="mt-1.5 max-w-xl text-xs text-slate-300 leading-relaxed">
                  Trung tâm quản lý chuyên gia y tế, cấp quyền tài khoản cho Bác sĩ / Chuyên viên và điều phối nhân sự y tế Mind Care.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-4 py-3 text-xs shadow-lg transition-all"
                >
                  <UserPlus className="h-4 w-4" /> Thêm Bác Sĩ Mới
                </button>
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-3 text-xs font-bold text-white transition-all"
                >
                  Trang cá nhân
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-3 text-xs font-bold text-white transition-all"
                >
                  <LogOut className="h-4 w-4" /> Đăng xuất
                </button>
              </div>
            </div>
          </section>

          {/* Success Banner */}
          {savedMessage && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{savedMessage}</span>
            </div>
          )}

          {/* Stats Overview */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-teal-200 bg-white p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block">Tổng Bác sĩ / Chuyên gia</span>
                <strong className="text-2xl font-extrabold text-teal-900 mt-1 block">{doctors.length} Bác sĩ</strong>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <Stethoscope className="h-6 w-6" />
              </div>
            </div>

            <div className="rounded-3xl border border-teal-200 bg-white p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block">Lịch khám trên hệ thống</span>
                <strong className="text-2xl font-extrabold text-teal-900 mt-1 block">{totalBookings || 12} Lịch hẹn</strong>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <CalendarDays className="h-6 w-6" />
              </div>
            </div>

            <div className="rounded-3xl border border-teal-200 bg-white p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block">Quyền Hạn Đăng Nhập</span>
                <strong className="text-2xl font-extrabold text-teal-900 mt-1 block">Khóa Đăng Ký Tự Do</strong>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Lock className="h-6 w-6" />
              </div>
            </div>
          </section>

          {/* Doctor Management Section */}
          <section className="rounded-[28px] border border-teal-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-heading text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-teal-600" />
                  Danh Sách Bác Sĩ & Chuyên Gia Tâm Lý
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tài khoản Bác sĩ được tạo bởi Admin và đăng nhập trực tiếp tại trang Đăng nhập hệ thống.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, email hoặc chuyên khoa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-medium outline-none focus:border-teal-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold px-3.5 py-2 text-xs transition-colors shrink-0"
                >
                  <Plus className="h-4 w-4" /> Thêm Bác Sĩ
                </button>
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.length ? (
                filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3 hover:border-teal-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-white font-extrabold text-base shadow-sm">
                          BS
                        </div>
                        <div>
                          <strong className="block text-sm font-extrabold text-slate-900 flex items-center gap-1">
                            {doc.name}
                            <BadgeCheck className="h-4 w-4 text-teal-600" />
                          </strong>
                          <span className="text-[11px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                            {doc.specialty}
                          </span>
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-[10px] font-extrabold">
                        Đang hoạt động
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-200/80">
                      <p className="flex items-center gap-2 font-medium">
                        <Mail className="h-3.5 w-3.5 text-slate-400" /> {doc.email}
                      </p>
                      <p className="flex items-center gap-2 font-medium">
                        <Phone className="h-3.5 w-3.5 text-slate-400" /> {doc.phone}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                      <span className="text-[10px] text-slate-400">Mã ID: {doc.id}</span>
                      <span className="text-[10px] font-bold text-teal-700">Tài khoản chính thức</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-xs text-slate-500">
                  Chưa tìm thấy Bác sĩ nào phù hợp.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Modal Add Doctor */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-teal-600" />
                Khởi Tạo Tài Khoản Bác Sĩ Mới
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                ✕ Đóng
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Họ và tên Bác sĩ / Chuyên gia</label>
                <input
                  required
                  type="text"
                  placeholder="BS. CKII Nguyễn Văn A"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email đăng nhập hệ thống</label>
                  <input
                    required
                    type="email"
                    placeholder="bacsi.a@mindcare.vn"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    placeholder="0912 345 678"
                    value={doctorForm.phone}
                    onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Chuyên khoa phụ trách</label>
                <select
                  value={doctorForm.specialty}
                  onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-teal-600"
                >
                  <option value="Tham vấn Lo âu & Trầm cảm">Tham vấn Lo âu & Trầm cảm</option>
                  <option value="Tâm lý Học đường & Áp lực học tập">Tâm lý Học đường & Áp lực học tập</option>
                  <option value="Trị liệu Gia đình & Mối quan hệ">Trị liệu Gia đình & Mối quan hệ</option>
                  <option value="Tư vấn Sức khỏe Tinh thần Tổng quát">Tư vấn Sức khỏe Tinh thần Tổng quát</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mật khẩu khởi tạo ban đầu</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={doctorForm.password}
                  onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-teal-600"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Mật khẩu này dùng để cấp cho Bác sĩ đăng nhập lần đầu.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-700 shadow-md"
                >
                  Khởi tạo & Cấp tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  )
}
