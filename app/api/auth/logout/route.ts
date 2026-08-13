import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  for (const name of ['auth_session', 'is_logged_in', 'user_role', 'user_name', 'user_email', 'anonymous_id']) {
    response.cookies.set(name, '', { httpOnly: name === 'auth_session', path: '/', expires: new Date(0) })
  }
  return response
}
