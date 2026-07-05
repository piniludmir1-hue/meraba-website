import { NextRequest, NextResponse } from 'next/server'
import { adminSessionCookieName, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminAuth'

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
}

function withSecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([header, value]) => {
    response.headers.set(header, value)
  })

  return response
}

function isInternalRedirectTarget(value: string | null): value is string {
  return Boolean(value && value.startsWith('/') && !value.startsWith('//'))
}

function getLoginUrl(request: NextRequest) {
  const loginUrl = new URL('/admin-login', request.url)
  const nextPath = request.nextUrl.pathname === '/admin/index.html'
    ? '/admin'
    : `${request.nextUrl.pathname}${request.nextUrl.search}`

  loginUrl.searchParams.set('next', nextPath)

  return loginUrl
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/')
  const isAdminApiPath = pathname.startsWith('/api/admin/')
  const isDecapApiPath = pathname === '/api/decap' || pathname.startsWith('/api/decap/')
  const isPublicAdminApiPath = pathname === '/api/admin/login' || pathname === '/api/admin/logout'

  if (pathname === '/admin/index.html') {
    const sessionSecret = getAdminSessionSecret()
    const isAuthenticated = await verifyAdminSessionToken(
      request.cookies.get(adminSessionCookieName)?.value,
      sessionSecret,
    )

    if (isAuthenticated) {
      return withSecurityHeaders(NextResponse.redirect(new URL('/admin', request.url)))
    }

    return withSecurityHeaders(NextResponse.redirect(getLoginUrl(request)))
  }

  if (pathname === '/admin-login') {
    const sessionSecret = getAdminSessionSecret()
    const isAuthenticated = await verifyAdminSessionToken(
      request.cookies.get(adminSessionCookieName)?.value,
      sessionSecret,
    )

    if (isAuthenticated) {
      const nextUrl = request.nextUrl.searchParams.get('next')
      const safeNextUrl = isInternalRedirectTarget(nextUrl) ? nextUrl : '/admin'
      const normalizedNextUrl = safeNextUrl === '/admin/index.html' ? '/admin' : safeNextUrl

      return withSecurityHeaders(NextResponse.redirect(new URL(normalizedNextUrl, request.url)))
    }
  }

  if (isAdminPath || isDecapApiPath || (isAdminApiPath && !isPublicAdminApiPath)) {
    const sessionSecret = getAdminSessionSecret()
    const isAuthenticated = await verifyAdminSessionToken(
      request.cookies.get(adminSessionCookieName)?.value,
      sessionSecret,
    )

    if (!isAuthenticated) {
      if (isAdminApiPath || isDecapApiPath) {
        return withSecurityHeaders(NextResponse.json({ message: 'Authentication required.' }, { status: 401 }))
      }

      return withSecurityHeaders(NextResponse.redirect(getLoginUrl(request)))
    }
  }

  return withSecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|brand|images|uploads).*)'],
}
