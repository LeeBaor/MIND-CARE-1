import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { SosButton } from '@/components/sos-button'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm font-semibold text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            Chăm sóc sức khỏe tinh thần học đường
          </span>
          <h1 className="text-pretty font-heading text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            Nơi mỗi học sinh đều được <span className="text-primary">lắng nghe</span> và{' '}
            <span className="text-primary">quan tâm</span>
          </h1>
          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
            MIND-CARE giúp các em theo dõi cảm xúc mỗi ngày, thực hiện khảo sát định kỳ và
            kết nối nhanh với chuyên viên tư vấn khi cần — an toàn, riêng tư và luôn sẵn sàng.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/assessment"
              className={cn(buttonVariants({ size: 'lg' }), 'h-12 px-6 text-base')}
            >
              Làm bài khảo sát
            </Link>
            <SosButton />
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-success" />
            Thông tin cá nhân được bảo mật tuyệt đối.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-4xl bg-secondary" />
          <div className="overflow-hidden rounded-4xl border border-border bg-card">
            <Image
              src="/images/hero-wellbeing.png"
              alt="Chuyên viên tư vấn đang trò chuyện và hỗ trợ học sinh trong không gian ấm áp"
              width={720}
              height={640}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
