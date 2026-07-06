type DefaultContactMessages = {
  whatsappPrefilledMessage?: string
  emailSubject?: string
  emailBody?: string
  whatsappDefaultMessage?: string
  emailDefaultSubject?: string
  emailDefaultMessage?: string
}

const fallbackWhatsAppMessage = `Hello MERABA, I would like to discuss a product requirement.

Product:
Quantity:
Destination:
Timeline:`

const fallbackEmailSubject = 'Product Requirement for MERABA'

const fallbackEmailBody = `Hello MERABA,

I would like to discuss a product requirement.

Product:
Quantity:
Destination:
Timeline:`

function getWhatsAppMessage(messages?: DefaultContactMessages) {
  return (
    messages?.whatsappPrefilledMessage?.trim() ||
    messages?.whatsappDefaultMessage?.trim() ||
    fallbackWhatsAppMessage
  )
}

function getEmailSubject(messages?: DefaultContactMessages) {
  return (
    messages?.emailSubject?.trim() ||
    messages?.emailDefaultSubject?.trim() ||
    fallbackEmailSubject
  )
}

function getEmailBody(messages?: DefaultContactMessages) {
  return (
    messages?.emailBody?.trim() ||
    messages?.emailDefaultMessage?.trim() ||
    fallbackEmailBody
  )
}

export function buildWhatsAppHref(number?: string, messages?: DefaultContactMessages) {
  const cleanNumber = (number || '').replace(/[^\d]/g, '')
  const message = getWhatsAppMessage(messages)

  if (!cleanNumber) return ''

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
}

export function buildEmailHref(email?: string, messages?: DefaultContactMessages) {
  const cleanEmail = email?.trim()
  const subject = getEmailSubject(messages)
  const body = getEmailBody(messages)
  const params = new URLSearchParams()

  if (!cleanEmail) return ''
  params.set('subject', subject)
  params.set('body', body)

  const query = params.toString()
  return `mailto:${cleanEmail}?${query}`
}

export function buildGmailComposeHref(email?: string, messages?: DefaultContactMessages) {
  const cleanEmail = email?.trim()
  const params = new URLSearchParams()

  if (!cleanEmail) return ''

  params.set('view', 'cm')
  params.set('fs', '1')
  params.set('to', cleanEmail)
  params.set('su', getEmailSubject(messages))
  params.set('body', getEmailBody(messages))

  return `https://mail.google.com/mail/?${params.toString()}`
}
