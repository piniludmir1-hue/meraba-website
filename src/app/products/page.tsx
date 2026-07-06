'use client'

import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { content, getProductsPageCategories } from '@/lib/content'
import { getCategoryCardImageSources } from '@/lib/categoryImage'
import { buildEmailHref, buildWhatsAppHref } from '@/lib/contactLinks'

function ProductVisual({ src, alt, dark = false }: { src?: string; alt?: string; dark?: boolean }) {
  const imageSources = src ? getCategoryCardImageSources(src) : undefined

  return (
    <div className={`product-category-media relative overflow-hidden rounded-[22px] ${dark ? 'bg-[#0b1728]' : 'bg-[#f3f6f9]'}`}>
      {src ? (
        <img
          src={imageSources?.src}
          srcSet={imageSources?.srcSet}
          alt={alt || ''}
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
          decoding="async"
          className="category-rendered-image block h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0">
          <div className={`absolute inset-0 rounded-[inherit] ${dark ? 'bg-[radial-gradient(circle_at_78%_18%,rgba(8,63,104,0.78),transparent_34%),linear-gradient(135deg,#07111f,#13263d)]' : 'bg-[radial-gradient(circle_at_82%_12%,rgba(8,63,104,0.13),transparent_34%),radial-gradient(circle_at_10%_92%,rgba(180,190,202,0.24),transparent_28%),linear-gradient(135deg,#ffffff,#edf2f7)]'}`} />
          <Image
            src="/brand/meraba-icon.png"
            alt=""
            width={1254}
            height={1254}
            aria-hidden="true"
            className={`absolute right-7 top-7 h-16 w-16 object-contain ${dark ? 'opacity-[0.07] invert' : 'opacity-[0.035]'}`}
          />
          <div className={`absolute bottom-6 left-6 flex items-center gap-3 ${dark ? 'text-white/45' : 'text-[#6f7f8f]'}`}>
            <span className={`h-px w-11 ${dark ? 'bg-white/42' : 'bg-meraba/70'}`} />
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.16em]">{content.productsPage.productGrid.imagePlaceholderLabel}</span>
          </div>
        </div>
      )}
      {!src && (
        <div className={`pointer-events-none absolute inset-0 rounded-[22px] ${dark ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.2))]' : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(7,17,31,0.05))]'}`} />
      )}
    </div>
  )
}

