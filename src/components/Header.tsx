'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="container-max py-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3 transition-smooth hover:opacity-75">
            <span className="flex h-9 w-9 items-center justify-center bg-meraba text-sm font-bold text-white">M</span>
            <span className="text-xl font-semibold text-gray-950">MERABA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-9">
            <Link href="/about" className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600 transition-smooth hover:text-meraba">
              ABOUT
            </Link>
            <Link href="/products" className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600 transition-smooth hover:text-meraba">
              PRODUCTS
            </Link>
            <Link href="/contact" className="bg-gray-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-smooth hover:bg-meraba">
              CONTACT
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-11 w-11 flex-col justify-center gap-1.5 border border-gray-200 p-3 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`h-px w-full bg-black transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`h-px w-full bg-black transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-px w-full bg-black transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mt-5 space-y-1 border-t border-gray-100 pt-5 md:hidden">
            <Link
              href="/about"
              className="block px-2 py-4 text-sm font-bold uppercase tracking-[0.18em] text-gray-700 transition-smooth hover:text-meraba"
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link
              href="/products"
              className="block px-2 py-4 text-sm font-bold uppercase tracking-[0.18em] text-gray-700 transition-smooth hover:text-meraba"
              onClick={() => setIsMenuOpen(false)}
            >
              PRODUCTS
            </Link>
            <Link
              href="/contact"
              className="block px-2 py-4 text-sm font-bold uppercase tracking-[0.18em] text-gray-700 transition-smooth hover:text-meraba"
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACT
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
