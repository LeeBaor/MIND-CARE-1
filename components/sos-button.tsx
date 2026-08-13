'use client'

import { useState } from 'react'
import { LifeBuoy, PhoneCall, CheckCircle2, Loader2 } from 'lucide-react'
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

  async function handleSend() {
    setState('sending')
    setError('')
    try {
      const response = await fetch('/api/alerts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'student-sos' }) })
      if (!response.ok) throw new Error('SOS_NOT_SAVED')
      setState('sent')
    } catch {
      setState('idle')
      setError('Không thể gửi qua hệ thống. Nếu bạn đang không an toàn, hãy gọi ngay Tổng đài 111.')
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
          'h-14 w-14 rounded-full bg-danger text-danger-foreground shadow-lg shadow-danger/30 hover:bg-danger/90',
          className,
        )}
        aria-label="Gửi tín hiệu SOS khẩn cấp"
      >
        <LifeBuoy className="size-6" />
      </Button>
    ) : variant === 'compact' ? (
      <Button
        className={cn(
          'h-10 gap-2 bg-danger px-4 text-danger-foreground hover:bg-danger/90',
          className,
        )}
      >
        <LifeBuoy className="size-4" />
        SOS
      </Button>
    ) : (
      <Button
        className={cn(
          'h-12 gap-2 bg-danger px-6 text-base font-bold text-danger-foreground shadow-md shadow-danger/25 hover:bg-danger/90',
          className,
        )}
      >
        <LifeBuoy className="size-5" />
        Cần trợ giúp ngay (SOS)
      </Button>
    )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent showCloseButton={state !== 'sending'}>
        {state === 'sent' ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="size-8" />
            </span>
            <DialogHeader className="items-center">
              <DialogTitle className="text-lg">Tín hiệu đã được gửi đi</DialogTitle>
              <DialogDescription className="text-center">
                Chuyên viên tư vấn đã nhận được yêu cầu của em và sẽ liên hệ trong ít phút tới.
                Em hãy hít thở sâu và ở nơi an toàn nhé.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 w-full rounded-xl bg-muted p-3 text-sm">
              <p className="font-semibold text-foreground">Đường dây nóng 24/7</p>
              <a
                href="tel:111"
                className="mt-1 inline-flex items-center gap-2 font-semibold text-primary"
              >
                <PhoneCall className="size-4" /> Tổng đài 111 — Bảo vệ trẻ em
              </a>
            </div>
            <DialogClose render={<Button variant="outline" className="mt-1 w-full" />}>
              Đóng
            </DialogClose>
          </div>
        ) : (
          <>
            <DialogHeader>
              <span className="flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
                <LifeBuoy className="size-6" />
              </span>
              <DialogTitle className="text-lg">Gửi tín hiệu trợ giúp khẩn cấp?</DialogTitle>
              <DialogDescription>
                Một chuyên viên tư vấn sẽ được thông báo ngay lập tức và chủ động liên hệ với em.
                Thông tin của em được bảo mật tuyệt đối.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 sm:flex-row">
              <DialogClose
                render={<Button variant="outline" className="h-11 flex-1" />}
                disabled={state === 'sending'}
              >
                Để sau
              </DialogClose>
              <Button
                onClick={handleSend}
                disabled={state === 'sending'}
                className="h-11 flex-1 gap-2 bg-danger text-danger-foreground hover:bg-danger/90"
              >
                {state === 'sending' ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Đang gửi...
                  </>
                ) : (
                  <>Gửi ngay</>
                )}
              </Button>
            </div>
            {error && <p role="alert" className="rounded-xl border border-danger/30 bg-danger/5 p-3 text-sm font-medium text-danger">{error}</p>}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
