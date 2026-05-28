'use client'

import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

export default function About() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <HeroSection
        subtitle="About Us"
        title="Three Decades of Excellence in Global Supply"
        description="MERABA has been a trusted partner in the international food service and aviation industries since 1994"
      />

      {/* Company Overview */}
      <section className="w-full bg-white py-20 md:py-32">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <h2 className="text-heading mb-8">Our Story</h2>
              <div className="space-y-6 text-gray-600 font-light leading-relaxed">
                <p>
                  Founded in 1994, MERABA emerged from a simple vision: to connect premium manufacturers with discerning businesses in the aviation and food service sectors. What began as a small trading company has grown into a comprehensive B2B solution provider.
                </p>
                <p>
                  Today, we serve hundreds of international clients including major airlines, catering companies, hospitality groups, and specialty food retailers. Our success is built on three core principles: uncompromising quality, transparent relationships, and continuous innovation.
                </p>
                <p>
                  We've invested heavily in supply chain infrastructure, quality control systems, and customer support. Every product that bears the MERABA mark has undergone rigorous testing to ensure it meets or exceeds international standards.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-8">
              <div className="border-t border-gray-200 pt-8">
                <p className="text-5xl font-light mb-2">30+</p>
                <p className="text-gray-600 font-light">Years of Industry Experience</p>
              </div>
              <div className="border-t border-gray-200 pt-8">
                <p className="text-5xl font-light mb-2">500+</p>
                <p className="text-gray-600 font-light">International Clients</p>
              </div>
              <div className="border-t border-gray-200 pt-8">
                <p className="text-5xl font-light mb-2">50+</p>
                <p className="text-gray-600 font-light">Countries Served</p>
              </div>
              <div className="border-t border-gray-200 pt-8">
                <p className="text-5xl font-light mb-2">24/7</p>
                <p className="text-gray-600 font-light">Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full bg-gray-50 py-20 md:py-32">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            {/* Mission */}
            <div>
              <h3 className="text-2xl font-light tracking-tight mb-6">Our Mission</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                To be the preferred international sourcing partner for premium food service and aviation products, delivering exceptional value through quality, reliability, and customer-centric solutions.
              </p>
            </div>

            {/* Vision */}
            <div>
              <h3 className="text-2xl font-light tracking-tight mb-6">Our Vision</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                To create a global supply ecosystem where innovation, sustainability, and excellence converge to elevate the standards of the food service and aviation industries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Values */}
      <section className="w-full bg-white py-20 md:py-32">
        <div className="container-max">
          <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
            <h2 className="text-display mb-6">Our Values</h2>
            <p className="text-lg text-gray-600 font-light">
              These principles guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-2xl">
                ⚡
              </div>
              <h3 className="text-lg font-light tracking-tight">Excellence</h3>
              <p className="text-sm text-gray-600 font-light">
                Uncompromising commitment to quality in every product and service
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-2xl">
                🤝
              </div>
              <h3 className="text-lg font-light tracking-tight">Integrity</h3>
              <p className="text-sm text-gray-600 font-light">
                Transparent, honest relationships built on trust and accountability
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-2xl">
                🚀
              </div>
              <h3 className="text-lg font-light tracking-tight">Innovation</h3>
              <p className="text-sm text-gray-600 font-light">
                Continuous improvement and exploration of new solutions
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-2xl">
                🌍
              </div>
              <h3 className="text-lg font-light tracking-tight">Sustainability</h3>
              <p className="text-sm text-gray-600 font-light">
                Responsible business practices for a better future
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
