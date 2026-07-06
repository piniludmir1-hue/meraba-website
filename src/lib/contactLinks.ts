type DefaultContactMessages = {
  whatsappDefaultMessage?: string
  emailDefaultSubject?: string
  emailDefaultMessage?: string
}

export function buildWhatsAppHref(number?: string, messages?: DefaultContactMessages) {
  const cleanNumber = (number || '').replace(/[^\d]/g, '')
  const message = messages?.whatsappDefaultMessage?.trim()

  if (!cleanNumber) return ''

  return message
    ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${cleanNumber}`
}

export function buildEmailHref(email?: string, messages?: DefaultContactMessages) {
  const cleanEmail = email?.trim()
  const subject = messages?.emailDefaultSubject?.trim()
  const body = messages?.emailDefaultMessage?.trim()
  const params = new URLSearchParams()

  if (!cleanEmail) return ''
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)

  const query = params.toString()
  return query ? `mailto:${cleanEmail}?${query}` : `mailto:${cleanEmail}`
}
