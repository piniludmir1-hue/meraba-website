import { NextResponse } from 'next/server'
import { adminSessionCookieName, isSecureCookieEnvironment } from '@/lib/adminAuth'

export async function POST() {
  const response = NextResponse.json({ redirectTo: '/admin-login' })

  response.cookies.set(adminSessionCookieName, '', {
    httpOnly: true,
    secure: isSecureCookieEnvironment(),
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  return response
}
