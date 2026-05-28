import Link from 'next/link'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

const industries = [
  {
    label: '01',
    title: 'Catering Factories',
    description:
      'High-volume production equipment, serviceware, and packaging programs built for throughput, consistency, and operational reliability.',
    detail: 'Commercial kitchens / bulk production / line efficiency',
  },
  {
    label: '02',
    title: 'Food Manufacturers',
    description:
      'CPET trays, containment systems, and packaging components for production, storage, and distribution across demanding supply chains.',
    detail: 'Production lines / cold chain / food safety',
  },
  {
    label: '03',
    title: 'Hospitality Groups',
    description:
      'Premium serving and presentation solutions that support brand standards across multi-property hospitality and restaurant operations.',
    detail: 'Multi-site supply / brand consistency / presentation',
  },
  {
    label: '04',
    title: 'Institutional Catering',
    description:
      'Durable service systems for hospitals, schools, corporate facilities, and government food service programs with strict requirements.',
    detail: 'Compliance / scale / durability',
  },
  {
    label: '05',
    title: 'Aviation Catering',
    description:
      'Lightweight, certified, and service-ready catering solutions for airline operations and international flight service standards.',
    detail: 'Airline supply / certified materials / weight control',
  },
  {
    label: '06',
    title: 'Custom Solutions',
    description:
      'OEM manufacturing and bespoke food service products developed from specification through production and dependable delivery.',
    detail: 'Design support / manufacturing / sourcing',
  },
]

const products = [
  {
    title: 'Serving Ware',
    description:
      'Dinnerware, trays, platters, and serviceware selected for professional durability, hygiene, and premium presentation.',
    points: ['Commercial-grade materials', 'Custom branding available', 'International sourcing network'],
  },
  {
    title: 'Packaging & CPET',
    description:
      'Temperature-stable trays and protective packaging systems for manufacturing, logistics, and prepared meal distribution.',
    points: ['Cold-chain and heated-service performance', 'Food safety documentation', 'Sustainable options'],
  },
  {
    title: 'Catering Equipment',
    description:
      'Production and service equipment designed for high-volume catering operations, commercial kitchens, and preparation facilities.',
    points: ['Operational durability', 'Hygienic design standards', 'Technical supplier support'],
  },
  {
    title: 'Custom Manufacturing',
    description:
      'OEM production and tailored food service solutions built to exact specifications, from prototype to full-scale supply.',
    points: ['Design and engineering support', 'Pilot production runs', 'Scalable manufacturing'],
  },
]

const process = [
  ['Source', 'Identify and evaluate premium suppliers across global manufacturing networks.'],
  ['Certify', 'Confirm specifications, quality requirements, and international documentation.'],
  ['Manage', 'Coordinate purchasing, import, logistics, and ongoing supplier communication.'],
  ['Deliver', 'Provide dependable delivery with the visibility procurement teams require.'],
]

const advantages = [
  {
    title: 'Global Sourcing Network',
    description:
      'Access to qualified suppliers across Asia, Europe, and the Americas, with MERABA managing supplier relationships and purchasing complexity.',
  },
  {
    title: 'Quality & Compliance',
    description:
      'Products are aligned with international standards, required certifications, and customer specifications before they enter the supply chain.',
  },
  {
    title: 'Dedicated Partnership',
    description:
      'A hands-on supply partner for procurement teams that need responsive communication, technical support, and long-term reliability.',
  },
]

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string
  title: string
  description: string
  light?: boolean
}) {
  return (
    <div className="max-w-4xl">
      <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-meraba">{eyebrow}</p>
      <h2 className={`text-display ${light ? 'text-white' : 'text-gray-950'}`}>{title}</h2>
      <p className={`mt-7 max-w-3xl text-lg leading-8 ${light ? 'text-gray-300' : 'text-gray-600'}`}>
        {description}
      </p>
    </div>
  )
}

