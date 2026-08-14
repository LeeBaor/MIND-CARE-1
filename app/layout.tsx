import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MINDCARE — Chăm sóc sức khỏe tinh thần',
  description:
    'Nền tảng theo dõi và hỗ trợ sức khỏe tinh thần cho học sinh: khảo sát định kỳ, nhật ký cảm xúc, nút SOS khẩn cấp và bảng điều khiển dành cho chuyên viên tư vấn.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#3aa6a0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className="bg-background">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="content-language" content="vi" />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
