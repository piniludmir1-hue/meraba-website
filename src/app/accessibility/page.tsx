import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AccessibilityStatement() {
  return (
    <>
      <Header />

      <main id="main-content" className="w-full bg-[#f7f5f1] py-12 md:py-16 lg:py-20">
        <div className="container-max">
          <article className="mx-auto max-w-4xl border border-[#d5dce5] bg-white p-7 shadow-[0_24px_80px_rgba(7,17,31,0.08)] md:p-10 lg:p-12">
            <p className="section-label">Accessibility</p>
            <h1 className="max-w-3xl text-[clamp(2.35rem,4vw,4.5rem)] font-semibold leading-[1] tracking-[-0.045em] text-gray-950">
              Accessibility Statement
            </h1>

            <div className="mt-8 space-y-7 text-[1rem] leading-8 text-gray-600">
              <p>
                MERABA is committed to providing a website experience that is accessible, usable, and respectful for all visitors.
              </p>

              <section aria-labelledby="accessibility-target">
                <h2 id="accessibility-target" className="text-xl font-semibold tracking-[-0.02em] text-gray-950">
                  Compliance target
                </h2>
                <p className="mt-3">
                  Our accessibility target is the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
                </p>
              </section>

              <section aria-labelledby="accessibility-measures">
                <h2 id="accessibility-measures" className="text-xl font-semibold tracking-[-0.02em] text-gray-950">
                  Accessibility measures
                </h2>
                <p className="mt-3">
                  The website includes keyboard-accessible navigation, visible focus states, semantic page landmarks, descriptive form labels, error messages, a skip-to-content link, reduced-motion support, and a lightweight accessibility control for common display adjustments.
                </p>
              </section>

              <section aria-labelledby="accessibility-feedback">
                <h2 id="accessibility-feedback" className="text-xl font-semibold tracking-[-0.02em] text-gray-950">
                  Feedback and assistance
                </h2>
                <p className="mt-3">
                  If you experience difficulty using the MERABA website or need information in another format, please contact us at{' '}
                  <a className="font-semibold text-meraba underline-offset-4 hover:underline" href="mailto:info@meraba.co">
                    info@meraba.co
                  </a>
                  .
                </p>
              </section>

              <p className="border-t border-[#d5dce5] pt-6 text-sm text-gray-500">
                Last updated: July 5, 2026
              </p>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  )
}
