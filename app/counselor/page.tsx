'use client'

import { useEffect, useState } from 'react'
import { Bell, Calendar, CheckCircle2, ClipboardList, FileText, Pill, Send, UserRound } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { type MindBooking } from '@/lib/mind-care-store'

export default function CounselorPage() {
  const [bookings, setBookings] = useState<MindBooking[]>([])
  const [selected, setSelected] = useState<MindBooking | null>(null)
  const [summary, setSummary] = useState('Đã hoàn tất buổi tham vấn. Khuyến nghị tiếp tục theo dõi cảm xúc hằng ngày.')
  const [kind, setKind] = useState<'exercise' | 'medicine'>('exercise')
  const [title, setTitle] = useState('Bài tập hít thở 4-7-8 và thư giãn buổi tối')
  const [notes, setNotes] = useState('Thực hiện 10 phút trước khi ngủ. Ghi lại cảm xúc và mức độ căng thẳng.')
  const [message, setMessage] = useState('')

  const refresh = async () => {
    const response = await fetch('/api/bookings')
    if (response.ok) setBookings(await response.json())
  }
  useEffect(() => { void refresh() }, [])

  async function completeVisit() {
    if (!selected) return
    const response = await fetch('/api/bookings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId: selected.id, summary }) })
    if (!response.ok) { const data=await response.json().catch(()=>({})); setMessage(data.message||'Không thể hoàn tất buổi khám.'); return }
    const completed = { ...selected, status: 'completed' as const }
    setSelected(completed); await refresh(); setMessage(`Đã cập nhật lịch sử khám cho ${selected.patientName}.`)
  }
  async function releasePlan() {
    if (!selected || selected.status !== 'completed') return
    const response = await fetch('/api/care', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId: selected.id, kind, title, notes }) })
    if (!response.ok) { const data=await response.json().catch(()=>({})); setMessage(data.message||'Không thể phát hành kế hoạch.'); return }
    setMessage(`Đã phát hành ${kind === 'exercise' ? 'bài tập trị liệu' : 'đơn thuốc'} cho ${selected.patientName}.`)
  }

  return <div className="flex min-h-screen flex-col bg-[#f4fbf6]"><SiteHeader active="dashboard" />
    <main className="flex-1 pb-12"><div className="mx-auto max-w-5xl space-y-5 px-4 py-6">
      <section className="rounded-[28px] bg-gradient-to-r from-emerald-800 to-teal-700 p-5 text-white"><p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-100">Bảng điều khiển chuyên gia</p><h1 className="mt-1 font-heading text-2xl font-extrabold">Bệnh nhân phụ trách</h1><p className="mt-2 text-sm text-emerald-50">Chỉ hiển thị lịch hẹn và hồ sơ của bệnh nhân do bạn phụ trách.</p></section>
      {message && <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800"><CheckCircle2 className="h-4 w-4" />{message}</div>}
      <section className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-heading font-extrabold text-slate-900"><Calendar className="h-5 w-5 text-emerald-600" /> Lịch hẹn bệnh nhân</h2><button onClick={refresh} className="text-xs font-bold text-emerald-700">Làm mới</button></div><div className="mt-4 space-y-3">{bookings.length ? bookings.map(item => <button onClick={() => setSelected(item)} key={item.id} className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left ${selected?.id === item.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:border-emerald-200'}`}><span><strong className="flex items-center gap-2 text-sm text-slate-900"><UserRound className="h-4 w-4 text-emerald-600" />{item.patientName}</strong><small className="mt-1 block text-xs text-slate-600">{item.date} · {item.time} · {item.specialty}</small></span><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>{item.status === 'completed' ? 'Đã khám' : 'Chờ khám'}</span></button>) : <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">Chưa có lịch hẹn bệnh nhân nào được phân công.</p>}</div></section>
      {selected && <section className="grid gap-5 lg:grid-cols-2"><div className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-heading font-extrabold text-slate-900"><FileText className="h-5 w-5 text-emerald-600" /> Hoàn tất buổi khám</h2><p className="mt-1 text-xs text-slate-500">Sau khi xác nhận, lịch sử khám mới xuất hiện trong hồ sơ bệnh nhân.</p><textarea value={summary} onChange={e => setSummary(e.target.value)} rows={5} className="mt-4 w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500" /><button onClick={completeVisit} disabled={selected.status === 'completed'} className="mt-3 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{selected.status === 'completed' ? 'Đã hoàn tất' : 'Xác nhận hoàn tất khám'}</button></div>
      <div className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-heading font-extrabold text-slate-900"><Pill className="h-5 w-5 text-emerald-600" /> Phát hành đơn / bài tập</h2><p className="mt-1 text-xs text-slate-500">Chỉ phát hành sau khi buổi khám đã hoàn tất.</p><div className="mt-4 flex gap-2"><button onClick={() => setKind('exercise')} className={`rounded-xl px-3 py-2 text-xs font-bold ${kind === 'exercise' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Bài tập trị liệu</button><button onClick={() => setKind('medicine')} className={`rounded-xl px-3 py-2 text-xs font-bold ${kind === 'medicine' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Đơn thuốc</button></div><input value={title} onChange={e => setTitle(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-emerald-500" /><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-3 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-emerald-500" /><button onClick={releasePlan} disabled={selected.status !== 'completed'} className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Send className="h-4 w-4" />Phát hành cho bệnh nhân</button></div></section>}
      <section className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-heading font-extrabold text-slate-900"><Bell className="h-5 w-5 text-emerald-600" /> Thông báo chuyên môn</h2><p className="mt-3 text-sm text-slate-500">Thông báo mới sẽ xuất hiện khi bệnh nhân đặt lịch hoặc hoàn tất phản hồi sau buổi tham vấn.</p></section>
    </div></main><SiteFooter /></div>
}
