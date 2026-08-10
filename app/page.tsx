import Link from 'next/link'
import { Bot, Brain, CalendarDays, ClipboardCheck, HeartHandshake, Menu, Newspaper, QrCode, ShieldAlert } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BachMaiNav } from '@/components/bachmai-nav'
import { SosButton } from '@/components/sos-button'

const services = [
  { title: 'Bắt đầu sàng lọc', icon: ClipboardCheck, href: '/assessment' },
  { title: 'Kết quả đánh giá', icon: Brain, href: '/results' },
  { title: 'Đặt lịch tham vấn', icon: CalendarDays, href: '/booking' },
  { title: 'Trợ lý AI 24/7', icon: Bot, href: '/ai-assistant' },
  { title: 'Hồ sơ Mind Profile', icon: QrCode, href: '/profile' },
  { title: 'Chức năng khác', icon: Menu, href: '/dashboard' },
]

export default function HomePage() {
  return <div className="flex min-h-screen flex-col bg-[#f4fbf6]"><SiteHeader active="home" />
    <main className="flex-1 pb-24"><div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-6 text-white shadow-xl"><div className="relative z-10 max-w-xl"><span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold"><HeartHandshake className="h-4 w-4" /> Không gian hỗ trợ an toàn</span><h1 className="mt-4 font-heading text-2xl font-extrabold leading-tight sm:text-3xl">Chăm sóc sức khỏe tinh thần, theo cách của bạn</h1><p className="mt-2 text-sm leading-relaxed text-emerald-50">Sàng lọc, trò chuyện cùng chuyên gia và theo dõi tiến trình trong một hồ sơ riêng tư.</p><div className="mt-5 flex flex-wrap gap-2"><Link href="/assessment" className="rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-emerald-800">Bắt đầu ngay</Link><SosButton variant="compact" className="bg-rose-500 hover:bg-rose-600" /></div></div><div className="absolute -right-16 -bottom-16 h-52 w-52 rounded-full bg-emerald-300/20" /></section>
      <section><div className="mb-3 flex items-center justify-between"><h2 className="font-heading text-lg font-extrabold text-slate-900">Dịch vụ Mind Care</h2><Link href="/dashboard" className="text-xs font-bold text-emerald-700">Xem tất cả</Link></div><div className="grid grid-cols-3 gap-3">{services.map(({title,icon:Icon,href}) => <Link href={href} key={href} className="flex min-h-28 flex-col items-center justify-center rounded-[24px] border border-emerald-100 bg-white p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300"><span className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600"><Icon className="h-6 w-6" /></span><span className="mt-2 whitespace-pre-line text-xs font-extrabold leading-snug text-slate-800">{title}</span></Link>)}</div></section>
      <section className="grid gap-4 md:grid-cols-2"><Link href="/booking" className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm"><CalendarDays className="h-7 w-7 text-emerald-600" /><h2 className="mt-3 font-heading text-base font-extrabold text-slate-900">Lịch hẹn & lộ trình</h2><p className="mt-1 text-xs leading-relaxed text-slate-500">Chọn chuyên gia, hình thức trực tuyến hoặc tại phòng khám và nhận nhắc lịch thông minh.</p><span className="mt-3 inline-block text-xs font-bold text-emerald-700">Đặt lịch tham vấn →</span></Link><Link href="/results" className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm"><ShieldAlert className="h-7 w-7 text-emerald-600" /><h2 className="mt-3 font-heading text-base font-extrabold text-slate-900">Riêng tư là ưu tiên</h2><p className="mt-1 text-xs leading-relaxed text-slate-500">Kiểm soát quyền xem hồ sơ và lựa chọn chia sẻ thông tin ở chế độ ẩn danh.</p><span className="mt-3 inline-block text-xs font-bold text-emerald-700">Mở Mind Profile →</span></Link></section>
      <section className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Newspaper className="h-5 w-5 text-emerald-600" /><h2 className="font-heading font-extrabold text-slate-900">Thư viện tri thức</h2></div><div className="mt-3 grid gap-2 sm:grid-cols-3">{['Bài tập thở khi căng thẳng','Giấc ngủ và sức khỏe tinh thần','Cách đồng hành cùng người thân'].map((item,index) => <Link href="/ai-assistant" key={item} className="rounded-2xl bg-[#f6faf7] p-3 text-xs font-bold text-slate-700"><span className="mb-2 block text-emerald-600">0{index + 1}</span>{item}</Link>)}</div></section>
    </div></main><SiteFooter /><BachMaiNav /></div>
}
