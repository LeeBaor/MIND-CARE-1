'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BadgeCheck,
  Barcode,
  ChevronRight,
  Eye,
  EyeOff,
  QrCode,
  ShieldCheck,
  UserRound,
  UsersRound,
  LogOut,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  Lock,
  UserCheck,
  FileText,
  Save,
  ArrowRight,
  Share2,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BachMaiNav } from '@/components/bachmai-nav'
import { getFamilyMembers, saveFamilyMembers, type FamilyMember } from '@/lib/mind-care-store'

export default function ProfilePage() {
  const router = useRouter()
  const [userName, setUserName] = useState('Khách hàng Mind Care')
  const [userEmail, setUserEmail] = useState('khachhang@mindcare.vn')
  const [userPhone, setUserPhone] = useState('0987 654 321')
  const [userRole, setUserRole] = useState('patient')

  const [members, setMembers] = useState<FamilyMember[]>([])
  const [familyForm, setFamilyForm] = useState({ name: '', dob: '', cccd: '', phone: '' })
  const [editing, setEditing] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')
  const [showQrModal, setShowQrModal] = useState(false)

  // Password management states
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // Read user information from cookies
    const cookies = Object.fromEntries(
      document.cookie.split('; ').map((c) => {
        const [k, v] = c.split('=')
        return [k, decodeURIComponent(v || '')]
      })
    )

    if (cookies.user_name) setUserName(cookies.user_name)
    if (cookies.user_email) setUserEmail(cookies.user_email)
    if (cookies.user_phone) setUserPhone(cookies.user_phone)
    if (cookies.user_role) setUserRole(cookies.user_role)

    // Load family members
    fetch('/api/family-members')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setMembers(data))
      .catch(() => setMembers(getFamilyMembers()))
  }, [])

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    document.cookie = `user_name=${encodeURIComponent(userName)}; path=/`
    document.cookie = `user_email=${encodeURIComponent(userEmail)}; path=/`
    document.cookie = `user_phone=${encodeURIComponent(userPhone)}; path=/`
    document.cookie = `user_role=${encodeURIComponent(userRole)}; path=/`

    window.dispatchEvent(new Event('mind-care-profile-updated'))
    setEditing(false)
    setSavedMessage('Cập nhật thông tin hồ sơ cá nhân thành công!')
    setTimeout(() => setSavedMessage(''), 3500)
  }

  function handleLogout() {
    document.cookie = 'is_logged_in=false; path=/'
    document.cookie = 'user_name=; path=/'
    document.cookie = 'user_role=; path=/'
    router.push('/login')
  }

  async function addMember(e: React.FormEvent) {
    e.preventDefault()
    if (!familyForm.name || !familyForm.dob || !familyForm.phone) return

    const res = await fetch('/api/family-members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(familyForm),
    }).catch(() => null)

    let newMember: FamilyMember
    if (res?.ok) {
      newMember = await res.json()
    } else {
      newMember = { id: `fm_${Date.now()}`, ...familyForm }
    }

    const updated = [...members, newMember]
    setMembers(updated)
    saveFamilyMembers(updated)
    setFamilyForm({ name: '', dob: '', cccd: '', phone: '' })
  }

  function removeMember(id: string) {
    const updated = members.filter((m) => m.id !== id)
    setMembers(updated)
    saveFamilyMembers(updated)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f4fbf6]">
      <SiteHeader />
      <main className="flex-1 pb-24">
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
          {/* Header Banner */}
          <section className="rounded-[30px] bg-gradient-to-br from-emerald-800 via-teal-700 to-teal-800 p-6 text-white shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-100">Mind Care ID</p>
                <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-extrabold">Hồ sơ cá nhân & Quyền riêng tư</h1>
                <p className="mt-1.5 max-w-lg text-xs text-emerald-50 leading-relaxed">
                  Trang quản lý thông tin tài khoản riêng tư, định danh y tế Mind ID và thiết lập quyền truy cập cho bác sĩ.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition-all shrink-0"
              >
                <LogOut className="h-4 w-4" /> Đăng xuất
              </button>
            </div>
          </section>

          {savedMessage && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 shadow-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{savedMessage}</span>
            </div>
          )}

          {/* Section 1: User Profile Details & Editing */}
          <section className="rounded-[28px] border border-teal-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white font-extrabold text-lg shadow-md">
                  {userRole === 'counselor' ? 'BS' : userName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-heading text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    {userName}
                    <BadgeCheck className="h-5 w-5 text-teal-600" />
                  </h2>
                  <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span>Mind ID: <strong className="text-teal-700">MC-7F42-81A9</strong></span>
                    <span>·</span>
                    <span className="rounded-full bg-teal-50 text-teal-800 px-2 py-0.5 text-[10px] font-extrabold border border-teal-200">
                      {userRole === 'admin' ? 'Quản trị viên (Admin)' : userRole === 'counselor' ? 'Bác sĩ / Chuyên gia' : 'Tài khoản Bệnh nhân'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {userRole === 'admin' && (
                  <Link
                    href="/admin"
                    className="rounded-xl border border-teal-600 bg-teal-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-700 transition-colors"
                  >
                    Vào trang Admin
                  </Link>
                )}
                {userRole === 'counselor' && (
                  <Link
                    href="/counselor"
                    className="rounded-xl border border-teal-600 bg-teal-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-700 transition-colors"
                  >
                    Vào trang Bác sĩ
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setEditing(!editing)}
                  className="rounded-xl border border-teal-600 bg-teal-50 px-4 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100 transition-colors"
                >
                  {editing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa hồ sơ'}
                </button>
              </div>
            </div>

            {/* Account Details Form */}
            <form onSubmit={handleSaveProfile} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Họ và tên</label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    disabled={!editing}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-9 p-2.5 text-sm font-semibold text-slate-800 disabled:bg-slate-50 focus:border-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Địa chỉ Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    disabled={!editing}
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-9 p-2.5 text-sm font-semibold text-slate-800 disabled:bg-slate-50 focus:border-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại liên hệ</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    disabled={!editing}
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-9 p-2.5 text-sm font-semibold text-slate-800 disabled:bg-slate-50 focus:border-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Vai trò tài khoản (Cố định)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    disabled
                    readOnly
                    value={
                      userRole === 'admin'
                        ? 'Quản trị viên hệ thống (Admin)'
                        : userRole === 'counselor'
                        ? 'Bác sĩ / Chuyên gia tâm lý'
                        : 'Bệnh nhân / Người tham vấn'
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 pl-9 p-2.5 text-sm font-semibold text-slate-600 cursor-not-allowed select-none"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Vai trò phân quyền cố định theo hệ thống.</span>
              </div>

              {editing && (
                <div className="sm:col-span-2 flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-700 transition-all"
                  >
                    <Save className="h-4 w-4" /> Lưu thông tin hồ sơ
                  </button>
                </div>
              )}
            </form>

            {/* Quick Actions for Medical ID */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-teal-200 bg-emerald-50/60 p-3 text-center text-teal-800 hover:bg-teal-100/60 transition-all cursor-pointer font-bold text-xs"
              >
                <QrCode className="h-5 w-5 text-teal-600" />
                <span>Xem Mã QR Quét Y tế</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Mã vạch định danh y tế Mind ID: MC-7F42-81A9')}
                className="flex items-center justify-center gap-2 rounded-2xl border border-teal-200 bg-emerald-50/60 p-3 text-center text-teal-800 hover:bg-teal-100/60 transition-all cursor-pointer font-bold text-xs"
              >
                <Barcode className="h-5 w-5 text-teal-600" />
                <span>Mã vạch Mind ID</span>
              </button>
            </div>
          </section>

          {/* Section 2: Password Management (Đổi / Thêm mật khẩu) */}
          <section className="rounded-[28px] border border-teal-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Lock className="h-5 w-5 text-teal-600" />
              <h2 className="font-heading text-lg font-extrabold text-slate-900">Bảo mật tài khoản & Đổi mật khẩu</h2>
            </div>
            <p className="text-xs text-slate-500">
              Cập nhật mật khẩu thường xuyên để tăng cường độ an toàn cho tài khoản cá nhân của bạn.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                  setPasswordError('Mật khẩu mới và mật khẩu xác nhận không trùng khớp!')
                  return
                }
                if (passwordForm.newPassword.length < 6) {
                  setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự!')
                  return
                }
                setPasswordError('')
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                setSavedMessage('Cập nhật mật khẩu tài khoản thành công!')
                setTimeout(() => setSavedMessage(''), 3500)
              }}
              className="grid gap-3 sm:grid-cols-3"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mật khẩu hiện tại</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-8 p-2.5 text-sm font-semibold text-slate-800 focus:border-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mật khẩu mới</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-8 p-2.5 text-sm font-semibold text-slate-800 focus:border-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-8 p-2.5 text-sm font-semibold text-slate-800 focus:border-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              {passwordError && (
                <div className="sm:col-span-3 text-xs font-bold text-rose-600">
                  ⚠️ {passwordError}
                </div>
              )}

              <div className="sm:col-span-3 flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span>{showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition-colors"
                >
                  <Lock className="h-4 w-4" /> Cập nhật mật khẩu mới
                </button>
              </div>
            </form>
          </section>

          {/* Section 3: Family Members Management */}
          <section className="rounded-[28px] border border-teal-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <UsersRound className="h-5 w-5 text-teal-600" />
              <h2 className="font-heading text-lg font-extrabold text-slate-900">Quản lý Thành viên Gia đình</h2>
            </div>
            <p className="text-xs text-slate-500">
              Thêm người thân để đăng ký lịch hẹn và quản lý lộ trình hỗ trợ cho cả gia đình.
            </p>

            <form onSubmit={addMember} className="grid gap-3 sm:grid-cols-2">
              <input
                required
                placeholder="Họ và tên người thân"
                value={familyForm.name}
                onChange={(e) => setFamilyForm({ ...familyForm, name: e.target.value })}
                className="rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-teal-600 font-medium"
              />
              <input
                required
                type="date"
                aria-label="Ngày tháng năm sinh"
                value={familyForm.dob}
                onChange={(e) => setFamilyForm({ ...familyForm, dob: e.target.value })}
                className="rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-teal-600 font-medium"
              />
              <input
                required
                inputMode="numeric"
                placeholder="Số CCCD / Mã định danh"
                value={familyForm.cccd}
                onChange={(e) => setFamilyForm({ ...familyForm, cccd: e.target.value })}
                className="rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-teal-600 font-medium"
              />
              <input
                required
                type="tel"
                placeholder="Số điện thoại"
                value={familyForm.phone}
                onChange={(e) => setFamilyForm({ ...familyForm, phone: e.target.value })}
                className="rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-teal-600 font-medium"
              />
              <button type="submit" className="sm:col-span-2 rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition-colors">
                Thêm người thân vào hồ sơ
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {members.length ? (
                members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
                    <div>
                      <strong className="block text-sm font-bold text-slate-800">{m.name}</strong>
                      <span className="text-xs text-slate-500">
                        Sinh: {m.dob} · CCCD: {m.cccd} · SĐT: {m.phone}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMember(m.id)}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
                  Chưa có thành viên gia đình nào được thêm.
                </p>
              )}
            </div>
          </section>

          {/* Section 4: Quick Navigation Shortcuts */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/results"
              className="flex items-center justify-between p-4 rounded-2xl border border-teal-200 bg-white hover:bg-teal-50 transition-all shadow-xs group"
            >
              <div>
                <span className="text-xs font-bold text-teal-700 block">Báo cáo Y tế</span>
                <strong className="text-sm font-extrabold text-slate-900">Kết quả từ Bác sĩ</strong>
              </div>
              <ArrowRight className="h-4 w-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/booking"
              className="flex items-center justify-between p-4 rounded-2xl border border-teal-200 bg-white hover:bg-teal-50 transition-all shadow-xs group"
            >
              <div>
                <span className="text-xs font-bold text-teal-700 block">Dịch vụ khám</span>
                <strong className="text-sm font-extrabold text-slate-900">Đặt lịch hẹn mới</strong>
              </div>
              <ArrowRight className="h-4 w-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/assessment"
              className="flex items-center justify-between p-4 rounded-2xl border border-teal-200 bg-white hover:bg-teal-50 transition-all shadow-xs group"
            >
              <div>
                <span className="text-xs font-bold text-teal-700 block">Khảo sát cảm xúc</span>
                <strong className="text-sm font-extrabold text-slate-900">Trắc nghiệm DASS-21</strong>
              </div>
              <ArrowRight className="h-4 w-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </section>
        </div>
      </main>

      {/* QR Code Identity Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <QrCode className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-lg font-extrabold text-slate-900">Mã QR Định danh Mind ID</h3>
            <p className="text-xs text-slate-500">Dùng mã QR này để quét xác thực thông tin tại quầy tiếp đón bệnh viện/phòng khám.</p>

            <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-2xl border-2 border-dashed border-teal-500 bg-emerald-50/50 p-3">
              <QrCode className="h-32 w-32 text-teal-900" />
            </div>
            <p className="text-xs font-extrabold text-teal-900">Mã định danh: MC-7F42-81A9</p>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white hover:bg-teal-700"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      <SiteFooter />
      <BachMaiNav />
    </div>
  )
}

