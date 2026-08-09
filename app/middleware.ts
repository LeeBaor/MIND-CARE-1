import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const role = request.cookies.get('user_role')?.value
  const loggedIn = request.cookies.get('is_logged_in')?.value
  const { pathname } = request.nextUrl

  // Cho phép truy cập công khai các đường dẫn auth & assets
  if (
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Yêu cầu đăng nhập trước khi truy cập bất kỳ trang nào
  if (!loggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Phân luồng vai trò Chuyên viên (/counselor) vs Người dùng (/ hoặc /dashboard)
  if (pathname.startsWith('/counselor') && role !== 'counselor' && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
