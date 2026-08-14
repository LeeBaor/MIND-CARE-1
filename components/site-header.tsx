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

  const counselorNav = [
    { key: 'counselor', label: 'Trang Chuyên viên', href: '/counselor' },
    { key: 'dashboard', label: 'Lịch tư vấn bệnh nhân', href: '/counselor' },
  ]

  const nav = role === 'counselor' ? counselorNav : patientNav
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((name) => name[0])
    .join('')
    .toUpperCase() || 'ND'
  const showPersonalIdentity = pathname !== '/'

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-teal-100 bg-white/95 backdrop-blur-md shadow-xs">
        {/* Top Banner Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-700" />
        
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Brand Logo */}
          <Link href={role === 'counselor' ? '/counselor' : '/'} className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
              <Heart className="h-5 w-5 fill-white/20 stroke-[2.5]" />
              <ShieldCheck className="absolute -bottom-1 -right-1 h-4 w-4 text-emerald-300 fill-teal-800" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-lg font-extrabold tracking-tight text-teal-900 leading-tight">
                  MIND CARE
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded">
                  {role === 'counselor' ? 'CHUYÊN VIÊN' : 'BỆNH NHÂN'}
                </span>
              </div>
              <span className="text-[10px] font-semibold tracking-wider text-teal-600 uppercase">
                TƯ VẤN SỨC KHỎE TINH THẦN
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">
            {nav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'rounded-xl px-3 py-2 text-sm font-semibold transition-all',
                  active === item.key
                    ? 'bg-teal-50 text-teal-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & User Profile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn ? (
              <>
            {/* Notification Bell */}
            <Link
              href="/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              title="Thông báo"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
              </span>
            </Link>

            {/* Profile Avatar Trigger Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2.5 rounded-2xl border border-teal-200 bg-teal-50/80 hover:bg-teal-100/80 p-1.5 pr-3 transition-all hover:scale-[1.02] shadow-xs cursor-pointer group"
              title="Xem thông tin cá nhân"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white font-extrabold text-xs shadow-sm group-hover:bg-teal-700 transition-colors">
                {role === 'counselor' ? 'BS' : initials}
              </div>
              <div className="hidden sm:flex flex-col text-left text-xs">
                <span className="font-bold text-teal-950 line-clamp-1">{showPersonalIdentity ? userName || 'Tài khoản' : 'Tài khoản'}</span>
                <span className="text-[10px] text-teal-700 font-semibold">
                  {role === 'counselor' ? 'Bác sĩ / Chuyên gia' : 'Hồ sơ cá nhân'}
                </span>
              </div>
            </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-50"
                >
                  <UserRound className="h-4 w-4" />
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-teal-600 px-3 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-teal-700"
                >
                  Tạo tài khoản
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Interactive Profile Modal */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  )
}
