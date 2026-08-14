'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, Brain, CalendarDays, Check, ChevronRight, ClipboardCheck, CreditCard, HeartPulse, LockKeyhole, Moon, ShieldCheck, UsersRound } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BachMaiNav } from '@/components/bachmai-nav'
import { SosButton } from '@/components/sos-button'
import { getMood, saveMood, type MindBooking } from '@/lib/mind-care-store'
import { DailyPractices } from '@/components/dashboard/daily-practices'

const moods = [{ value: 5, emoji: '😀', label: 'Rất vui' }, { value: 4, emoji: '🙂', label: 'Ổn' }, { value: 3, emoji: '😐', label: 'Bình thường' }, { value: 2, emoji: '😟', label: 'Lo âu' }, { value: 1, emoji: '😞', label: 'Buồn' }]

export default function DashboardPage() {
  const [mood, setMood] = useState<number | null>(null)
  const [sleep, setSleep] = useState('7.5')
  const [stress, setStress] = useState('3')
  const [bookings, setBookings] = useState<MindBooking[]>([])
  const [anonymous, setAnonymous] = useState(true)
  const [accessGranted, setAccessGranted] = useState(true)

  useEffect(() => { setMood(getMood()); fetch('/api/bookings').then(response => response.ok ? response.json() : Promise.reject()).then(setBookings).catch(() => setBookings([])) }, [])
  const updateMood = (value: number) => { setMood(value); saveMood(value) }

  return <div className="flex min-h-screen flex-col bg-[#f4fbf6]">
    <SiteHeader active="dashboard" />
    <main className="flex-1 pb-24"><div className="mx-auto max-w-4xl space-y-5 px-4 py-6">
      <section className="overflow-hidden rounded-[30px] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-5 text-white shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-100">Mind Care · không gian an toàn</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3"><div><h1 className="font-heading text-2xl font-extrabold">Chăm sóc tâm trí của bạn</h1><p className="mt-1 text-sm text-emerald-50">Hôm nay bạn thấy thế nào?</p></div><SosButton variant="compact" className="bg-rose-500 hover:bg-rose-600" /></div>
      </section>

      <section className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="rounded-xl bg-rose-50 p-2 text-rose-500"><HeartPulse className="h-5 w-5" /></span><div><h2 className="font-heading font-extrabold text-slate-900">Nhật ký cảm xúc</h2><p className="text-xs text-slate-500">Chỉ mất vài giây, hoàn toàn riêng tư.</p></div></div><span className="text-xs font-bold text-emerald-700">{mood ? 'Đã lưu hôm nay' : 'Chưa chọn'}</span></div>
        <div className="mt-4 flex justify-between gap-1">{moods.map(item => <button key={item.value} onClick={() => updateMood(item.value)} className={`flex min-w-0 flex-1 flex-col items-center rounded-2xl px-1 py-2 transition ${mood === item.value ? item.value === 3 ? 'bg-amber-100 ring-2 ring-amber-500' : item.value === 1 ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'bg-emerald-100 ring-2 ring-emerald-500' : item.value === 3 ? 'bg-amber-50 hover:bg-amber-100' : item.value === 1 ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-slate-50'}`}><span className="text-2xl">{item.emoji}</span><span className={`mt-1 text-[10px] font-extrabold ${item.value === 3 ? 'text-amber-800' : item.value === 1 ? 'text-indigo-800' : 'text-slate-600'}`}>{item.label}</span></button>)}</div>
        <div className="mt-4 grid grid-cols-2 gap-3"><label className="rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-600"> <span className="flex items-center gap-1"><Moon className="h-3.5 w-3.5 text-indigo-500" /> Giấc ngủ (giờ)</span><input type="number" min="0" max="24" step="0.5" value={sleep} onChange={e => setSleep(e.target.value)} className="mt-2 w-full bg-transparent text-lg font-extrabold text-slate-900 outline-none" /></label><label className="rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-600">Mức stress (1–5)<input type="number" min="1" max="5" value={stress} onChange={e => setStress(e.target.value)} className="mt-2 w-full bg-transparent text-lg font-extrabold text-slate-900 outline-none" /></label></div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-heading font-extrabold text-slate-900">Lộ trình tham vấn</h2><Link href="/booking" className="text-xs font-bold text-emerald-700">Đặt lịch</Link></div><div className="mt-4 flex items-center gap-2">{['Sàng lọc','Đánh giá','Trị liệu','Tái đánh giá'].map((item, index) => <div key={item} className="flex flex-1 items-center gap-1"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${index < 2 ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'}`}>{index < 2 ? <Check className="h-4 w-4" /> : index + 1}</span>{index < 3 && <span className={`h-1 flex-1 ${index < 1 ? 'bg-emerald-500' : 'bg-emerald-100'}`} />}</div>)}</div><p className="mt-3 text-xs text-slate-500">Bước tiếp theo: hoàn thành buổi tham vấn đầu tiên.</p></div>
        <div className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-heading font-extrabold text-slate-900">Lịch hẹn</h2><CalendarDays className="h-5 w-5 text-emerald-600" /></div>{bookings[0] ? <div className="mt-3 rounded-2xl bg-emerald-50 p-3 text-xs"><strong className="block text-emerald-950">{bookings[0].counselor}</strong><span className="mt-1 block text-emerald-800">{bookings[0].date} · {bookings[0].time} · {bookings[0].mode === 'online' ? 'Trực tuyến' : 'Tại phòng khám'}</span></div> : <p className="mt-4 text-sm text-slate-500">Chưa có lịch hẹn. Chọn chuyên gia và khung giờ phù hợp.</p>}</div>
      </section>

      <DailyPractices />

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><LockKeyhole className="h-5 w-5 text-emerald-600" /><h2 className="font-heading font-extrabold text-slate-900">Quyền riêng tư</h2></div><Toggle label="Hiển thị ẩn danh trong nhật ký" checked={anonymous} onChange={() => setAnonymous(!anonymous)} /><Toggle label="Chuyên gia được xem hồ sơ" checked={accessGranted} onChange={() => setAccessGranted(!accessGranted)} /></div>
        <div className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-emerald-600" /><h2 className="font-heading font-extrabold text-slate-900">Gói tham vấn</h2></div><p className="mt-3 text-sm font-bold text-slate-800">Chưa đăng ký gói tham vấn</p><p className="mt-1 text-xs leading-relaxed text-slate-500">Nên hoàn thành buổi tham vấn đầu tiên để chuyên gia đề xuất số buổi và lộ trình phù hợp, tránh mua gói không cần thiết.</p><Link href="/booking" className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-700">Đặt buổi tham vấn đầu tiên <ChevronRight className="h-4 w-4" /></Link></div>
      </section>

      <section className="grid grid-cols-3 gap-3">{[{href:'/assessment',label:'Trắc nghiệm',icon:ClipboardCheck},{href:'/results',label:'Kết quả',icon:Brain},{href:'/notifications',label:'Thông báo',icon:Bell},{href:'/profile',label:'Hồ sơ',icon:ShieldCheck},{href:'/profile',label:'Thành viên',icon:UsersRound}].map(({href,label,icon:Icon}) => <Link href={href} key={label} className="rounded-2xl border border-emerald-100 bg-white p-3 text-center shadow-sm"><Icon className="mx-auto h-5 w-5 text-emerald-600" /><span className="mt-1 block text-[11px] font-bold text-slate-700">{label}</span></Link>)}</section>
    </div></main><SiteFooter /><BachMaiNav />
  </div>
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) { return <button onClick={onChange} className="mt-3 flex w-full items-center justify-between text-left text-xs font-semibold text-slate-600"><span>{label}</span><span className={`flex h-6 w-11 items-center rounded-full p-1 transition ${checked ? 'justify-end bg-emerald-600' : 'justify-start bg-slate-200'}`}><span className="h-4 w-4 rounded-full bg-white shadow" /></span></button> }
