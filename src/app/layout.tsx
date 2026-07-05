import type { Metadata } from 'next'
import './globals.css'
import AccessibilityWidget from '@/components/AccessibilityWidget'

export const metadata: Metadata = {
  title: 'MERABA - Food-Service Product Supplier',
  description: 'Food-service and operational products for airlines, catering operations, food manufacturers, and institutional food service.',
  icons: {
    icon: '/brand/meraba-icon.png',
    shortcut: '/brand/meraba-icon.png',
    apple: '/brand/meraba-icon.png',
  },
  openGraph: {
    title: 'MERABA - Food-Service Product Supplier',
    description: 'Food-service and operational products for airlines, catering operations, food manufacturers, and institutional food service.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
        <AccessibilityWidget />
      </body>
    </html>
  )
}
