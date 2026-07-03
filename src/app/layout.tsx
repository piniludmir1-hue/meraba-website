import type { Metadata } from 'next'
import './globals.css'

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
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
