import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BachMaiNav } from '@/components/bachmai-nav'
import { AssessmentFlow } from '@/components/assessment/assessment-flow'

export default function AssessmentPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader active="assessment" />
      
      <main className="flex-1 py-6 pb-16 md:pb-12">
        <AssessmentFlow />
      </main>

      <SiteFooter />
      <BachMaiNav />
    </div>
  )
}
