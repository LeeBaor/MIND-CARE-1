import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BachMaiNav } from '@/components/bachmai-nav'
import { 
  FileText, ClipboardCheck, Heart, Calendar, ThumbsUp, Bell, 
  ChevronRight, Phone, Sparkles, MessageCircle, ArrowRight, BookOpen
} from 'lucide-react'

export default function HomePage() {
  const quickActions = [
    {
      title: 'Quy trình tư vấn tâm lý',
      icon: FileText,
      href: '/assessment',
      color: 'text-teal-700 bg-teal-50 border-teal-100',
    },
    {
      title: 'Kết quả đánh giá tâm lý',
      icon: ClipboardCheck,
      href: '/results',
      color: 'text-teal-700 bg-teal-50 border-teal-100 ring-2 ring-teal-600',
      active: true,
    },
    {
      title: 'Sức khỏe cá nhân',
      icon: Heart,
      href: '/dashboard',
      color: 'text-teal-700 bg-teal-50 border-teal-100',
    },
    {
      title: 'Đặt lịch tư vấn tâm lý',
      icon: Calendar,
      href: '/booking',
      color: 'text-teal-700 bg-teal-50 border-teal-100',
    },
    {
      title: 'Đánh giá hài lòng',
      icon: ThumbsUp,
      href: '/dashboard',
      color: 'text-teal-700 bg-teal-50 border-teal-100',
    },
    {
      title: 'Thông báo & nhắc nhở',
      icon: Bell,
      href: '/notifications',
      color: 'text-teal-700 bg-teal-50 border-teal-100',
    },
  ]

  const articles = [
    {
      id: 1,
      title: 'Vượt qua căng thẳng & lo âu: Hướng dẫn cân bằng cảm xúc từ Chuyên gia',
      summary: 'Một người khỏe mạnh cả thể chất lẫn tinh thần sẽ học được cách lắng nghe bản thân và giải tỏa stress đúng thời điểm...',
      date: '26/06/2025',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Cải thiện chất lượng giấc ngủ để nuôi dưỡng tâm trí minh mẫn',
      summary: 'Giấc ngủ ngon là chìa khóa phục hồi hệ thần kinh sau những áp lực công việc và cuộc sống hàng ngày...',
      date: '25/06/2025',
      image: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?q=80&w=600&auto=format&fit=crop',
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader active="home" />

      <main className="flex-1 pb-16 md:pb-12">
        <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
          
          {/* Quick Action Grid (Bach Mai App Style - 6 Cards) */}
          <section className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">
              Lối tắt dịch vụ Mind Care
            </h2>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {quickActions.map((item, index) => {
                const Icon = item.icon
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex flex-col items-center justify-center rounded-2xl p-3 sm:p-4 text-center border transition-all hover:scale-[1.03] hover:shadow-md ${item.color}`}
                  >
                    <div className="mb-2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white shadow-xs">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-teal-700" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                      {item.title}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Featured Emerald Banner (Bach Mai App Style) */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-800 p-6 text-white shadow-xl">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-200 border border-emerald-400/30">
                <Sparkles className="h-3.5 w-3.5" /> Dịch vụ nổi bật
              </span>
              <h3 className="mt-3 font-heading text-xl sm:text-2xl font-extrabold leading-tight">
                Tư vấn y tế & sức khỏe tinh thần trực tuyến Mind Care
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-teal-100 font-medium leading-relaxed">
                Đặt lịch tư vấn với bác sĩ, chuyên gia tâm lý đầu ngành. Hỗ trợ tận tâm, bảo mật thông tin tuyệt đối.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/booking"
                  className="rounded-2xl bg-white px-5 py-2.5 text-xs sm:text-sm font-extrabold text-teal-800 shadow-lg hover:bg-teal-50 transition-transform active:scale-95"
                >
                  ĐẶT LỊCH TƯ VẤN
                </Link>
                <div className="flex items-center gap-1.5 text-xs text-teal-100 font-semibold bg-white/10 px-3 py-2 rounded-xl backdrop-blur-xs">
                  <Phone className="h-4 w-4 text-emerald-300" />
                  <span>Tổng đài: 1900 888 866</span>
                </div>
              </div>
            </div>

            {/* Decorative background shape */}
            <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-2xl" />
          </section>

          {/* AI Assistant Quick Entry Card */}
          <section className="rounded-3xl border border-teal-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-slate-900 text-base">Trợ lý AI Mind Care</h4>
                <p className="text-xs text-slate-500 font-medium">Hỗ trợ tư vấn sơ bộ, giải đáp thắc mắc cảm xúc 24/7</p>
              </div>
            </div>
            <Link
              href="/ai-assistant"
              className="flex items-center gap-2 rounded-xl bg-teal-50 text-teal-700 font-bold px-4 py-2 text-xs hover:bg-teal-100 transition-colors w-full sm:w-auto justify-center"
            >
              <span>Trò chuyện ngay</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* Highlighted Articles (Bach Mai App Style) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal-600" />
                <h3 className="font-heading text-lg font-bold text-slate-900">Bài viết nổi bật</h3>
              </div>
              <span className="text-xs font-semibold text-teal-600 hover:underline cursor-pointer">Xem thêm</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={art.image}
                      alt={art.title}
                      className="h-36 w-full object-cover rounded-xl mb-3"
                    />
                    <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{art.title}</h4>
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">{art.summary}</p>
                  </div>
                  <span className="mt-3 text-[11px] font-semibold text-slate-400 block">{art.date}</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <SiteFooter />
      <BachMaiNav />
    </div>
  )
}
