'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: '',
    })
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <HeroSection
        subtitle="Get in Touch"
        title="Let's Work Together"
        description="Have questions about our products or services? Our team is here to help"
      />

      {/* Contact Content */}
      <section className="w-full bg-white py-20 md:py-32">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20 mb-20 md:mb-32">
            {/* Contact Info */}
            <div className="md:col-span-1 space-y-12">
              <div>
                <h3 className="text-sm tracking-widest uppercase font-light text-gray-600 mb-4">
                  Headquarters
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  123 International Boulevard<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>

              <div>
                <h3 className="text-sm tracking-widest uppercase font-light text-gray-600 mb-4">
                  Contact Details
                </h3>
                <div className="space-y-3 text-gray-600 font-light">
                  <p>
                    <span className="block text-xs tracking-widest text-gray-500 mb-1">Phone</span>
                    +1 (555) 000-0000
                  </p>
                  <p>
                    <span className="block text-xs tracking-widest text-gray-500 mb-1">Email</span>
                    info@meraba.com
                  </p>
                  <p>
                    <span className="block text-xs tracking-widest text-gray-500 mb-1">Support</span>
                    support@meraba.com
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm tracking-widest uppercase font-light text-gray-600 mb-4">
                  Business Hours
                </h3>
                <div className="space-y-2 text-sm text-gray-600 font-light">
                  <p>Monday - Friday<br />9:00 AM - 6:00 PM EST</p>
                  <p>Saturday<br />10:00 AM - 4:00 PM EST</p>
                  <p>Sunday<br />Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              {submitted ? (
                <div className="bg-gray-50 border border-green-200 p-8 md:p-12 text-center">
                  <p className="text-lg font-light text-gray-800 mb-2">
                    Thank you for your message
                  </p>
                  <p className="text-gray-600 font-light">
                    We'll get back to you as soon as possible
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="name" className="block text-sm font-light tracking-widest text-gray-600 mb-3 uppercase">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-200 px-0 py-3 text-gray-900 focus:outline-none focus:border-gray-900 transition-smooth bg-transparent font-light"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-light tracking-widest text-gray-600 mb-3 uppercase">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-200 px-0 py-3 text-gray-900 focus:outline-none focus:border-gray-900 transition-smooth bg-transparent font-light"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="company" className="block text-sm font-light tracking-widest text-gray-600 mb-3 uppercase">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full border border-gray-200 px-0 py-3 text-gray-900 focus:outline-none focus:border-gray-900 transition-smooth bg-transparent font-light"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-light tracking-widest text-gray-600 mb-3 uppercase">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-200 px-0 py-3 text-gray-900 focus:outline-none focus:border-gray-900 transition-smooth bg-transparent font-light"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-light tracking-widest text-gray-600 mb-3 uppercase">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 px-0 py-3 text-gray-900 focus:outline-none focus:border-gray-900 transition-smooth bg-transparent font-light appearance-none"
                    >
                      <option value="">Select a subject</option>
                      <option value="product-inquiry">Product Inquiry</option>
                      <option value="custom-order">Custom Order</option>
                      <option value="quotation">Quotation Request</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="support">Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-light tracking-widest text-gray-600 mb-3 uppercase">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full border border-gray-200 px-0 py-3 text-gray-900 focus:outline-none focus:border-gray-900 transition-smooth bg-transparent font-light resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 md:px-12 py-4 bg-black text-white text-sm tracking-widest hover:bg-gray-900 transition-smooth uppercase font-light"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="w-full bg-gray-50 py-20 md:py-32">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white mx-auto mb-6 text-xl font-light">
                ✓
              </div>
              <h3 className="text-lg font-light tracking-tight mb-4">Fast Response</h3>
              <p className="text-sm text-gray-600 font-light">
                We respond to inquiries within 24 hours during business days
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white mx-auto mb-6 text-xl font-light">
                ✓
              </div>
              <h3 className="text-lg font-light tracking-tight mb-4">Expert Support</h3>
              <p className="text-sm text-gray-600 font-light">
                Dedicated specialists ready to answer technical and commercial questions
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white mx-auto mb-6 text-xl font-light">
                ✓
              </div>
              <h3 className="text-lg font-light tracking-tight mb-4">Custom Solutions</h3>
              <p className="text-sm text-gray-600 font-light">
                We tailor our offerings to meet your specific requirements and budget
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
