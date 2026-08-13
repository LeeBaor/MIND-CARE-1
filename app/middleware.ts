import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { readSessionToken } from '@/lib/session'

const publicPaths = ['/', '/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (
    publicPaths.includes(pathname) ||
    pathname.startsWith('/api/auth') ||
    pathname === '/api/alerts' ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) return NextResponse.next()

  const session = await readSessionToken(request.cookies.get('auth_session')?.value)
  if (!session) {
    if (pathname.startsWith('/api/')) return NextResponse.json({ message: 'Bạn cần đăng nhập.' }, { status: 401 })
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/counselor') && !['counselor', 'admin'].includes(session.role)) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
