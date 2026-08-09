import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BachMaiNav } from '@/components/bachmai-nav'
import { NotificationCenter } from '@/components/notifications/notification-center'

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader active="notifications" />
      
      <main className="flex-1 py-6 pb-16 md:pb-12">
        <NotificationCenter />
      </main>

      <SiteFooter />
      <BachMaiNav />
    </div>
  )
}
