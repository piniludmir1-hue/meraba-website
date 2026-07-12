import { NextResponse } from 'next/server'
import { fallbackContent, type SiteContent } from '@/lib/fallbackContent'
import { getSiteContent } from '@/lib/supabaseCms'

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
const defaultAutoresponder = {
  subject: 'We received your request | MERABA',
  heading: 'Thank you for contacting MERABA',
  introText: 'Your request has been received successfully.\nOur team will review it and get back to you shortly.',
  tableIntroText: 'Below is a copy of the information you submitted.',
  closingText: 'Thank you for considering MERABA.',
  signatureCompanyName: 'MERABA',
  brandTagline: 'Global sourcing. Local supply. Operational certainty.',
}

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

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/`/g, '&#96;')
}

function textToHtml(value: string) {
  return escapeHtml(value).replace(/\n/g, '<br>')
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

function getContactContent(siteContent: SiteContent) {
  const fieldLabelMap = new Map<string, string>()

  siteContent.contactPage.formFields.forEach((field) => {
    fieldLabelMap.set(field.name, field.label)
  })

  const labels = fieldLabels.map((field) => ({
    key: field.key,
    label: fieldLabelMap.get(field.key) || field.label,
  }))

  const messageLabel = siteContent.contactPage.messageField?.label || 'Message / Specification'
  const autoresponder = {
    ...defaultAutoresponder,
    ...(siteContent.contactPage.autoresponder || {}),
  }

  return {
    labels: labels.map((field) =>
      field.key === 'message' ? { ...field, label: messageLabel } : field
    ),
    autoresponder,
    websiteUrl: siteContent.global.websiteUrl || 'https://meraba.co',
  }
}

function buildRows(inquiry: ContactRequest, labels: Array<{ key: keyof ContactRequest; label: string }>) {
  return labels
    .map((field) => {
      const value = inquiry[field.key] || '-'
      return `<tr><th class="detail-label" align="left" style="width:46%;padding:11px 14px;border-bottom:1px solid #e6ebf0;color:#2d3a46;font-size:13px;font-weight:700;line-height:1.4;vertical-align:top;">${escapeHtml(field.label)}</th><td class="detail-value" style="padding:11px 14px;border-bottom:1px solid #e6ebf0;color:#07111f;font-size:13px;line-height:1.55;vertical-align:top;">${textToHtml(value)}</td></tr>`
    })
    .join('')
}

function buildInternalEmailHtml(rows: string) {
  return `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;color:#111827;">${rows}</table>`
}

