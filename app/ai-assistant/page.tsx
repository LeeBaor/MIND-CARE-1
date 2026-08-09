import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BachMaiNav } from '@/components/bachmai-nav'
import { ChatWindow } from '@/components/ai-assistant/chat-window'

export default function AIAssistantPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader active="ai-assistant" />
      
      <main className="flex-1 py-6 pb-16 md:pb-12">
        <ChatWindow />
      </main>

      <SiteFooter />
      <BachMaiNav />
    </div>
  )
}
