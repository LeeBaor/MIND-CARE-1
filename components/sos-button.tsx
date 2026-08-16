'use client'

import { useEffect, useState } from 'react'
import {
  LifeBuoy,
  PhoneCall,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Heart,
  Wind,
  ShieldAlert,
  Send,
  Phone,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type SosState = 'idle' | 'sending' | 'sent'

interface SosButtonProps {
  variant?: 'hero' | 'compact' | 'fab'
  className?: string
}

export function SosButton({ variant = 'hero', className }: SosButtonProps) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<SosState>('idle')
  const [error, setError] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [noteChoice, setNoteChoice] = useState('Cần trò chuyện khẩn cấp')
  
  // Breathing animation timer state
  const [breathPhase, setBreathPhase] = useState<'Hít vào' | 'Giữ hơi' | 'Thở ra'>('Hít vào')

  useEffect(() => {
    // Read user phone from cookies if available
    const match = document.cookie.split('; ').find((row) => row.startsWith('user_phone='))
    if (match) {
      setPhoneInput(decodeURIComponent(match.split('=')[1]))
    }

    // Soothing breathing cycle interval when open
    if (!open) return
    const interval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'Hít vào') return 'Giữ hơi'
        if (prev === 'Giữ hơi') return 'Thở ra'
        return 'Hít vào'
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [open])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    setError('')
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'student-sos',
          phone: phoneInput || 'Chưa cung cấp',
          note: noteChoice,
          createdAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) throw new Error('SOS_NOT_SAVED')
      setState('sent')
    } catch {
      setState('idle')
      setError('Không thể gửi qua hệ thống online. Vui lòng Bấm Gọi Trực Tiếp tới Tổng đài 111 bên dưới.')
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setTimeout(() => setState('idle'), 200)
  }

  const trigger =
    variant === 'fab' ? (
      <Button
        className={cn(
          'h-14 w-14 rounded-full bg-rose-600 text-white shadow-xl shadow-rose-500/40 hover:bg-rose-700 hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse',
          className
        )}
        aria-label="Gửi tín hiệu SOS khẩn cấp"
      >
        <LifeBuoy className="size-7" />
      </Button>
    ) : variant === 'compact' ? (
      <Button
        className={cn(
          'h-10 gap-2 bg-rose-600 px-4 text-white font-extrabold shadow-sm hover:bg-rose-700 active:scale-95 transition-all',
          className
        )}
      >
        <LifeBuoy className="size-4 animate-spin-slow" />
        SOS KHẨN CẤP
      </Button>
    ) : (
      <Button
        className={cn(
          'h-12 gap-2 bg-gradient-to-r from-rose-600 to-red-600 px-6 text-base font-extrabold text-white shadow-lg shadow-rose-600/30 hover:from-rose-700 hover:to-red-700 hover:scale-[1.02] active:scale-95 transition-all duration-200',
          className
        )}
      >
        <ShieldAlert className="size-5 animate-bounce" />
        Cần Trợ Giúp Ngay (SOS 24/7)
      </Button>
    )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent showCloseButton={state !== 'sending'} className="max-w-md rounded-3xl p-6 sm:p-7">
        {state === 'sent' ? (
          <div className="flex flex-col items-center text-center space-y-4 py-2">
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
              <CheckCircle2 className="size-10" />
            </div>

            <DialogHeader className="items-center">
              <DialogTitle className="text-xl font-extrabold text-slate-900">
                Tín Hiệu SOS Đã Được Phát Đi!
              </DialogTitle>
              <DialogDescription className="text-center text-xs text-slate-600 leading-relaxed pt-1">
                Chuyên viên tư vấn tâm lý Mind Care đã nhận được tín hiệu báo động khẩn cấp và sẽ gọi điện cho bạn tại SĐT <strong className="text-slate-900">{phoneInput || 'đã đăng ký'}</strong> trong <strong>1 - 3 phút</strong> tới.
              </DialogDescription>
            </DialogHeader>

            {/* Calming Notice */}
            <div className="w-full rounded-2xl border border-teal-200 bg-teal-50/80 p-4 space-y-2 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
                <Wind className="h-4 w-4 text-teal-600" />
                <span>Trấn an tinh thần trong lúc chờ đợi:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Hãy thả lỏng vai, tìm vị trí ngồi thoải mái, hít một hơi thật sâu và duy trì nhịp thở nhẹ nhàng. Bạn không đơn độc!
              </p>
            </div>

            {/* Direct Calling Hotlines */}
            <div className="w-full space-y-2 pt-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block text-left">
                Nếu tình huống cực kỳ cấp thiết, hãy gọi trực tiếp:
              </span>
              <a
                href="tel:111"
                className="flex items-center justify-between rounded-xl bg-rose-600 p-3 text-white shadow-md hover:bg-rose-700 transition-colors font-bold text-xs"
              >
                <span className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4" /> Tổng đài Khẩn cấp Quốc gia 111
                </span>
                <span className="rounded-lg bg-white/20 px-2 py-0.5 text-[10px]">Gọi 24/7 (Miễn phí)</span>
              </a>
            </div>

            <DialogClose render={<Button variant="outline" className="mt-2 w-full rounded-xl font-bold text-xs" />}>
              Đã hiểu & Đóng
            </DialogClose>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header section */}
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-xs">
                  <ShieldAlert className="size-6 animate-pulse" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-extrabold text-slate-900">
                    Trợ Giúp Khẩn Cấp 24/7 (SOS)
                  </DialogTitle>
                  <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-0.5">
                    <Clock className="h-3.5 w-3.5" /> Chuyên viên sẵn sàng đồng hành 24/7
                  </p>
                </div>
              </div>
              <DialogDescription className="text-xs text-slate-600 leading-relaxed pt-1">
                Nếu bạn đang cảm thấy hoảng loạn, khủng hoảng tâm lý hoặc cần trợ giúp ngay lập tức, hãy chọn hình thức hỗ trợ phù hợp dưới đây:
              </DialogDescription>
            </DialogHeader>

            {/* Direct Dialing Hotlines Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                📞 Gọi trực tiếp đường dây nóng (Nhấn để gọi ngay):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href="tel:111"
                  className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-rose-900 hover:bg-rose-100 transition-all font-bold text-xs group"
                >
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-rose-600 group-hover:scale-110 transition-transform" />
                    <div>
                      <strong className="block text-slate-900">Tổng đài 111</strong>
                      <span className="text-[10px] text-slate-500">Bảo vệ trẻ em & Thanh thiếu niên</span>
                    </div>
                  </div>
                  <span className="rounded-lg bg-rose-600 text-white px-2 py-1 text-[10px] font-extrabold">111</span>
                </a>

                <a
                  href="tel:1900599930"
                  className="flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50/80 p-3 text-teal-900 hover:bg-teal-100 transition-all font-bold text-xs group"
                >
                  <div className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
                    <div>
                      <strong className="block text-slate-900">Hotline Mind Care</strong>
                      <span className="text-[10px] text-slate-500">Hỗ trợ tâm lý khẩn cấp</span>
                    </div>
                  </div>
                  <span className="rounded-lg bg-teal-700 text-white px-2 py-1 text-[10px] font-extrabold">1900 599 930</span>
                </a>
              </div>
            </div>

            {/* Quick Callback Request Form */}
            <form onSubmit={handleSend} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Send className="h-4 w-4 text-rose-600" />
                Hoặc yêu cầu Chuyên viên Mind Care gọi lại cho bạn:
              </span>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Số điện thoại tiếp nhận cuộc gọi</label>
                <input
                  type="tel"
                  required
                  placeholder="Nhập số điện thoại của bạn..."
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Tình trạng cần hỗ trợ</label>
                <select
                  value={noteChoice}
                  onChange={(e) => setNoteChoice(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-rose-500"
                >
                  <option value="Cần trò chuyện khẩn cấp">Cần trò chuyện khẩn cấp</option>
                  <option value="Đang hoảng loạn / áp lực cực độ">Đang hoảng loạn / áp lực cực độ</option>
                  <option value="Cần tư vấn tâm lý gấp">Cần tư vấn tâm lý gấp</option>
                  <option value="Tình huống đặc biệt khác">Tình huống đặc biệt khác</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1 gap-2">
                <DialogClose
                  render={<Button variant="outline" type="button" className="h-10 text-xs font-bold" />}
                  disabled={state === 'sending'}
                >
                  Để sau
                </DialogClose>
                <Button
                  type="submit"
                  disabled={state === 'sending'}
                  className="h-10 flex-1 gap-2 bg-gradient-to-r from-rose-600 to-red-600 text-white font-extrabold text-xs hover:from-rose-700 hover:to-red-700 shadow-md"
                >
                  {state === 'sending' ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Đang phát tín hiệu...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" /> Gửi tín hiệu SOS ngay
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Soothing breathing prompt */}
            <div className="flex items-center justify-between rounded-xl bg-teal-900 text-white p-3 text-xs">
              <span className="flex items-center gap-2 font-medium">
                <Wind className="h-4 w-4 text-teal-300 animate-spin-slow" />
                <span>Nhịp hít thở trấn an: <strong className="text-teal-200 font-extrabold">{breathPhase}</strong>...</span>
              </span>
              <span className="text-[10px] text-teal-300 font-semibold">Quy tắc 4-7-8</span>
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">
                {error}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

