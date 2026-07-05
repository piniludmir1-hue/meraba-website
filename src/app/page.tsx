import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'
import EditableMedia from '@/components/EditableMedia'
import { content, getHomepageCategories } from '@/lib/content'

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="section-label">{children}</p>
}

export default function Home() {
  const homepageCategories = getHomepageCategories()
  const { homepage, global, images } = content

  return (
    <>
      <Header />

      <main id="main-content">
        <HeroSection
          variant="home"
          subtitle={homepage.hero.brandStatement.split('. ').join('.\n')}
          title={homepage.hero.headline}
          backgroundImage={images.homepageHero.src}
          backgroundImageAlt={images.homepageHero.alt}
          sideImage1={images.homepageHeroSide1.src}
          sideImage1Alt={images.homepageHeroSide1.alt}
          sideImage2={images.homepageHeroSide2.src}
          sideImage2Alt={images.homepageHeroSide2.alt}
          sideImage3={images.homepageHeroSide3.src}
          sideImage3Alt={images.homepageHeroSide3.alt}
          mediaMode={images.heroMediaMode === 'continuous' ? 'continuous' : 'separate'}
          continuousImage={images.homepageHeroContinuous.src}
          continuousImageAlt={images.homepageHeroContinuous.alt}
        />

      <section id="products" className="home-product-overview section-fluid w-full border-b border-[#d5dce5] bg-white">
        <div className="container-max">
          <div className="home-product-heading layout-split mb-16 grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <SectionLabel>{homepage.productSection.label}</SectionLabel>
              <h2 className="text-display text-gray-950">{homepage.productSection.title}</h2>
            </div>
            <div className="home-product-note self-end">
              <p className="home-product-note-label">{homepage.productSection.noteLabel}</p>
              <p className="home-product-note-text">
                {homepage.productSection.subtitle}
              </p>
            </div>
          </div>

          <div className="home-product-grid grid-fluid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {homepageCategories.map((category) => {
              const categoryHref = category.id === 'custom-requested-products' ? '/contact' : '/products'

              return (
              <Link key={category.id} href={categoryHref} className="home-category-card group flex h-full flex-col">
                <EditableMedia
                  src={category.image}
                  alt={category.imageAlt}
                  label={category.placeholderLabel}
                  className="home-category-media aspect-[4/3]"
                  sizes="(min-width: 1280px) 23vw, (min-width: 640px) 48vw, 100vw"
                />
                <div className="home-category-body flex min-h-[164px] flex-1 flex-col p-6 md:p-7">
                  <h3 className="home-category-title text-xl font-semibold text-gray-950 transition-smooth group-hover:text-meraba">{category.name}</h3>
                  <p className="home-category-description mt-4 text-sm leading-7 text-gray-600">{category.shortDescription}</p>
                </div>
              </Link>
              )
            })}
          </div>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Link href={homepage.productSection.primaryCtaLink} className="btn-primary">
              {homepage.productSection.primaryCtaText}
            </Link>
            <Link
              href={homepage.productSection.secondaryCtaLink}
              className="inline-flex min-h-14 items-center justify-center border border-[#c8d1dc] bg-white px-8 py-4 text-center text-xs font-bold uppercase tracking-[0.06em] text-gray-700 transition-smooth hover:border-meraba hover:text-meraba md:px-10"
            >
              {homepage.productSection.secondaryCtaText}
            </Link>
          </div>
        </div>
      </section>

      <section id="why-meraba" className="why-meraba-section section-fluid relative w-full overflow-hidden border-b border-[#d5dce5] bg-[#07111f] text-white">
        <div className="container-max relative z-10">
          <div className="why-meraba-layout layout-split grid grid-cols-1 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="why-meraba-copy">
              <SectionLabel>{homepage.whyMeraba.label}</SectionLabel>
              <h2 className="why-meraba-title text-display text-white">{homepage.whyMeraba.title}</h2>
              <p className="why-meraba-intro mt-7 max-w-xl text-lg leading-8 text-gray-300">
                {homepage.whyMeraba.intro}
              </p>
              <div className="why-meraba-media why-meraba-brand-panel mt-10 hidden h-80 lg:flex" aria-label="MERABA positioning statement">
                <p>
                  {homepage.whyMeraba.brandPanelStatement.split('\n').map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              </div>
            </div>

            <div className="why-meraba-card-grid grid-fluid grid grid-cols-1 sm:grid-cols-2">
              {homepage.whyMeraba.items.map(({ title, description }) => (
                <article key={title} className="why-meraba-card group">
                  <div className="why-meraba-card-rule" aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="supply-model" className="supply-model-section section-fluid relative w-full overflow-hidden border-b border-[#d5dce5] bg-[#f7f8f8]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(8,63,104,0.045),transparent_34%),radial-gradient(circle_at_78%_72%,rgba(7,17,31,0.035),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.82),rgba(244,247,250,0.66))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(8,63,104,0.16),transparent)]" />
        <div className="container-max">
          <div className="supply-process-shell layout-split relative grid grid-cols-1 rounded-[30px] border border-white/80 bg-white/68 shadow-[0_24px_86px_rgba(7,17,31,0.058)] backdrop-blur-sm lg:grid-cols-[0.66fr_1.34fr] lg:items-center">
            <div className="supply-reveal relative">
              <div className="pointer-events-none absolute -left-6 top-1 hidden h-20 w-px bg-[linear-gradient(180deg,var(--meraba-blue),transparent)] opacity-18 lg:block" />
              <p className="mb-4 inline-flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-meraba">
                {homepage.supplyModel.label}
              </p>
              <h2 className="supply-model-title max-w-xl font-semibold text-gray-950">{homepage.supplyModel.title}</h2>
            </div>

            <div className="supply-reveal supply-steps-wrap relative">
              <div className="supply-flow-connector" aria-hidden="true" />
              <div className="supply-step-grid grid-fluid relative grid grid-cols-1 md:grid-cols-3">
                {homepage.supplyModel.steps.map(({ title, description }, index) => (
                  <article
                    key={title}
                    className="supply-step-card group relative overflow-hidden rounded-[22px] border border-[#e4e9ee] bg-[#fbfcfd]/95 p-6 shadow-[0_16px_46px_rgba(7,17,31,0.05)] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#c7d2dd] hover:bg-white hover:shadow-[0_22px_62px_rgba(7,17,31,0.09)] md:p-6"
                    style={{ '--step-delay': `${index * 90}ms` } as CSSProperties}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_6%,rgba(8,63,104,0.04),transparent_32%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex items-center justify-between">
                      <div className="supply-step-badge flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#d2dce6] bg-[linear-gradient(180deg,#ffffff,#f2f5f8)] text-[0.78rem] font-bold text-meraba shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_20px_rgba(7,17,31,0.04)] transition-all duration-300 group-hover:border-[#b7c5d2] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_12px_26px_rgba(7,17,31,0.07)]">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <span className="h-px w-9 bg-[linear-gradient(90deg,var(--meraba-blue),transparent)] opacity-18 transition-all duration-300 group-hover:w-11 group-hover:opacity-36" />
                    </div>
                    <h3 className="relative mt-6 text-[1.22rem] font-semibold leading-tight tracking-[-0.02em] text-gray-950">{title}</h3>
                    <p className="relative mt-3 text-sm leading-6 text-gray-600">{description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-fluid w-full bg-white">
        <div className="container-max">
          <div className="relative overflow-hidden border border-[#d5dce5] bg-[#07111f] p-8 text-white shadow-[0_30px_90px_rgba(7,17,31,0.16)] md:p-12 lg:p-16">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-[linear-gradient(90deg,transparent,rgba(8,63,104,0.28))]" />
            <div className="layout-split relative z-10 grid grid-cols-1 items-center lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <SectionLabel>{homepage.finalCta.label}</SectionLabel>
                <h2 className="text-display text-white">{homepage.finalCta.title}</h2>
              </div>
              <div>
                <p className="max-w-3xl text-xl leading-9 text-gray-300">
                  {homepage.finalCta.text}
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link href={homepage.finalCta.buttonLink} className="btn-primary">
                    {homepage.finalCta.buttonText}
                  </Link>
                  <a
                    href={global.productConsultantWhatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary-dark"
                  >
                    {homepage.finalCta.secondaryButtonText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </>
  )
}
