'use client'

import { useState } from 'react'
import { Bot, Paperclip, Send, Calendar, UserSearch, FileText, Sparkles, User } from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: number
  sender: 'bot' | 'user'
  text: string
  time: string
  list?: string[]
}

function buildSupportReply(text: string): Pick<Message, 'text' | 'list'> {
  const normalized = text.toLowerCase()
  if (/tự sát|tu sat|muốn chết|muon chet|tự làm hại|tu lam hai|không muốn sống|khong muon song/.test(normalized)) {
    return { text: 'Mình rất tiếc vì bạn đang phải chịu đựng điều này. Điều quan trọng nhất lúc này là an toàn của bạn. Hãy gọi 115 hoặc 111, hoặc liên hệ ngay với một người thân đang ở gần bạn. Bạn không cần phải ở một mình.', list: ['Di chuyển đến nơi có người hoặc nơi an toàn.', 'Gọi 115/111 hoặc nhờ người thân hỗ trợ ngay.', 'Bạn có thể bấm SOS để gửi yêu cầu hỗ trợ khẩn cấp.'] }
  }
  if (/chán|chan|tuyệt vọng|tuyet vong|kiệt sức|kiet suc/.test(normalized)) {
    return { text: 'Cảm ơn bạn đã nói ra điều này. Cảm giác chán nản hoặc kiệt sức có thể rất nặng nề; bạn không cần tự giải quyết tất cả ngay bây giờ.', list: ['Thử uống nước, ngồi ở nơi yên tĩnh và hít thở chậm 4 nhịp.', 'Ghi lại điều khiến bạn mệt nhất hôm nay.', 'Nếu cảm giác kéo dài hoặc bạn thấy không an toàn, hãy đặt lịch gặp chuyên gia hoặc bấm SOS.'] }
  }
  if (/lo âu|lo au|hoảng|hoang|tim đập|tim dap/.test(normalized)) {
    return { text: 'Những dấu hiệu lo âu có thể khiến cơ thể rất khó chịu. Mình có thể cùng bạn làm một bước nhỏ ngay bây giờ: hít vào 4 giây, giữ 4 giây, thở ra 6 giây; lặp lại 5 lần.', list: ['Tránh cà phê hoặc chất kích thích trong vài giờ tới.', 'Ghi mức lo âu từ 1–10 và điều vừa xảy ra.', 'Nếu lặp lại nhiều ngày, hãy làm GAD-7 và đặt lịch tư vấn.'] }
  }
  if (/mất ngủ|mat ngu|khó ngủ|kho ngu|ngủ không/.test(normalized)) {
    return { text: 'Mất ngủ thường làm cảm xúc nhạy cảm hơn vào ngày hôm sau. Tối nay bạn có thể ưu tiên một nhịp sinh hoạt nhẹ nhàng thay vì cố ép mình phải ngủ ngay.', list: ['Ngừng màn hình sáng 30 phút trước khi ngủ.', 'Thử bài thở 4–7–8 hoặc thư giãn cơ thể 10 phút.', 'Theo dõi giờ ngủ 7 ngày; nếu kéo dài, hãy trao đổi cùng chuyên gia.'] }
  }
  return { text: 'Cảm ơn bạn đã chia sẻ. Mình đã ghi nhận điều bạn nói và có thể giúp bạn chọn bước tiếp theo phù hợp.', list: ['Bạn muốn nói thêm về điều gì khiến bạn khó chịu nhất?', 'Bạn có thể làm bài sàng lọc hoặc đặt lịch với chuyên gia.', 'Nếu có nguy cơ khẩn cấp, hãy bấm SOS để được hỗ trợ ngay.'] }
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      text: '👋 Xin chào! Tôi là Trợ lý AI của Mind Care. Tôi có thể giúp bạn:',
      list: [
        'Tư vấn sơ bộ về cảm xúc & sức khỏe tinh thần',
        'Hướng dẫn làm bài trắc nghiệm PHQ-9 & GAD-7',
        'Tìm kiếm chuyên gia & bác sĩ tâm lý phù hợp',
        'Hướng dẫn đặt lịch tư vấn trực tuyến',
      ],
      time: '09:24',
    },
    {
      id: 2,
      sender: 'user',
      text: 'Tôi thường xuyên lo âu và mất ngủ 2 tuần nay thì nên khám gì?',
      time: '09:24',
    },
    {
      id: 3,
      sender: 'bot',
      text: 'Chào mừng quý khách đến với Mind Care! Tình trạng lo âu kéo dài kèm mất ngủ là dấu hiệu cần được quan tâm sớm.\n\nBạn nên thực hiện bài trắc nghiệm GAD-7 để đánh giá mức độ lo âu, đồng thời đặt lịch tư vấn 1-1 với Thạc sĩ / Bác sĩ chuyên khoa Tâm lý Trị liệu của Mind Care.',
      time: '09:25',
    },
  ])

  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const reply = buildSupportReply(userMsg.text)
      const botMsg: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: reply.text,
        list: reply.list,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botMsg])
    }, 1000)
  }

  return (
    <div className="mx-auto max-w-2xl px-2 py-4 sm:px-4">
      {/* Mobile/Desktop Chat Frame styled after Screen 4 Bach Mai App */}
      <div className="flex flex-col h-[650px] rounded-3xl border border-slate-200 bg-slate-50/50 shadow-xl overflow-hidden">
        {/* Emerald Header Bar */}
        <div className="bg-teal-700 px-4 py-3 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white border border-white/20 backdrop-blur-xs">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base leading-tight">Trợ lý AI Mind Care</h3>
              <p className="text-[11px] text-teal-100 font-medium">Bảo vệ sức khỏe tinh thần 24/7</p>
            </div>
          </div>
          <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse" title="Đang hoạt động" />
        </div>

        {/* Quick Action Tag Pills (Top) */}
        <div className="bg-white px-3 py-2 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Link href="/booking" className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 px-3 py-1.5 text-xs font-bold text-slate-700 shrink-0 border border-slate-200/80 transition-colors">
            <Calendar className="h-3.5 w-3.5 text-teal-600" />
            <span>Đặt lịch khám</span>
          </Link>
          <Link href="/assessment" className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 px-3 py-1.5 text-xs font-bold text-slate-700 shrink-0 border border-slate-200/80 transition-colors">
            <FileText className="h-3.5 w-3.5 text-emerald-600" />
            <span>Test GAD-7 & PHQ-9</span>
          </Link>
          <button onClick={() => setInput('Gợi ý cho tôi bài tập giảm stress nhanh')} className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 px-3 py-1.5 text-xs font-bold text-slate-700 shrink-0 border border-slate-200/80 transition-colors">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Mẹo giảm stress</span>
          </button>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-none font-medium'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-medium'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                {msg.list && (
                  <ul className="mt-2 space-y-1 pl-1">
                    {msg.list.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-teal-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <span className={`block mt-1.5 text-[10px] text-right ${msg.sender === 'user' ? 'text-teal-100' : 'text-slate-400'}`}>
                  {msg.time}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating Chat Input Bar */}
        <div className="bg-white p-3 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2"
          >
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 pr-10 text-xs sm:text-sm text-slate-800 focus:border-teal-600 focus:bg-white focus:outline-none transition-all"
              />
              <button
                type="button"
                className="absolute right-2.5 text-slate-400 hover:text-teal-600 p-1"
                title="Đính kèm tệp"
              >
                <Paperclip className="h-4 w-4" />
              </button>
            </div>
            <button
              type="submit"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md hover:bg-teal-700 transition-transform active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
