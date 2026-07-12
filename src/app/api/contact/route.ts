import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type ContactRequest = {
  name?: string
  company?: string
  email?: string
  phone?: string
  product?: string
  quantity?: string
  destination?: string
  timeline?: string
  message?: string
}

const defaultRecipientEmail = 'info@meraba.co'
const defaultSubject = 'New MERABA product inquiry'

const requiredFields: Array<{ key: keyof ContactRequest; label: string }> = [
  { key: 'company', label: 'Company' },
  { key: 'email', label: 'Email' },
  { key: 'product', label: 'Product needed' },
  { key: 'quantity', label: 'Estimated annual quantity' },
]

const fieldLabels: Array<{ key: keyof ContactRequest; label: string }> = [
  { key: 'name', label: 'Name' },
  { key: 'company', label: 'Company' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'product', label: 'Product needed' },
  { key: 'quantity', label: 'Estimated annual quantity' },
  { key: 'destination', label: 'Destination' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'message', label: 'Message / Specification' },
]

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function sanitize(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const recipientEmail = process.env.CONTACT_EMAIL_TO?.trim() || defaultRecipientEmail
  const senderEmail = process.env.CONTACT_EMAIL_FROM?.trim()

  return {
    apiKey,
    recipientEmail,
    senderEmail,
    configured: Boolean(apiKey && recipientEmail && senderEmail),
  }
}

export async function POST(request: Request) {
  let body: ContactRequest

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 })
  }

  const inquiry = fieldLabels.reduce<ContactRequest>((acc, field) => {
    acc[field.key] = sanitize(body[field.key])
    return acc
  }, {})

  const missingField = requiredFields.find((field) => !inquiry[field.key])

  if (missingField) {
    return NextResponse.json({ message: `${missingField.label} is required.` }, { status: 400 })
  }

  if (!isValidEmail(inquiry.email || '')) {
    return NextResponse.json({ message: 'A valid email address is required.' }, { status: 400 })
  }

  const emailConfig = getEmailConfig()

  if (!emailConfig.configured) {
    console.error('Contact form email delivery is not configured.', {
      hasResendApiKey: Boolean(emailConfig.apiKey),
      hasContactEmailTo: Boolean(emailConfig.recipientEmail),
      hasContactEmailFrom: Boolean(emailConfig.senderEmail),
    })

    return NextResponse.json(
      { message: 'Email delivery is not configured.' },
      { status: 503 },
    )
  }

  const text = fieldLabels
    .map((field) => `${field.label}: ${inquiry[field.key] || '-'}`)
    .join('\n')

  const htmlRows = fieldLabels
    .map((field) => {
      const value = inquiry[field.key] || '-'
      return `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(field.label)}</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`
    })
    .join('')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${emailConfig.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: emailConfig.senderEmail,
      to: emailConfig.recipientEmail,
      reply_to: inquiry.email,
      subject: defaultSubject,
      text,
      html: `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;color:#111827;">${htmlRows}</table>`,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    console.error('Resend contact email delivery failed.', {
      status: response.status,
      statusText: response.statusText,
      recipientEmail: emailConfig.recipientEmail,
      senderEmail: emailConfig.senderEmail,
      response: errorText,
    })

    return NextResponse.json({ message: 'Email delivery failed.' }, { status: 502 })
  }

  return NextResponse.json({ message: 'Inquiry sent.' })
}
