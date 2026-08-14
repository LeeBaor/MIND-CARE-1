'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  X, User, Phone, Mail, Calendar, ShieldCheck, CreditCard, 
  FileText, Pill, Lock, LogOut, Edit3, Heart, CheckCircle2, ChevronRight 
} from 'lucide-react'
import { type CarePlan, type ClinicalRecord } from '@/lib/mind-care-store'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'prescriptions' | 'security'>('info')
  const [role, setRole] = useState<'patient' | 'counselor'>('patient')
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [insuranceId, setInsuranceId] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [records, setRecords] = useState<ClinicalRecord[]>([])
  const [carePlans, setCarePlans] = useState<CarePlan[]>([])
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const cookies = Object.fromEntries(
      document.cookie.split('; ').map((c) => {
        const [k, v] = c.split('=')
        return [k, decodeURIComponent(v || '')]
      })
    )
    if (cookies.user_role === 'counselor') setRole('counselor')
    if (cookies.user_name) setUserName(cookies.user_name)
    if (cookies.user_email) setEmail(cookies.user_email)
    fetch('/api/care').then((response) => response.ok ? response.json() : Promise.reject()).then((care) => { setRecords(care.records || []); setCarePlans(care.plans || []) }).catch(() => { setRecords([]); setCarePlans([]) })
    fetch('/api/profile').then((response) => response.ok ? response.json() : Promise.reject()).then((profile) => {
      setUserName(profile.fullName || '')
      setEmail(profile.email || '')
      setPhone(profile.phone || '')
      setDob(profile.birthDate ? String(profile.birthDate).slice(0, 10) : '')
      setGender(profile.gender || '')
    }).catch(() => undefined)
  }, [isOpen])

  if (!isOpen) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    const response = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fullName: userName, phone, birthDate: dob, gender }) }).catch(() => null)
    if (!response?.ok) { const data = response ? await response.json().catch(() => ({})) : {}; setFormError(data.message || 'Không thể cập nhật hồ sơ.'); return }
    setIsEditing(false)
    window.dispatchEvent(new Event('mind-care-profile-updated'))
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined)
    onClose()
    router.push('/login')
    router.refresh()
  }

  async function handlePasswordChange() {
    setFormError('')
    const response = await fetch('/api/auth/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) }).catch(() => null)
    if (!response?.ok) { const data = response ? await response.json().catch(() => ({})) : {}; setFormError(data.message || 'Không thể đổi mật khẩu.'); return }
    setCurrentPassword(''); setNewPassword(''); setSavedSuccess(true); setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Modal Card Container */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Emerald Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white font-extrabold text-lg border border-white/20">
              {role === 'counselor' ? 'BS' : 'NT'}
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-teal-950 text-[10px] font-bold">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-lg leading-tight">{userName}</h3>
                <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded border border-emerald-400/30">
                  {role === 'counselor' ? 'Bác sĩ / Chuyên gia' : 'Bệnh nhân'}
                </span>
              </div>
              <p className="text-xs text-teal-100 font-medium">Mã tài khoản: {role === 'counselor' ? 'MC-DOC-889' : 'MC-PAT-99812'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection Bar inside Profile */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2 gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'info'
                ? 'border-teal-600 text-teal-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="h-3.5 w-3.5" /> Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'history'
                ? 'border-teal-600 text-teal-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="h-3.5 w-3.5" /> Lịch sử khám
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'prescriptions'
                ? 'border-teal-600 text-teal-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Pill className="h-3.5 w-3.5" /> Đơn thuốc & Bài tập
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'security'
                ? 'border-teal-600 text-teal-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="h-3.5 w-3.5" /> Bảo mật
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Đã cập nhật thông tin cá nhân thành công!</span>
            </div>
          )}
          {formError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">{formError}</div>}

          {/* TAB 1: Personal Info Form */}
          {activeTab === 'info' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Chi tiết thông tin cá nhân</span>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>{isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Họ và tên</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-bold text-slate-800 disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    inputMode="tel"
                    disabled={!isEditing}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-bold text-slate-800 disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-bold text-slate-800 disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    disabled={!isEditing}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-bold text-slate-800 disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Giới tính</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-bold text-slate-800 disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Mã Bảo hiểm Y tế (BHYT)</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={insuranceId}
                    onChange={(e) => setInsuranceId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-bold text-slate-800 disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>
              </div>

              {isEditing && (
                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Lưu thay đổi thông tin
                </button>
              )}
            </form>
          )}

          {/* TAB 2: Appointment History */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Lịch tư vấn gần đây</span>
              {records.length ? records.map((record) => <div key={record.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-1"><div className="flex justify-between font-bold text-teal-800"><span>Buổi tham vấn đã hoàn tất</span><span>{record.completedAt}</span></div><p className="text-slate-600 font-medium">Chuyên gia: {record.counselor}</p><p className="rounded-xl bg-white p-2 text-slate-700">{record.summary}</p><span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Đã hoàn thành</span></div>) : <EmptyCareState text="Chưa có lịch sử khám. Lịch sử chỉ xuất hiện sau khi chuyên gia xác nhận hoàn tất buổi tham vấn." />}
            </div>
          )}

          {/* TAB 3: Prescriptions */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Đơn thuốc & Bài tập được kê</span>
              {carePlans.length ? carePlans.map((plan) => <div key={plan.id} className="rounded-2xl border border-teal-200 bg-emerald-50/50 p-3.5 text-xs space-y-1"><span className="font-bold text-teal-900 block">{plan.kind === 'exercise' ? '🧘' : '💊'} {plan.title}</span><p className="text-slate-600 font-medium">Người kê: {plan.counselor} · {plan.releasedAt}</p><p className="text-slate-700 text-[11px] mt-1 bg-white p-2 rounded-xl border border-emerald-100">{plan.notes}</p></div>) : <EmptyCareState text="Chưa có đơn thuốc hoặc bài tập. Nội dung chỉ xuất hiện khi chuyên gia phát hành sau buổi khám." />}
            </div>
          )}

          {/* TAB 4: Security */}
          {activeTab === 'security' && (
            <div className="space-y-3 text-xs">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Đổi mật khẩu & Bảo mật</span>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Mật khẩu hiện tại</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-slate-300 p-2.5" />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Mật khẩu mới</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Tối thiểu 8 ký tự" className="w-full rounded-xl border border-slate-300 p-2.5" />
              </div>
              <button disabled={!currentPassword || newPassword.length < 8} onClick={handlePasswordChange} className="w-full py-2.5 bg-teal-600 text-white font-bold rounded-xl shadow-xs disabled:opacity-50">
                Cập nhật mật khẩu
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer (Logout) */}
        <div className="border-t border-slate-200 bg-slate-50 p-3.5 flex items-center justify-between">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất tài khoản</span>
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-200 hover:bg-slate-300 px-4 py-1.5 text-xs font-bold text-slate-700 transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  )
}

function EmptyCareState({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-xs leading-relaxed text-slate-500">{text}</div>
}
