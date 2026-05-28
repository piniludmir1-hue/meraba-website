import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MERABA - International Sourcing & Supply',
  description: 'Premium B2B solutions for airline serving ware, catering products, CPET trays, and food packaging',
  openGraph: {
    title: 'MERABA - International Sourcing & Supply',
    description: 'Premium B2B solutions for airline serving ware, catering products, CPET trays, and food packaging',
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
