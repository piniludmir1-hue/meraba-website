import { NextResponse } from 'next/server'

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

const recipientEmail = process.env.CONTACT_EMAIL_TO || 'info@meraba.co'
const senderEmail = process.env.CONTACT_EMAIL_FROM || 'MERABA Website <onboarding@resend.dev>'

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

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { message: 'Email delivery is not configured. Set RESEND_API_KEY to enable contact form delivery.' },
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
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: senderEmail,
      to: recipientEmail,
      reply_to: inquiry.email,
      subject: 'New MERABA product inquiry',
      text,
      html: `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;color:#111827;">${htmlRows}</table>`,
    }),
  })

  if (!response.ok) {
    return NextResponse.json({ message: 'Email delivery failed.' }, { status: 502 })
  }

  return NextResponse.json({ message: 'Inquiry sent.' })
}
