import Link from 'next/link'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import HeroMediaGrid from '@/components/HeroMediaGrid'

interface HeroProps {
  title: string
  subtitle?: string
  description?: string
  supportingLine?: string
  cta?: {
    text: string
    href: string
  }
  secondaryCta?: {
    text: string
    href: string
  }
  proofCues?: string[]
  backgroundImage?: string
  backgroundImageAlt?: string
  sideImage1?: string
  sideImage1Alt?: string
  sideImage2?: string
  sideImage2Alt?: string
  sideImage3?: string
  sideImage3Alt?: string
  mediaMode?: 'separate' | 'continuous'
  continuousImage?: string
  continuousImageAlt?: string
  variant?: 'standard' | 'home'
}

export default function HeroSection({
  title,
  subtitle,
  description,
  cta,
  backgroundImage,
  backgroundImageAlt,
  sideImage1,
  sideImage1Alt,
  sideImage2,
  sideImage2Alt,
  sideImage3,
  sideImage3Alt,
  mediaMode = 'separate',
  continuousImage,
  continuousImageAlt,
  variant = 'standard',
}: HeroProps) {
  const visualImage =
    backgroundImage ||
    'https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&w=1800&q=80'

  if (variant === 'home') {
    return (
      <section className="hero-home-section relative border-b border-[#d5dce5] bg-[#06101d] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:112px_112px] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_16%,rgba(8,63,104,0.58),transparent_32%),radial-gradient(circle_at_16%_76%,rgba(35,77,107,0.30),transparent_34%),linear-gradient(120deg,rgba(6,16,29,1)_0%,rgba(7,17,31,0.99)_54%,rgba(11,36,58,0.94)_100%)]" />
        <div className="absolute bottom-0 left-0 h-28 w-full bg-[linear-gradient(0deg,rgba(244,247,250,0.11),transparent)]" />

        <div className="hero-home-container container-max relative z-10 py-16 md:py-20 lg:py-24">
          <div className="hero-home-grid grid min-h-[calc(100svh-15rem)] grid-cols-1 items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
            <div className="hero-copy-composition relative min-w-0 max-w-[40rem]">
              {subtitle && (
                <div className="hero-brand-signature">
                  <div className="hero-brand-rail" aria-hidden="true" />
                  <div className="hero-brand-code">
                    {subtitle.split('\n').map((line, index) => (
                      <div
                        key={line}
                        className={`hero-brand-line hero-brand-line-${index + 1}`}
                        style={{ '--line-delay': `${index * 70}ms` } as CSSProperties}
                      >
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                  <Image
                    src="/brand/meraba-icon.png"
                    alt=""
                    width={1254}
                    height={1254}
                    aria-hidden="true"
                    className="hero-brand-ghost"
                  />
                </div>
              )}

              <div className="hero-copy-flow" aria-hidden="true" />

              <h1 className="hero-copy-headline relative">
                {title.split('\n').map((line, index, lines) => (
                  <span
                    key={`${line}-${index}`}
                    className={`hero-headline-line hero-headline-line-${index + 1}`}
                  >
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            <div className="hero-media-composition relative">
              <div className="hero-media-frame absolute border border-white/[0.08] bg-white/[0.025] shadow-[0_50px_140px_rgba(0,0,0,0.34)]" />
              <HeroMediaGrid
                mode={mediaMode}
                mainImage={backgroundImage}
                mainImageAlt={backgroundImageAlt}
                sideImage1={sideImage1}
                sideImage1Alt={sideImage1Alt}
                sideImage2={sideImage2}
                sideImage2Alt={sideImage2Alt}
                sideImage3={sideImage3}
                sideImage3Alt={sideImage3Alt}
                continuousImage={continuousImage}
                continuousImageAlt={continuousImageAlt}
              />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="standard-hero relative flex w-full items-center overflow-hidden bg-gray-950 text-white"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${visualImage})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.94)_0%,rgba(3,7,18,0.80)_43%,rgba(3,7,18,0.46)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:72px_72px] opacity-60" />

      <div className="standard-hero-content container-max relative z-10">
        <div className="max-w-5xl">
          {subtitle && (
            <div className="mb-8 border-l-4 border-meraba pl-5">
              {subtitle.split('\n').map((line, i) => (
                <div key={i} className="text-xs font-bold uppercase tracking-[0.22em] text-gray-300 md:text-sm">
                  {line}
                </div>
              ))}
            </div>
          )}

          <h1 className="text-hero max-w-5xl text-white">
            {title}
          </h1>

          {description && (
            <p className="mt-8 max-w-3xl text-lg leading-8 text-gray-200 md:text-xl md:leading-9">
              {description}
            </p>
          )}

          {cta && (
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href={cta.href} className="btn-primary">
                {cta.text}
              </Link>
              <Link href="/contact" className="btn-secondary-dark">
                Contact MERABA
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
