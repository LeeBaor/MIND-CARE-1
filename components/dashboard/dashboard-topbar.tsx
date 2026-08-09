import Link from 'next/link'
import { HeartHandshake, ExternalLink } from 'lucide-react'

interface DashboardTopbarProps {
  breadcrumb?: { label: string; href?: string }[]
}

export function DashboardTopbar({ breadcrumb }: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <HeartHandshake className="size-5" />
            </span>
            <span className="font-heading text-base font-bold text-foreground">
              MIND<span className="text-primary">-CARE</span>
            </span>
          </Link>
          <span className="hidden rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground sm:inline">
            Chuyên viên
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hidden items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground sm:flex"
          >
            Trang học sinh <ExternalLink className="size-3.5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-foreground">Chưa có hồ sơ chuyên gia</p>
              <p className="text-xs text-muted-foreground">Phòng Tư vấn tâm lý</p>
            </div>
            <span className="flex size-9 items-center justify-center rounded-full bg-secondary font-heading text-sm font-bold text-primary">
              TH
            </span>
          </div>
        </div>
      </div>
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="border-t border-border bg-background">
          <nav className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
            {breadcrumb.map((b, i) => (
              <span key={b.label} className="flex items-center gap-2">
                {b.href ? (
                  <Link href={b.href} className="hover:text-foreground">
                    {b.label}
                  </Link>
                ) : (
                  <span className="font-medium text-foreground">{b.label}</span>
                )}
                {i < breadcrumb.length - 1 && <span>/</span>}
              </span>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
