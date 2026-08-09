import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { SosButton } from '@/components/sos-button'

const STEPS = [
  {
    step: '1',
    title: 'Chọn tên & lớp của em',
    desc: 'Truy cập trang khảo sát và xác nhận thông tin để bắt đầu.',
  },
  {
    step: '2',
    title: 'Trả lời bộ câu hỏi',
    desc: 'Chỉ mất vài phút với những câu hỏi đơn giản về cảm xúc gần đây của em.',
  },
  {
    step: '3',
    title: 'Nhận kết quả & lời khuyên',
    desc: 'Xem mức độ của mình và những gợi ý chăm sóc phù hợp, hoàn toàn riêng tư.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-col gap-2 text-center">
          <span className="text-sm font-bold uppercase tracking-wide text-primary">
            Hướng dẫn cho học sinh
          </span>
          <h3 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            Bắt đầu chỉ với 3 bước
          </h3>
        </div>

        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.step}
              className="relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary font-heading text-lg font-bold text-primary-foreground">
                {s.step}
              </span>
              <h4 className="font-heading text-lg font-semibold text-foreground">{s.title}</h4>
              <p className="leading-relaxed text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-center gap-5 rounded-3xl bg-primary px-6 py-10 text-center">
          <h3 className="text-balance font-heading text-2xl font-bold text-primary-foreground md:text-3xl">
            Em đang cảm thấy không ổn?
          </h3>
          <p className="max-w-md text-pretty leading-relaxed text-primary-foreground/85">
            Đừng giữ mọi thứ một mình. Hãy làm khảo sát hoặc gửi tín hiệu SOS — luôn có người
            sẵn sàng lắng nghe và giúp đỡ em.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/assessment"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'lg' }),
                'h-12 px-6 text-base',
              )}
            >
              Làm bài khảo sát
            </Link>
            <SosButton />
          </div>
        </div>
      </div>
    </section>
  )
}
