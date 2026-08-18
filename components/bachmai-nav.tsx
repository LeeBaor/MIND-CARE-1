'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, ClipboardList, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BachMaiNav() {
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Tài khoản',
      href: '/profile',
      icon: User,
      active: pathname.startsWith('/profile'),
    },
    {
      label: 'Kết quả',
      href: '/results',
      icon: ClipboardList,
      active: pathname.startsWith('/results'),
    },
    {
      label: 'Trang chủ',
      href: '/',
      icon: Home,
      active: pathname === '/',
    },
    {
      label: 'Lịch hẹn',
      href: '/booking',
      icon: Calendar,
      active: pathname.startsWith('/booking'),
    },
    {
      label: 'Chức năng',
      href: '/dashboard',
      icon: ClipboardList,
      active: pathname.startsWith('/dashboard'),
    },
  ]

  return (
    <nav 
      aria-label="Điều hướng chính kiểu ứng dụng" 
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-emerald-100 bg-white/95 px-2 py-1.5 backdrop-blur-lg shadow-lg md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-2 transition-all rounded-xl',
                item.active
                  ? 'text-teal-700 font-bold scale-105'
                  : 'text-slate-500 hover:text-teal-600 font-medium'
              )}
            >
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                  item.active ? 'bg-teal-50 text-teal-700' : 'bg-transparent'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="mt-0.5 text-[11px] leading-tight whitespace-nowrap">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
