import { promises as fs } from 'fs'
import path from 'path'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adminSessionCookieName, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const isAuthenticated = await verifyAdminSessionToken(
    cookieStore.get(adminSessionCookieName)?.value,
    getAdminSessionSecret(),
  )

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/admin-login?next=%2Fadmin%2Fconfig.yml', request.url))
  }

  const config = await fs.readFile(path.join(process.cwd(), 'src', 'cms', 'config.yml'), 'utf8')

  return new NextResponse(config, {
    headers: {
      'Content-Type': 'text/yaml; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
