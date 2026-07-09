import Link from 'next/link'
import Image from 'next/image'
import { buildEmailHref } from '@/lib/contactLinks'
import { fallbackContent, type SiteContent } from '@/lib/fallbackContent'

export default function Footer({ siteContent = fallbackContent }: { siteContent?: SiteContent }) {
  const footer = siteContent.footer
  const footerEmail = footer.email.trim()
  const linkedinUrl = footer.linkedinUrl?.trim()
  const emailHref = buildEmailHref(footerEmail, siteContent.global.defaultContactMessages)

  return (
    <footer className="w-full border-t border-[#d5dce5] bg-white text-gray-950">
      <div className="container-max py-8 md:py-10">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <Link href="/" aria-label="MERABA homepage" className="inline-flex w-fit">
            <Image
              src="/brand/meraba-logo.png"
              alt="MERABA"
              width={2172}
              height={724}
              unoptimized
              className="h-auto max-h-10 w-[176px] object-contain"
            />
          </Link>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-gray-600">
              {footer.navLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-smooth hover:text-meraba">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex w-fit items-center gap-4">
            <a
              href={emailHref}
              aria-label={`Email MERABA at ${footerEmail}`}
              className="text-sm font-medium text-gray-600 transition-smooth hover:text-meraba focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-meraba"
            >
              {footerEmail}
            </a>
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MERABA on LinkedIn"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d5dce5] text-gray-500 transition-smooth hover:border-meraba hover:text-meraba focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-meraba"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                >
                  <path d="M5.34 7.44H2.31V21h3.03V7.44ZM3.82 6.06c.97 0 1.76-.79 1.76-1.76s-.79-1.75-1.76-1.75-1.76.78-1.76 1.75.79 1.76 1.76 1.76ZM21.94 13.28c0-3.64-1.94-5.33-4.53-5.33-2.09 0-3.02 1.15-3.54 1.96V7.44h-3.03V21h3.03v-6.71c0-1.77.34-3.49 2.54-3.49 2.16 0 2.19 2.02 2.19 3.6V21h3.03l.01-7.72Z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-[#e1e7ef] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">{footer.copyrightText}</p>
          <Link
            href="/accessibility"
            className="w-fit text-xs font-medium text-gray-500 transition-smooth hover:text-meraba focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-meraba"
          >
            Accessibility Statement
          </Link>
        </div>
      </div>
    </footer>
  )
}
