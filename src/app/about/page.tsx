'use client'

import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { content } from '@/lib/content'

export default function About() {
  const { statement } = content.aboutPage

  return (
    <>
      <Header />

      <main className="relative overflow-hidden bg-[#f3f1ec] py-10 md:py-12 lg:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_82%_8%,rgba(8,63,104,0.08),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.56),rgba(226,231,236,0.32))]" />
        <div className="container-max relative">
          <article className="relative mx-auto max-w-5xl overflow-hidden rounded-[2px] border border-[#d7dce2] bg-[#fbfaf7] px-6 py-8 shadow-[0_28px_90px_rgba(7,17,31,0.11)] md:px-10 md:py-11 lg:px-14 lg:py-14">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-meraba" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(8,63,104,0.08),transparent_62%)]" />

            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
              <header className="lg:-mt-2">
                <Image
                  src="/brand/meraba-icon.png"
                  alt=""
                  width={1254}
                  height={1254}
                  aria-hidden="true"
                  className="mb-3 h-6 w-6 object-contain opacity-30"
                />
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-meraba">
                  {statement.label}
                </p>
                <h1 className="mt-4 max-w-xl text-[clamp(2.35rem,4.4vw,5.15rem)] font-medium leading-[0.98] tracking-[-0.055em] text-[#07111f] [font-family:'Segoe_UI_Variable_Display','Aptos_Display','Helvetica_Neue',Arial,sans-serif]">
                  {statement.headline}
                </h1>
              </header>

              <div className="flex flex-col justify-end lg:pt-12">
                <div className="max-w-2xl space-y-5 text-[clamp(1.02rem,1.18vw,1.15rem)] leading-8 text-[#4d5a66]">
                  {statement.supportingParagraph.split('\n\n').map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative mt-12 grid grid-cols-1 gap-7 border-t border-[#d7dce2] pt-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
              <p className="text-[1.05rem] leading-8 text-[#283440]">
                {statement.valuesStatement}
              </p>
              <p className="text-[clamp(1.35rem,2.15vw,2.25rem)] font-medium leading-[1.12] tracking-[-0.035em] text-[#07111f]">
                {statement.closingStatement}
              </p>
            </div>

            <div className="relative mt-9 flex flex-col gap-5 border-t border-[#d7dce2] pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[clamp(1.35rem,2vw,2rem)] font-medium leading-tight tracking-[-0.035em] text-[#07111f]">
                {statement.ctaHeadline}
              </p>
              <Link href={statement.ctaButtonLink} className="btn-primary shrink-0">
                {statement.ctaButtonText}
              </Link>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  )
}
