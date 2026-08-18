'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Bell, ShieldCheck, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProfileModal } from '@/components/profile-modal'

interface SiteHeaderProps {
  active?: 'home' | 'assessment' | 'dashboard' | 'booking' | 'notifications' | 'results'
}

export function SiteHeader({ active = 'home' }: SiteHeaderProps) {
  const [role, setRole] = useState<string>('patient')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string>('')
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false)
  const pathname = usePathname()

  useEffect(() => {
    // Read cookies
    const cookies = Object.fromEntries(
      document.cookie.split('; ').map((c) => {
        const [k, v] = c.split('=')
        return [k, decodeURIComponent(v || '')]
      })
    )
    setIsLoggedIn(cookies.is_logged_in === 'true')
    if (cookies.user_role) setRole(cookies.user_role)
    if (cookies.user_name) setUserName(cookies.user_name)
    const refreshProfile = () => {
      const updated = Object.fromEntries(document.cookie.split('; ').map((c) => {
        const [k, v] = c.split('=')
        return [k, decodeURIComponent(v || '')]
      }))
      if (updated.user_name) setUserName(updated.user_name)
    }
    window.addEventListener('mind-care-profile-updated', refreshProfile)
    return () => window.removeEventListener('mind-care-profile-updated', refreshProfile)
  }, [])

  const patientNav = [
    { key: 'home', label: 'Trang chủ', href: '/' },
    { key: 'dashboard', label: 'Chức năng', href: '/dashboard' },
    { key: 'booking', label: 'Đặt lịch khám', href: '/booking' },
    { key: 'assessment', label: 'Trắc nghiệm tâm lý', href: '/assessment' },
    { key: 'results', label: 'Kết quả & Hồ sơ', href: '/results' },
  ]

  const adminNav = [
    { key: 'admin', label: 'Quản trị Admin', href: '/admin' },
    { key: 'counselor', label: 'Trang Chuyên viên', href: '/counselor' },
  ]

  const counselorNav = [
    { key: 'counselor', label: 'Trang Chuyên viên', href: '/counselor' },
  ]

  const nav = role === 'admin' ? adminNav : role === 'counselor' ? counselorNav : patientNav
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'MC'

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20 shrink-0">
              <Heart className="h-5 w-5 fill-white/20 stroke-[2.5]" />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-heading text-lg font-extrabold text-teal-900 tracking-tight">MIND CARE</span>
              <span className="text-[9px] font-bold tracking-widest text-teal-600 uppercase">TƯ VẤN SỨC KHỎE TINH THẦN</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {nav.map((item) => {
              const isActive = active === item.key || pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs xl:text-sm font-extrabold whitespace-nowrap transition-all shrink-0',
                    isActive
                      ? 'bg-teal-50 text-teal-700 font-extrabold shadow-2xs'
                      : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {isLoggedIn ? (
              <>
                {/* Notification Bell */}
                <Link
                  href="/notifications"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 transition-colors shrink-0"
                  title="Thông báo"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                  </span>
                </Link>

                {/* Profile Avatar Direct Link - Always links to /profile */}
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 rounded-2xl border border-teal-200 bg-teal-50/80 hover:bg-teal-100/80 p-1.5 pr-3 transition-all hover:scale-[1.02] shadow-xs cursor-pointer group shrink-0"
                  title="Mở trang Hồ sơ cá nhân & Đăng xuất"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white font-extrabold text-xs shadow-sm group-hover:bg-teal-700 transition-colors shrink-0">
                    {role === 'admin' ? 'AD' : role === 'counselor' ? 'BS' : initials}
                  </div>
                  <div className="hidden sm:flex flex-col text-left text-xs whitespace-nowrap">
                    <span className="font-bold text-teal-950 line-clamp-1">{userName || 'Tài khoản'}</span>
                    <span className="text-[10px] text-teal-700 font-semibold">
                      {role === 'admin' ? 'Quản trị viên' : role === 'counselor' ? 'Bác sĩ / Chuyên gia' : 'Hồ sơ cá nhân'}
                    </span>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-50 whitespace-nowrap shrink-0"
                >
                  <UserRound className="h-4 w-4" />
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-teal-600 px-3 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-teal-700 whitespace-nowrap shrink-0"
                >
                  Tạo tài khoản
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
