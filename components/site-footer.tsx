import Link from 'next/link'
import { Heart, PhoneCall, ShieldCheck, Mail, MapPin } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-teal-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4 sm:px-6">
        
        {/* Brand info */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <Heart className="h-5 w-5 fill-white/20 stroke-[2.5]" />
            </div>
            <span className="font-heading text-base font-extrabold tracking-tight text-teal-900">
              MIND CARE
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-slate-500 font-medium">
            Hệ thống Nền tảng Đặt lịch Tư vấn & Chăm sóc Sức khỏe Tinh thần Trực tuyến theo tiêu chuẩn y tế hiện đại.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2 text-xs">
          <p className="font-heading font-extrabold text-teal-900 uppercase tracking-wider">Dịch vụ chính</p>
          <Link href="/" className="text-slate-600 hover:text-teal-700 font-medium">Trang chủ & Lối tắt</Link>
          <Link href="/booking" className="text-slate-600 hover:text-teal-700 font-medium">Đặt lịch khám chuyên khoa</Link>
          <Link href="/assessment" className="text-slate-600 hover:text-teal-700 font-medium">Trắc nghiệm GAD-7 / PHQ-9</Link>
          <Link href="/results" className="text-slate-600 hover:text-teal-700 font-medium">Kết quả & Hồ sơ cá nhân</Link>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-2 text-xs">
          <p className="font-heading font-extrabold text-teal-900 uppercase tracking-wider">Tư vấn & Hỗ trợ</p>
          <span className="text-slate-600 font-medium flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-teal-600" /> Trung tâm Y tế & Tư vấn Mind Care
          </span>
          <span className="text-slate-600 font-medium flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-teal-600" /> hotro@mindcare.vn
          </span>
          <span className="text-slate-500 font-medium">Giờ tư vấn: 07:30 - 20:30 (Thứ 2 - CN)</span>
        </div>

        {/* Emergency Hotline */}
        <div className="flex flex-col gap-2.5 text-xs">
          <p className="font-heading font-extrabold text-teal-900 uppercase tracking-wider">Hotline Khẩn cấp</p>
          <a href="tel:1900888866" className="inline-flex items-center gap-2 rounded-xl bg-teal-50 border border-teal-200 px-3 py-2 font-bold text-teal-800 hover:bg-teal-100 transition-colors w-fit">
            <PhoneCall className="h-4 w-4 text-teal-600" /> 1900 888 866
          </a>
          <span className="text-slate-500 font-medium">Hỗ trợ khủng hoảng tâm lý 24/7</span>
        </div>

      </div>

      <div className="border-t border-slate-100 py-4 bg-slate-50/50">
        <p className="text-center text-xs font-semibold text-slate-500">
          © 2026 MIND CARE - Giải pháp Chăm sóc Sức khỏe Tinh thần & Khám tư vấn Tâm lý Trực tuyến.
        </p>
      </div>
    </footer>
  )
}
