import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { content } from '@/lib/content'

export default function AccessibilityStatement() {
  const accessibility = content.accessibilityPage
  const sections = [
    {
      id: 'accessibility-commitment',
      title: 'Commitment',
      text: accessibility.commitmentText,
    },
    {
      id: 'accessibility-target',
      title: 'Compliance target',
      text: accessibility.complianceTargetText,
    },
    {
      id: 'accessibility-measures',
      title: 'Accessibility measures',
      text: accessibility.accessibilityMeasuresText,
    },
    {
      id: 'accessibility-feedback',
      title: 'Feedback and assistance',
      text: accessibility.feedbackAssistanceText,
    },
  ]

  return (
    <>
      <Header />

      <main id="main-content" className="w-full bg-[linear-gradient(180deg,#f8f6f1_0%,#eef3f7_100%)] py-12 md:py-16 lg:py-20">
        <div className="container-max">
          <article className="mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-[#d5dce5] bg-white shadow-[0_28px_90px_rgba(7,17,31,0.1)]">
            <div className="grid gap-0 lg:grid-cols-[0.72fr_1.28fr]">
              <aside className="relative bg-[#07111f] p-7 text-white md:p-10 lg:p-12">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(8,63,104,0.34),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_42%)]"></div>
                <div className="relative">
                  <p className="section-label text-white/58">Accessibility</p>
                  <h1 className="mt-6 max-w-sm text-[clamp(2.35rem,4vw,4.85rem)] font-semibold leading-[0.96] tracking-[-0.052em] text-white">
                    {accessibility.title}
                  </h1>
                </div>
              </aside>

              <div className="p-7 md:p-10 lg:p-12">
                <div className="space-y-8 text-[1rem] leading-8 text-gray-600">
                  {sections.map((section) => (
                    <section key={section.id} aria-labelledby={section.id} className="border-b border-[#e5ebf0] pb-7 last:border-b-0">
                      <h2 id={section.id} className="text-xl font-semibold tracking-[-0.02em] text-gray-950">
                        {section.title}
                      </h2>
                      {section.text.split('\n\n').map((paragraph) => (
                        <p key={paragraph} className="mt-3">
                          {paragraph}
                        </p>
                      ))}
                    </section>
                  ))}

                  <section className="rounded-[22px] border border-[#cfd9e4] bg-[#f8fafc] p-5 md:p-6" aria-labelledby="accessibility-contact">
                    <h2 id="accessibility-contact" className="text-lg font-semibold tracking-[-0.02em] text-gray-950">
                      Accessibility assistance
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      For accessibility feedback or assistance, contact MERABA at{' '}
                      <a className="font-semibold text-meraba underline-offset-4 hover:underline" href={`mailto:${accessibility.contactEmail}`}>
                        {accessibility.contactEmail}
                      </a>
                      .
                    </p>
                  </section>

                  <p className="pt-1 text-sm text-gray-500">
                    Last updated: {accessibility.lastUpdated}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  )
}
