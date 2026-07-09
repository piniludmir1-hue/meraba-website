'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { fallbackContent, type SiteContent } from '@/lib/fallbackContent'

export default function Header({ siteContent = fallbackContent }: { siteContent?: SiteContent }) {
  const navigation = siteContent.header
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 36)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const glassState = isScrolled && !isMenuOpen

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-smooth ${
        glassState
          ? 'border-b border-[#d5dce5] bg-white/92 shadow-[0_14px_45px_rgba(7,17,31,0.08)] backdrop-blur-md'
          : 'border-b border-[#d5dce5] bg-white'
      }`}
    >
      <nav className="container-max py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center transition-smooth hover:opacity-85" aria-label={navigation.logoAriaLabel}>
            <Image
              src="/brand/meraba-logo.png"
              alt="MERABA"
              width={2172}
              height={724}
              priority
              unoptimized
              className="header-brand-logo h-auto object-contain transition-smooth"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navigation.items.map((item, index) => {
              const isPrimary = index === navigation.items.length - 1

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isPrimary
                      ? 'border border-[#07111f] bg-[#07111f] px-5 py-3 text-xs font-bold uppercase text-white transition-smooth hover:border-meraba hover:bg-meraba'
                      : 'text-xs font-bold uppercase text-gray-600 transition-smooth hover:text-meraba'
                  }
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`flex h-11 w-11 flex-col justify-center gap-1.5 border p-3 transition-smooth md:hidden ${
              glassState ? 'border-gray-200 bg-white/80' : 'border-gray-200 bg-white'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={navigation.mobileMenuAriaLabel}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span className={`h-px w-full bg-black transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`h-px w-full bg-black transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-px w-full bg-black transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div id="mobile-navigation" className="mt-5 space-y-1 border-t border-[#d5dce5] pt-5 md:hidden">
            {navigation.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-2 py-4 text-sm font-bold uppercase text-gray-700 transition-smooth hover:text-meraba"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
