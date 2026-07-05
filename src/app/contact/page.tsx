'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { content } from '@/lib/content'

export default function Contact() {
  const { contactPage } = content
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: '',
    quantity: '',
    destination: '',
    timeline: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof typeof formData, string>>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nextErrors: Partial<Record<keyof typeof formData, string>> = {}
    setSubmitError('')

    contactPage.formFields.forEach((field) => {
      const fieldName = field.name as keyof typeof formData

      if (field.required && !formData[fieldName].trim()) {
        nextErrors[fieldName] = `${field.label} is required.`
      }
    })

    if (formData.email.trim() && !isValidEmail(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Contact request failed.')
      }

      setSubmitted(true)
      setFieldErrors({})
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        product: '',
        quantity: '',
        destination: '',
        timeline: '',
        message: '',
      })
      setTimeout(() => setSubmitted(false), 5000)
    } catch {
      setSubmitError('Something went wrong. Please try again or contact us directly at info@meraba.co.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />

      <main id="main-content" className="w-full bg-[#f7f5f1] py-10 md:py-12 lg:py-14">
        <div className="container-max">
          <div className="mx-auto max-w-4xl">
              {submitted ? (
                <div className="border border-[#d5dce5] bg-[#f5f7fa] p-8 shadow-[0_24px_70px_rgba(25,44,69,0.07)]">
                  <p className="text-lg font-semibold text-gray-950">{contactPage.successMessage.title}</p>
                  {contactPage.successMessage.text && (
                    <p className="mt-3 text-gray-600">{contactPage.successMessage.text}</p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="industrial-panel bg-[#f5f7fa] p-7 md:p-9">
                  <div className="mb-8 border-l-4 border-meraba pl-5">
                    <p className="text-lg font-semibold text-gray-950">{contactPage.formIntro.reviewTitle}</p>
                    <p className="mt-2 text-sm leading-7 text-gray-600">
                      {contactPage.formIntro.reviewText}
                    </p>
                    <p className="mt-3 text-xs font-medium text-gray-500">
                      Fields marked with * are required.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {contactPage.formFields.map((field) => {
                      const fieldName = field.name as keyof typeof formData
                      const fieldError = fieldErrors[fieldName]

                      return (
                      <div key={field.name}>
                        <label htmlFor={field.name} className="mb-3 block text-xs font-bold uppercase text-gray-600">
                          {field.label}{field.required ? ' *' : ''}
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          value={formData[fieldName]}
                          onChange={handleChange}
                          required={false}
                          aria-invalid={fieldError ? 'true' : 'false'}
                          aria-describedby={fieldError ? `${field.name}-error` : undefined}
                          placeholder={field.placeholder}
                          className={`w-full border bg-white px-4 py-4 text-gray-950 outline-none transition-smooth focus:border-meraba ${fieldError ? 'border-[#b14d4d]' : 'border-[#c8d1dc]'}`}
                        />
                        {fieldError && (
                          <p id={`${field.name}-error`} className="mt-2 text-[0.78rem] font-medium text-[#8f3f3f]">
                            {fieldError}
                          </p>
                        )}
                      </div>
                      )
                    })}
                  </div>

                  <div className="mt-6">
                    <label htmlFor="message" className="mb-3 block text-xs font-bold uppercase text-gray-600">
                      {contactPage.messageField.label}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder={contactPage.messageField.placeholder}
                      className="w-full resize-none border border-[#c8d1dc] bg-white px-4 py-4 text-gray-950 outline-none transition-smooth focus:border-meraba"
                    />
                  </div>

                  {submitError && (
                    <p className="mt-6 border border-[#e1c2c2] bg-[#fff7f7] px-4 py-3 text-sm font-medium text-[#8f3f3f]">
                      {submitError}
                    </p>
                  )}

                  <button type="submit" disabled={isSubmitting} className="btn-primary mt-8 disabled:cursor-not-allowed disabled:opacity-60">
                    {isSubmitting ? 'Sending...' : contactPage.formIntro.submitText}
                  </button>
                </form>
              )}

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