export default function Products() {
  const productTypes = getProductsPageCategories()
  const { productsPage, global } = content
  const consultantEmailHref = buildEmailHref(global.productConsultantEmail, global.defaultContactMessages)
  const consultantWhatsappHref = buildWhatsAppHref(global.whatsappNumber, global.defaultContactMessages)

  return (
    <>
      <Header />

      <main id="main-content">
      <section className="relative overflow-hidden border-b border-[#d5dce5] bg-[#07111f] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:84px_84px] opacity-38" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_76%_34%,rgba(143,169,190,0.13),transparent_43%),radial-gradient(circle_at_8%_92%,rgba(255,255,255,0.03),transparent_28%),linear-gradient(135deg,#111821_0%,#0b141f_55%,#050b12_100%)]" />

        <div className="container-max relative z-10 py-16 md:py-[4.8rem] lg:py-[5.4rem]">
          <div className="grid items-center gap-14 lg:grid-cols-[0.94fr_0.68fr] lg:gap-20">
            <div className="max-w-4xl">
              <p className="section-label text-white/54">{productsPage.hero.label}</p>
              <h1 className="mt-6 max-w-[48rem] text-[clamp(2.85rem,5.05vw,5.75rem)] font-semibold leading-[0.95] tracking-[-0.052em] text-white [font-family:'Segoe_UI_Variable_Display','Aptos_Display','Helvetica_Neue',Arial,sans-serif]">
                {productsPage.hero.headline}
              </h1>
              <p className="mt-9 max-w-[42rem] text-[clamp(1.05rem,1.25vw,1.28rem)] leading-8 text-white/66 md:leading-9">
                {productsPage.hero.description}
              </p>
            </div>

            <div className="relative min-h-[16.5rem] md:min-h-[20rem] lg:min-h-[24rem]" aria-hidden="true">
              <div className="products-hero-icon-glow absolute left-1/2 top-1/2 h-[min(58vw,24rem)] w-[min(72vw,28rem)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(178,195,210,0.075)_0%,rgba(110,139,162,0.052)_34%,rgba(78,103,124,0.02)_60%,transparent_80%)] blur-2xl" />
              <div className="products-hero-icon products-hero-icon-mask absolute left-1/2 top-1/2 w-[min(49vw,21.75rem)] -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </section>

      <section className="products-grid-section w-full border-b border-[#d5dce5] bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fb_48%,#eef3f7_100%)]">
        <div className="container-max">
          <div className="product-type-grid grid-fluid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            {productTypes.map((productType) => {
              const isCustom = productType.id === 'custom-requested-products'
              const description = isCustom
                ? productsPage.productGrid.customDescription
                : productType.shortDescription

              return (
              <article
                key={productType.id}
                className={`product-type-card group relative flex flex-col rounded-[26px] border transition-all duration-300 ease-out ${isCustom ? 'border-[#14263c] bg-[#07111f] text-white shadow-[0_24px_80px_rgba(7,17,31,0.18)] hover:-translate-y-1 hover:shadow-[0_34px_110px_rgba(7,17,31,0.24)]' : 'border-white/80 bg-white/92 text-gray-950 shadow-[0_18px_60px_rgba(7,17,31,0.07)] hover:-translate-y-1 hover:border-[#c4ced9] hover:shadow-[0_34px_100px_rgba(7,17,31,0.14)]'}`}
              >
                {isCustom && (
                  <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_86%_12%,rgba(8,63,104,0.48),transparent_34%)]" />
                )}
                <div className="relative p-3.5 pb-0">
                  <div className={`overflow-hidden rounded-[23px] border p-1 ${isCustom ? 'border-white/12 bg-white/[0.045]' : 'border-[#edf1f5] bg-[#f8fafc]'}`}>
                    <ProductVisual src={productType.image} alt={productType.imageAlt} dark={isCustom} />
                  </div>
                </div>
                <div className="relative flex flex-1 flex-col px-6 pb-5 pt-5 md:px-7 md:pb-6 md:pt-6">
                  {isCustom && (
                    <p className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white/56">
                      {productsPage.productGrid.customEyebrow}
                    </p>
                  )}
                  <h3 className={`text-[1.46rem] font-semibold leading-[1.08] tracking-[-0.025em] transition-smooth ${isCustom ? 'max-w-[17rem] text-white' : 'max-w-[15rem] text-gray-950 group-hover:text-meraba'}`}>
                    {productType.name}
                  </h3>
                  <p className={`mt-3 line-clamp-3 text-[0.93rem] leading-6 ${isCustom ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
                </div>
              </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-10 md:py-12 lg:py-14">
        <div className="container-max">
          <div className="relative overflow-hidden rounded-[24px] border border-[#d8e0e8] bg-[#f6f8fa] p-2.5 shadow-[0_22px_70px_rgba(7,17,31,0.075)]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,63,104,0.035)_1px,transparent_1px),linear-gradient(0deg,rgba(8,63,104,0.028)_1px,transparent_1px)] bg-[size:42px_42px]" />
            <div className="relative grid grid-cols-1 items-center overflow-hidden rounded-[20px] border border-white bg-white lg:grid-cols-[1.12fr_0.68fr]">
              <div className="relative overflow-hidden p-6 md:p-8 lg:p-9">
                <Image
                  src="/brand/meraba-icon.png"
                  alt=""
                  width={1254}
                  height={1254}
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 object-contain opacity-[0.022]"
                />
                <div className="relative z-10">
                  <Image
                    src="/brand/meraba-logo.png"
                    alt="MERABA"
                    width={520}
                    height={140}
                    className="mb-6 h-auto w-28 object-contain"
                  />
                  <p className="module-kicker text-meraba">{productsPage.consultantCta.label}</p>
                  <h2 className="mt-3 max-w-xl text-[clamp(1.8rem,3vw,3.25rem)] font-semibold leading-[1] tracking-[-0.04em] text-gray-950">
                    {productsPage.consultantCta.title}
                  </h2>
                  <p className="mt-4 max-w-lg text-[0.98rem] leading-7 text-gray-600">
                    {productsPage.consultantCta.text}
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={consultantWhatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center justify-center rounded-full bg-meraba px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.06em] text-white shadow-[0_16px_38px_rgba(8,63,104,0.22)] transition-smooth hover:-translate-y-0.5 hover:bg-[#07111f]"
                    >
                      {productsPage.consultantCta.whatsappButtonText}
                    </a>
                    <a
                      href={consultantEmailHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#c9d3de] bg-white px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.06em] text-[#07111f] transition-smooth hover:-translate-y-0.5 hover:border-meraba hover:text-meraba"
                    >
                      {productsPage.consultantCta.emailButtonText}
                    </a>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden bg-[#07111f] p-6 text-white md:p-7 lg:p-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_10%,rgba(8,63,104,0.72),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.055),transparent_40%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:46px_46px] opacity-35" />
                <div className="relative z-10 flex h-full min-h-[250px] flex-col justify-between">
                  <div>
                    <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-white text-base font-semibold tracking-[-0.02em] text-meraba shadow-[0_14px_36px_rgba(0,0,0,0.18)]">
                      {global.productConsultantInitials}
                    </div>
                    <p className="text-[clamp(1.7rem,2.7vw,3rem)] font-semibold leading-[0.92] tracking-[-0.052em] text-white">
                      {global.productConsultantName}
                    </p>
                    <p className="mt-3 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/48">
                      {global.productConsultantTitle}
                    </p>
                  </div>

                  <div className="mt-8 space-y-3 border-t border-white/14 pt-5">
                    <a
                      href={consultantWhatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-5 text-[0.82rem] text-gray-300 transition-smooth hover:text-white"
                    >
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/40">{productsPage.consultantCta.whatsappDetailLabel}</span>
                      <span className="text-right font-medium">{global.productConsultantPhone}</span>
                    </a>
                    <a
                      href={consultantEmailHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-5 text-[0.82rem] text-gray-300 transition-smooth hover:text-white"
                    >
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/40">{productsPage.consultantCta.emailDetailLabel}</span>
                      <span className="text-right font-medium">{global.productConsultantEmail}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-10 md:py-12 lg:py-14">
        <div className="container-max">
          <div className="relative overflow-hidden rounded-[24px] border border-[#d8e0e8] bg-[#f7f9fb] p-6 shadow-[0_22px_70px_rgba(7,17,31,0.07)] md:p-7 lg:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_8%,rgba(8,63,104,0.09),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.72),rgba(236,241,247,0.54))]" />
            <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto] lg:gap-10">
              <div>
                <p className="section-label">{productsPage.quoteCta.label}</p>
                <h2 className="mt-3 text-[clamp(2rem,3.2vw,3.4rem)] font-semibold leading-[1] tracking-[-0.045em] text-gray-950">
                  {productsPage.quoteCta.title}
                </h2>
                <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-gray-600">
                  {productsPage.quoteCta.text}
                </p>
              </div>
              <div className="flex lg:justify-end lg:pr-8 xl:pr-12">
                <Link href={productsPage.quoteCta.buttonLink} className="btn-primary">
                  {productsPage.quoteCta.buttonText}
                </Link>
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
