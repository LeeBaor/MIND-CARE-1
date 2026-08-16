import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { readSessionToken } from '@/lib/session'

const publicPaths = ['/', '/login', '/register']

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Redirect old AI assistant route to home
  if (pathname.startsWith('/ai-assistant')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Allow static files, auth APIs, public assets, login/register pages
  if (
    publicPaths.includes(pathname) ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check auth session
  const session = await readSessionToken(request.cookies.get('auth_session')?.value)

  if (!session) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ message: 'Bạn cần đăng nhập để thực hiện thao tác này.' }, { status: 401 })
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  // Role restriction for counselor section
  if (pathname.startsWith('/counselor') && !['counselor', 'admin'].includes(session.role)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
