import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adminSessionCookieName, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const isAuthenticated = await verifyAdminSessionToken(
    cookieStore.get(adminSessionCookieName)?.value,
    getAdminSessionSecret(),
  )

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/admin-login?next=%2Fadmin%2Findex.html', request.url))
  }

  return NextResponse.redirect(new URL('/admin', request.url))
}
