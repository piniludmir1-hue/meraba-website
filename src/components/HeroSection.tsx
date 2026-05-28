import Link from 'next/link'

interface HeroProps {
  title: string
  subtitle?: string
  description?: string
  cta?: {
    text: string
    href: string
  }
  backgroundImage?: string
}

export default function HeroSection({
  title,
  subtitle,
  description,
  cta,
  backgroundImage,
}: HeroProps) {
  const visualImage =
    backgroundImage ||
    'https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&w=1800&q=80'

  return (
    <section
      className="relative flex min-h-[92vh] w-full items-center overflow-hidden bg-gray-950 text-white md:min-h-[88vh]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${visualImage})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.94)_0%,rgba(3,7,18,0.80)_43%,rgba(3,7,18,0.46)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:72px_72px] opacity-60" />

      <div className="container-max relative z-10 py-28 md:py-36">
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

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            {cta && (
              <Link href={cta.href} className="btn-primary">
                {cta.text}
              </Link>
            )}
            <Link href="/contact" className="btn-secondary-dark">
              Talk to Procurement
            </Link>
          </div>

          <div className="mt-16 grid max-w-3xl grid-cols-1 gap-px bg-white/15 sm:grid-cols-3">
            {['20+ Years', 'Global Network', 'Airline Grade'].map((item) => (
              <div key={item} className="bg-gray-950/70 px-5 py-4 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">{item}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Supply confidence</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