function IndustrialVisual({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`relative min-h-[360px] overflow-hidden rounded-sm border ${
        dark ? 'border-white/10 bg-gray-950' : 'border-gray-200 bg-gray-100'
      }`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80')",
        }}
      />
      <div className={`absolute inset-0 ${dark ? 'bg-gray-950/74' : 'bg-white/70'}`} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,76,129,0.14)_1px,transparent_1px),linear-gradient(0deg,rgba(17,24,39,0.10)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="relative z-10 flex min-h-[360px] flex-col justify-between p-8 md:p-10">
        <div className="flex items-start justify-between gap-8">
          <div>
            <p className={`text-xs font-bold uppercase tracking-[0.24em] ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              Operations Map
            </p>
            <p className={`mt-3 max-w-xs text-3xl font-semibold leading-tight ${dark ? 'text-white' : 'text-gray-950'}`}>
              Sourcing, import, logistics, and supply under one accountable partner.
            </p>
          </div>
          <div className="hidden h-20 w-20 border border-meraba/50 md:block" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {['Asia', 'Europe', 'Americas'].map((region) => (
            <div key={region} className={`${dark ? 'bg-white/[0.08] text-gray-200' : 'bg-white/80 text-gray-900'} p-4`}>
              <p className="text-xs uppercase tracking-[0.18em] text-meraba">{region}</p>
              <p className="mt-2 text-sm font-semibold">Qualified supply base</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <>
      <Header />

      <HeroSection
        subtitle={'The simplicity of a local supplier.\nThe power of global sourcing.'}
        title="Global Food Service Supply Solutions"
        description="One accountable partner for sourcing, procurement, import, logistics, and supply serving catering factories, food manufacturers, hospitality groups, institutional caterers, and airlines."
        cta={{ text: 'View Solutions', href: '/products' }}
      />

      <section className="w-full bg-gray-950 py-24 text-white md:py-32">
        <div className="container-max">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <IndustrialVisual dark />

            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-meraba">Our Approach</p>
              <h2 className="text-display text-white">One Supply Partner. Global Reach.</h2>
              <div className="my-8 h-1 w-16 bg-meraba" />
              <p className="text-xl leading-9 text-gray-200">
                MERABA is more than a sourcing agent. We buy, manage, and deliver premium food service products across manufacturing, logistics, and supply networks worldwide.
              </p>
              <p className="mt-6 leading-8 text-gray-400">
                For more than two decades, international catering operations, food manufacturers, and hospitality groups have relied on MERABA to reduce sourcing complexity and keep critical supply programs moving.
              </p>
              <Link href="/about" className="btn-secondary-dark mt-10">
                Learn Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-24 md:py-32">
        <div className="container-max">
          <div className="mb-16 md:mb-20">
            <SectionHeading
              eyebrow="Market Expertise"
              title="Industries We Serve"
              description="Premium food service sourcing for operations where consistency, certification, delivery timing, and supplier accountability matter."
            />
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden bg-gray-200 md:grid-cols-2">
            {industries.map((industry) => (
              <article key={industry.title} className="group bg-white p-8 transition-smooth hover:bg-gray-50 md:p-10">
                <div className="mb-10 flex items-start justify-between gap-6">
                  <span className="text-sm font-bold tracking-[0.2em] text-meraba">{industry.label}</span>
                  <span className="h-10 w-10 border border-gray-300 transition-smooth group-hover:border-meraba" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-950">{industry.title}</h3>
                <p className="mt-5 leading-7 text-gray-600">{industry.description}</p>
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">{industry.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-950 py-24 text-white md:py-32">
        <div className="container-max">
          <div className="mb-16 md:mb-20">
            <SectionHeading
              eyebrow="Product Categories"
              title="Premium Solutions"
              description="Sourced globally, certified internationally, and delivered reliably. Every product category is selected for quality, compliance, and performance in professional food service environments."
              light
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {products.map((product) => (
              <article
                key={product.title}
                className="border border-white/10 bg-white/[0.03] p-8 transition-smooth hover:border-meraba/70 hover:bg-white/[0.06] md:p-10"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center bg-meraba text-sm font-bold tracking-[0.18em] text-white">
                  {product.title.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="text-3xl font-semibold text-white">{product.title}</h3>
                <p className="mt-5 leading-8 text-gray-300">{product.description}</p>
                <div className="mt-8 grid gap-3">
                  {product.points.map((point) => (
                    <div key={point} className="border-l-2 border-meraba pl-4 text-sm text-gray-400">
                      {point}
                    </div>
                  ))}
                </div>
                <Link href="/products" className="mt-9 inline-block text-sm font-bold uppercase tracking-[0.18em] text-meraba transition-smooth hover:text-white">
                  Explore Range
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-24 md:py-32">
        <div className="container-max">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <SectionHeading
              eyebrow="How We Work"
              title="A controlled supply path from sourcing to delivery."
              description="MERABA keeps every stage visible and accountable so procurement teams can move faster without losing control."
            />

            <div className="grid grid-cols-1 gap-px bg-gray-200 sm:grid-cols-2">
              {process.map(([title, description], index) => (
                <article key={title} className="bg-gray-50 p-8 md:p-10">
                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-meraba">
                    Step {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-8 text-2xl font-semibold text-gray-950">{title}</h3>
                  <p className="mt-4 leading-7 text-gray-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-100 py-24 md:py-32">
        <div className="container-max">
          <div className="mb-16 md:mb-20">
            <SectionHeading
              eyebrow="The MERABA Advantage"
              title="Built for procurement teams that need reliability at scale."
              description="MERABA combines international supplier access with the practical discipline needed to support airline catering, food manufacturing, and institutional food service programs."
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {advantages.map((advantage) => (
              <article key={advantage.title} className="border-t-4 border-meraba bg-white p-8 shadow-[0_24px_70px_rgba(17,24,39,0.06)] md:p-10">
                <h3 className="text-2xl font-semibold text-gray-950">{advantage.title}</h3>
                <p className="mt-5 leading-7 text-gray-600">{advantage.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-950 py-24 text-white md:py-32">
        <div className="container-max">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-meraba">Start a Partnership</p>
              <h2 className="text-display text-white">Ready to optimize your food service supply?</h2>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-300">
                Discuss sourcing, product specifications, logistics requirements, and supply continuity with a partner built for industrial food service.
              </p>
              <Link href="/contact" className="btn-primary mt-10">
                Start a Partnership
              </Link>
            </div>

            <IndustrialVisual dark />
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
