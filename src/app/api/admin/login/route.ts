import { NextResponse } from 'next/server'
import {
  adminSessionCookieName,
  adminSessionDurationMs,
  createAdminSessionToken,
  getAdminSessionSecret,
  isSecureCookieEnvironment,
  verifyAdminPassword,
} from '@/lib/adminAuth'

type LoginAttempt = {
  count: number
  resetAt: number
}

const loginAttempts = new Map<string, LoginAttempt>()
const maxAttempts = 5
const rateLimitWindowMs = 1000 * 60 * 15

function getClientKey(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
}

function isSafeRedirect(value: unknown) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
}

function getAttemptState(key: string, now: number) {
  const existingAttempt = loginAttempts.get(key)

  if (!existingAttempt || existingAttempt.resetAt <= now) {
    return { count: 0, resetAt: now + rateLimitWindowMs }
  }

  return existingAttempt
}

export async function POST(request: Request) {
  const now = Date.now()
  const clientKey = getClientKey(request)
  const attemptState = getAttemptState(clientKey, now)

  if (attemptState.count >= maxAttempts) {
    return NextResponse.json(
      { message: 'Too many login attempts. Please try again later.' },
      { status: 429 },
    )
  }

  let body: { username?: string; password?: string; next?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Invalid login request.' }, { status: 400 })
  }

  const expectedUsername = process.env.ADMIN_USERNAME || ''
  const sessionSecret = getAdminSessionSecret()
  const username = body.username?.trim() || ''
  const password = body.password || ''
  const isConfigured = Boolean(expectedUsername && sessionSecret && (process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH_SHA256))
  const isValidLogin = isConfigured && username === expectedUsername && await verifyAdminPassword(password)

  if (!isValidLogin) {
    loginAttempts.set(clientKey, { count: attemptState.count + 1, resetAt: attemptState.resetAt })

    return NextResponse.json({ message: 'Invalid username or password.' }, { status: 401 })
  }

  loginAttempts.delete(clientKey)

  const redirectTo = isSafeRedirect(body.next) ? body.next : '/admin'
  const response = NextResponse.json({ redirectTo })
  const sessionToken = await createAdminSessionToken(sessionSecret)

  response.cookies.set(adminSessionCookieName, sessionToken, {
    httpOnly: true,
    secure: isSecureCookieEnvironment(),
    sameSite: 'lax',
    maxAge: Math.floor(adminSessionDurationMs / 1000),
    path: '/',
  })

  return response
}