function buildConfirmationEmailHtml({
  autoresponder,
  logoUrl,
  brandMarkUrl,
  rows,
}: {
  autoresponder: typeof defaultAutoresponder
  logoUrl: string
  brandMarkUrl: string
  rows: string
}) {
  return `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(autoresponder.subject)}</title>
    <style>
      @media only screen and (max-width: 520px) {
        .outer-pad { padding: 18px 10px !important; }
        .email-shell { width: 100% !important; }
        .logo-cell { padding: 28px 22px 16px 22px !important; }
        .copy-cell { padding: 0 22px 22px 22px !important; }
        .email-heading { font-size: 23px !important; line-height: 1.18 !important; }
        .intro-copy { margin-top: 14px !important; font-size: 14px !important; line-height: 1.6 !important; }
        .table-intro-cell { padding: 0 22px 10px 22px !important; }
        .accent-rule { margin-bottom: 18px !important; }
        .table-cell { padding: 8px 22px 22px 22px !important; }
        .detail-label { width: 48% !important; padding: 9px 10px !important; font-size: 12px !important; line-height: 1.35 !important; }
        .detail-value { padding: 9px 10px !important; font-size: 12px !important; line-height: 1.45 !important; }
        .brand-cell { padding: 0 22px 28px 22px !important; }
        .brand-mark { width: 28px !important; max-width: 28px !important; }
        .brand-tagline { font-size: 9px !important; letter-spacing: 0.07em !important; line-height: 1.45 !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f4f7fa;font-family:Arial,Helvetica,sans-serif;color:#07111f;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;background:#f4f7fa;">
      <tr>
        <td class="outer-pad" align="center" style="padding:32px 16px;">
          <table class="email-shell" role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;border-collapse:collapse;background:#ffffff;border:1px solid #dbe3eb;">
            <tr>
              <td class="logo-cell" align="center" style="padding:38px 34px 22px 34px;">
                <img src="${escapeAttribute(logoUrl)}" width="150" alt="MERABA" style="display:block;width:150px;max-width:150px;height:auto;border:0;outline:none;text-decoration:none;" />
              </td>
            </tr>
            <tr>
              <td class="copy-cell" style="padding:0 34px 28px 34px;text-align:center;">
                <h1 class="email-heading" style="margin:0;color:#07111f;font-size:28px;line-height:1.15;font-weight:600;letter-spacing:-0.02em;">${escapeHtml(autoresponder.heading)}</h1>
                <p class="intro-copy" style="margin:18px auto 0 auto;max-width:470px;color:#4d5b69;font-size:15px;line-height:1.7;">${textToHtml(autoresponder.introText)}</p>
              </td>
            </tr>
            <tr>
              <td class="table-intro-cell" style="padding:0 34px 14px 34px;">
                <div class="accent-rule" style="height:3px;width:54px;background:#083f68;margin:0 auto 24px auto;"></div>
                <p style="margin:0;color:#2d3a46;font-size:14px;line-height:1.7;text-align:center;">${textToHtml(autoresponder.tableIntroText)}</p>
              </td>
            </tr>
            <tr>
              <td class="table-cell" style="padding:12px 34px 28px 34px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;border:1px solid #dbe3eb;background:#fbfcfd;">
                  ${rows}
                </table>
              </td>
            </tr>
            <tr>
              <td class="brand-cell" style="padding:0 34px 38px 34px;text-align:center;">
                <table role="presentation" align="center" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 auto;text-align:center;">
                  <tr>
                    <td align="center" style="padding:0;text-align:center;">
                      <img class="brand-mark" src="${escapeAttribute(brandMarkUrl)}" width="34" alt="MERABA" style="display:block;width:34px;max-width:34px;height:auto;margin:0 auto;border:0;outline:none;text-decoration:none;" />
                    </td>
                  </tr>
                  <tr>
                    <td class="brand-tagline" align="center" style="padding:12px 0 0 0;color:#083f68;font-size:11px;font-weight:700;letter-spacing:0.12em;line-height:1.4;text-transform:uppercase;text-align:center;">${escapeHtml(autoresponder.brandTagline)}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export async function POST(request: Request) {
  let body: ContactRequest
  let siteContent = fallbackContent

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 })
  }

  try {
    siteContent = await getSiteContent()
  } catch (error) {
    console.error('Failed to load CMS content for contact autoresponder. Using fallback content.', error)
  }

  const contactContent = getContactContent(siteContent)

  const inquiry = contactContent.labels.reduce<ContactRequest>((acc, field) => {
    acc[field.key] = sanitize(body[field.key])
    return acc
  }, {})

  const missingField = requiredFields.find((field) => !inquiry[field.key])
  const missingFieldLabel = missingField
    ? contactContent.labels.find((field) => field.key === missingField.key)?.label || missingField.label
    : ''

  if (missingField) {
    return NextResponse.json({ message: `${missingFieldLabel} is required.` }, { status: 400 })
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

  const text = contactContent.labels
    .map((field) => `${field.label}: ${inquiry[field.key] || '-'}`)
    .join('\n')

  const htmlRows = buildRows(inquiry, contactContent.labels)
  const logoUrl = `${contactContent.websiteUrl.replace(/\/+$/, '')}/brand/meraba-logo.png`
  const brandMarkUrl = `${contactContent.websiteUrl.replace(/\/+$/, '')}/brand/meraba-icon.png`

  const internalResponse = await fetch('https://api.resend.com/emails', {
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
      html: buildInternalEmailHtml(htmlRows),
    }),
  })

  if (!internalResponse.ok) {
    const errorText = await internalResponse.text().catch(() => '')
    console.error('Resend contact email delivery failed.', {
      status: internalResponse.status,
      statusText: internalResponse.statusText,
      recipientEmail: emailConfig.recipientEmail,
      senderEmail: emailConfig.senderEmail,
      response: errorText,
    })

    return NextResponse.json({ message: 'Email delivery failed.' }, { status: 502 })
  }

  const confirmationResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${emailConfig.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: emailConfig.senderEmail,
      to: inquiry.email,
      reply_to: emailConfig.recipientEmail,
      subject: contactContent.autoresponder.subject,
      text: [
        contactContent.autoresponder.heading,
        '',
        contactContent.autoresponder.introText,
        '',
        contactContent.autoresponder.tableIntroText,
        '',
        text,
        '',
        contactContent.autoresponder.brandTagline,
      ].join('\n'),
      html: buildConfirmationEmailHtml({
        autoresponder: contactContent.autoresponder,
        logoUrl,
        brandMarkUrl,
        rows: htmlRows,
      }),
    }),
  })

  if (!confirmationResponse.ok) {
    const errorText = await confirmationResponse.text().catch(() => '')
    console.error('Resend contact autoresponder delivery failed.', {
      status: confirmationResponse.status,
      statusText: confirmationResponse.statusText,
      recipientEmail: inquiry.email,
      senderEmail: emailConfig.senderEmail,
      replyTo: emailConfig.recipientEmail,
      response: errorText,
    })

    return NextResponse.json({ message: 'Email confirmation delivery failed.' }, { status: 502 })
  }

  return NextResponse.json({ message: 'Inquiry sent.' })
}
