'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Stethoscope, Bell, UserRound, Calendar, ShieldCheck, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DoctorHeaderProps {
  active?: 'schedule' | 'appointments' | 'profile'
}

export function DoctorHeader({ active = 'schedule' }: DoctorHeaderProps) {
  const [userName, setUserName] = useState<string>('ThS. Nguyễn Minh An')
  const [role, setRole] = useState<string>('counselor')
  const pathname = usePathname()

  useEffect(() => {
    const cookies = Object.fromEntries(
      document.cookie.split('; ').map((c) => {
        const [k, v] = c.split('=')
        return [k, decodeURIComponent(v || '')]
      })
    )
    if (cookies.user_name) setUserName(cookies.user_name)
    if (cookies.user_role) setRole(cookies.user_role)

    const refreshProfile = () => {
      const updated = Object.fromEntries(
        document.cookie.split('; ').map((c) => {
          const [k, v] = c.split('=')
          return [k, decodeURIComponent(v || '')]
        })
      )
      if (updated.user_name) setUserName(updated.user_name)
    }
    window.addEventListener('mind-care-profile-updated', refreshProfile)
    return () => window.removeEventListener('mind-care-profile-updated', refreshProfile)
  }, [])

  const doctorNav = [
    { key: 'schedule', label: 'Lịch làm việc & Tham vấn', href: '/counselor', icon: Calendar },
    { key: 'profile', label: 'Hồ sơ cá nhân', href: '/profile', icon: UserRound },
  ]

  const initials =
    userName
      .split(' ')
      .filter(Boolean)
      .slice(-2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'BS'

  return (
    <header className="sticky top-0 z-40 w-full border-b border-teal-200/80 bg-teal-900 text-white shadow-md backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 gap-4">
        {/* Brand Logo - Doctor Portal */}
        <Link href="/counselor" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-950/30 shrink-0 ring-2 ring-teal-400/40">
            <Stethoscope className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-extrabold text-white tracking-tight">MIND CARE</span>
              <span className="rounded-md bg-teal-700/80 px-2 py-0.5 text-[10px] font-bold text-teal-200 uppercase border border-teal-500/40">
                BÁC SĨ / CHUYÊN GIA
              </span>
            </div>
            <span className="text-[9px] font-bold tracking-widest text-teal-300 uppercase">
              HỆ THỐNG QUẢN LÝ KHÁM & THAM VẤN
            </span>
          </div>
        </Link>

        {/* Doctor Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 shrink-0">
          {doctorNav.map((item) => {
            const Icon = item.icon
            const isActive = active === item.key || pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-extrabold whitespace-nowrap transition-all shrink-0',
                  isActive
                    ? 'bg-white text-teal-900 shadow-sm'
                    : 'text-teal-100 hover:text-white hover:bg-teal-800/80'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Doctor Actions & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notification Bell */}
          <Link
            href="/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-teal-700/80 bg-teal-800/60 text-teal-100 hover:border-teal-400 hover:bg-teal-700 hover:text-white transition-colors shrink-0"
            title="Thông báo lịch hẹn mới"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400"></span>
            </span>
          </Link>

          {/* Doctor Profile Direct Link */}
          <Link
            href="/profile"
            className="flex items-center gap-2.5 rounded-2xl border border-teal-700/80 bg-teal-800/80 hover:bg-teal-700/90 p-1.5 pr-3.5 transition-all hover:scale-[1.02] shadow-xs cursor-pointer group shrink-0"
            title="Mở trang Hồ sơ cá nhân & Đăng xuất"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-teal-950 font-black text-xs shadow-sm group-hover:bg-amber-300 transition-colors shrink-0">
              {initials}
            </div>
            <div className="hidden sm:flex flex-col text-left text-xs whitespace-nowrap">
              <span className="font-bold text-white line-clamp-1">{userName}</span>
              <span className="text-[10px] text-teal-300 font-semibold">Bác sĩ / Chuyên gia</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
