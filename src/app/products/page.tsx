'use client'

import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

const products = [
  {
    id: 1,
    name: 'Airline Serving Ware',
    category: 'Aviation',
    description: 'Premium serving solutions designed for commercial aviation. Includes trays, cups, cutlery, and serving accessories that meet international standards for durability and elegance.',
    features: [
      'Durable and lightweight design',
      'Meets international aviation standards',
      'Thermal resistant materials',
      'Sustainable and recyclable options',
      'Customizable branding available',
    ],
  },
  {
    id: 2,
    name: 'Catering Products',
    category: 'Catering',
    description: 'Comprehensive catering equipment and solutions for professional food service. From preparation to presentation, we provide everything needed for high-quality catering operations.',
    features: [
      'Professional-grade equipment',
      'Ergonomic design for efficiency',
      'Food-safe certification',
      'Easy to clean and maintain',
      'Bulk ordering discounts available',
    ],
  },
  {
    id: 3,
    name: 'CPET Trays',
    category: 'Packaging',
    description: 'Crystallized polyethylene terephthalate (CPET) trays engineered for temperature-critical food service. Ideal for both hot and cold food presentations with superior clarity and durability.',
    features: [
      'Temperature resistant (up to 400°F)',
      'Crystal clear presentation',
      'Microwave and oven safe',
      'Moisture-resistant design',
      'Custom size and shape options',
    ],
  },
  {
    id: 4,
    name: 'Food Packaging Solutions',
    category: 'Packaging',
    description: 'Premium food packaging designed to preserve quality while enhancing presentation. From fresh produce to prepared meals, we have solutions for every food service need.',
    features: [
      'Sustainable materials',
      'Moisture and oxygen barriers',
      'Custom printing available',
      'Portion-controlled sizing',
      'Eco-friendly certifications',
    ],
  },
  {
    id: 5,
    name: 'Custom Manufacturing',
    category: 'Manufacturing',
    description: 'Bespoke solutions tailored to your specific requirements. Our manufacturing capabilities support both standard modifications and completely custom designs.',
    features: [
      'Custom design consultation',
      'Prototype development',
      'Small to large batch production',
      'Quality assurance testing',
      'Competitive MOQ structures',
    ],
  },
  {
    id: 6,
    name: 'Specialty Items',
    category: 'Accessories',
    description: 'Specialized serving ware and accessories for niche applications. Premium materials and designs for distinctive food service presentations.',
    features: [
      'Premium material selections',
      'Unique design options',
      'Limited edition capabilities',
      'Gift packaging solutions',
      'Concierge ordering service',
    ],
  },
]

export default function Products() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <HeroSection
        subtitle="Product Catalog"
        title="Premium Solutions for Every Need"
        description="From airline serving ware to custom food packaging, MERABA offers comprehensive product lines engineered for quality and performance"
      />

      {/* Product Categories */}
      <section className="w-full bg-white py-20 md:py-32">
        <div className="container-max">
          <div className="mb-16 md:mb-24">
            <h2 className="text-heading mb-8">Our Products</h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl">
              Carefully selected and quality-assured products for aviation, catering, food service, and beyond
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 p-8 md:p-12 hover:border-black transition-smooth">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-light tracking-tight mb-2">{product.name}</h3>
                    <span className="text-xs tracking-widest text-gray-500 uppercase">{product.category}</span>
                  </div>
                </div>

                <p className="text-gray-600 font-light mb-8 leading-relaxed">
                  {product.description}
                </p>

                <div className="space-y-2">
                  <p className="text-xs tracking-widest text-gray-500 uppercase font-light">Key Features</p>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600 font-light flex items-start">
                        <span className="mr-3">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="w-full bg-gray-50 py-20 md:py-32">
        <div className="container-max">
          <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
            <h2 className="text-display mb-6">Quality Standards</h2>
            <p className="text-lg text-gray-600 font-light">
              All MERABA products adhere to international quality and safety standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div className="bg-white p-8 md:p-12">
              <h3 className="text-xl font-light tracking-tight mb-6">Certifications</h3>
              <ul className="space-y-4 text-sm text-gray-600 font-light">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-4" />
                  ISO 9001:2015 Quality Management
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-4" />
                  FDA Food Contact Compliance
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-4" />
                  EU Food Safety Regulations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-4" />
                  IATA Standards Compliance
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-4" />
                  Environmental Sustainability Certifications
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 md:p-12">
              <h3 className="text-xl font-light tracking-tight mb-6">Testing & Assurance</h3>
              <ul className="space-y-4 text-sm text-gray-600 font-light">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-4" />
                  Rigorous Material Testing
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-4" />
                  Durability & Stress Testing
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-4" />
                  Temperature Resistance Validation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-4" />
                  Food Safety & Chemical Testing
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-4" />
                  Third-Party Verification
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Customization Section */}
      <section className="w-full bg-white py-20 md:py-32">
        <div className="container-max">
          <h2 className="text-heading mb-12">Custom Solutions Available</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div className="space-y-6">
              <h3 className="text-xl font-light tracking-tight">Design & Development</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Work with our design team to create custom shapes, colors, and features tailored to your brand and requirements.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-light tracking-tight">Branding & Packaging</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Custom printing, embossing, and packaging options to showcase your brand and enhance product presentation.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-light tracking-tight">Volume & Logistics</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Flexible production runs from prototypes to large-scale manufacturing with optimized logistics and delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
