import Script from 'next/script'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminSessionCookieName, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminAuth'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isAuthenticated = await verifyAdminSessionToken(
    cookieStore.get(adminSessionCookieName)?.value,
    getAdminSessionSecret(),
  )

  if (!isAuthenticated) {
    redirect('/admin-login?next=%2Fadmin')
  }

  return (
    <main id="main-content" className="min-h-screen bg-white">
      <button
        id="meraba-admin-logout"
        type="button"
        style={{
          position: 'fixed',
          right: '16px',
          bottom: '16px',
          zIndex: 9999,
          border: '1px solid #d5dce5',
          background: '#fff',
          color: '#07111f',
          borderRadius: '999px',
          padding: '9px 14px',
          font: '700 12px Arial,sans-serif',
          letterSpacing: '.04em',
          textTransform: 'uppercase',
          boxShadow: '0 12px 36px rgba(7,17,31,.12)',
          cursor: 'pointer',
        }}
      >
        Log out
      </button>
      <Script id="meraba-admin-logout-script">
        {`
          document.getElementById('meraba-admin-logout').addEventListener('click', function () {
            fetch('/api/admin/logout', { method: 'POST' })
              .then(function () { window.location.href = '/admin-login'; })
              .catch(function () { window.location.href = '/admin-login'; });
          });
        `}
      </Script>
      <Script src="/admin/decap-cms.js" strategy="afterInteractive" />
      <Script src="/admin/media-original-helper.js" strategy="afterInteractive" />
    </main>
  )
}
