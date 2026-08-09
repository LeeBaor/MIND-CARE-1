import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BachMaiNav } from '@/components/bachmai-nav'
import { BookingFlow } from '@/components/booking/booking-flow'

export default function BookingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader active="booking" />
      
      <main className="flex-1 py-6 pb-16 md:pb-12">
        <BookingFlow />
      </main>

      <SiteFooter />
      <BachMaiNav />
    </div>
  )
}
