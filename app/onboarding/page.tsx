'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, HeartHandshake, ShieldCheck } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [form, setForm] = useState({ fullName: '', birthDate: '', gender: '', phone: '', schoolClass: '', emergencyName: '', emergencyPhone: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/profile').then((response) => response.ok ? response.json() : Promise.reject()).then((profile) => setForm((value) => ({ ...value, fullName: profile.fullName || '', birthDate: profile.birthDate || '', gender: profile.gender || '', phone: profile.phone || '', schoolClass: profile.schoolClass || '' }))).catch(() => setError('Không thể tải hồ sơ.'))
  }, [])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true); setError('')
    const response = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, emergencyContact: form.emergencyName || form.emergencyPhone ? { name: form.emergencyName, phone: form.emergencyPhone } : null }) }).catch(() => null)
    setSaving(false)
    if (!response?.ok) { const data = response ? await response.json().catch(() => ({})) : {}; setError(data.message || 'Không thể lưu hồ sơ.'); return }
    router.push('/dashboard'); router.refresh()
  }

  return <main className="min-h-screen bg-[#f4fbf6] px-4 py-10"><div className="mx-auto max-w-xl">
    <div className="mb-6 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white"><HeartHandshake className="h-7 w-7" /></span><h1 className="mt-4 text-2xl font-extrabold text-emerald-950">Hoàn thiện hồ sơ MINDCARE</h1><p className="mt-2 text-sm text-slate-600">Thông tin này giúp cá nhân hóa hỗ trợ và liên hệ đúng người khi có tình huống khẩn cấp.</p></div>
    <form onSubmit={submit} className="space-y-4 rounded-[28px] border border-emerald-100 bg-white p-6 shadow-lg">
      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}
      <Field label="Họ và tên *"><input required value={form.fullName} onChange={e => setForm({...form, fullName:e.target.value})} className="input" /></Field>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Ngày sinh"><input type="date" value={form.birthDate} onChange={e => setForm({...form, birthDate:e.target.value})} className="input" /></Field><Field label="Giới tính"><select value={form.gender} onChange={e => setForm({...form, gender:e.target.value})} className="input"><option value="">Không muốn cung cấp</option><option>Nam</option><option>Nữ</option><option>Khác</option></select></Field></div>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Số điện thoại"><input type="tel" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} className="input" /></Field><Field label="Lớp/đơn vị"><input value={form.schoolClass} onChange={e => setForm({...form, schoolClass:e.target.value})} className="input" /></Field></div>
      <div className="rounded-2xl bg-emerald-50 p-4"><p className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-950"><ShieldCheck className="h-4 w-4" /> Liên hệ khẩn cấp (không bắt buộc)</p><div className="grid gap-3 sm:grid-cols-2"><input placeholder="Tên người liên hệ" value={form.emergencyName} onChange={e => setForm({...form, emergencyName:e.target.value})} className="input" /><input type="tel" placeholder="Số điện thoại" value={form.emergencyPhone} onChange={e => setForm({...form, emergencyPhone:e.target.value})} className="input" /></div></div>
      <button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Đang lưu...' : 'Hoàn tất và tiếp tục'} <ArrowRight className="h-4 w-4" /></button>
    </form>
  </div><style jsx>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:.75rem;padding:.7rem;font-size:.875rem;outline:none}.input:focus{border-color:#059669}`}</style></main>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-semibold text-slate-700"><span className="mb-1.5 block">{label}</span>{children}</label> }
