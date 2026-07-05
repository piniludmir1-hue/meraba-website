export const adminSessionCookieName = 'meraba_admin_session'
export const adminSessionDurationMs = 1000 * 60 * 60 * 8

const encoder = new TextEncoder()

function base64UrlEncode(bytes: Uint8Array) {
  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(value: string) {
  const paddedValue = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binary = atob(paddedValue)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

async function getSigningKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
}

async function signValue(value: string, secret: string) {
  const key = await getSigningKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value))

  return base64UrlEncode(new Uint8Array(signature))
}

function constantTimeEqual(a: string, b: string) {
  const aBytes = encoder.encode(a)
  const bBytes = encoder.encode(b)
  const length = Math.max(aBytes.length, bBytes.length)
  let result = aBytes.length ^ bBytes.length

  for (let index = 0; index < length; index += 1) {
    result |= (aBytes[index] || 0) ^ (bBytes[index] || 0)
  }

  return result === 0
}

export function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || ''
}

export async function createAdminSessionToken(secret: string, now = Date.now()) {
  const expiresAt = now + adminSessionDurationMs
  const payload = base64UrlEncode(encoder.encode(JSON.stringify({ expiresAt })))
  const signature = await signValue(payload, secret)

  return `${payload}.${signature}`
}

export async function verifyAdminSessionToken(token: string | undefined, secret: string, now = Date.now()) {
  if (!token || !secret) {
    return false
  }

  const [payload, signature] = token.split('.')

  if (!payload || !signature) {
    return false
  }

  const expectedSignature = await signValue(payload, secret)

  if (!constantTimeEqual(signature, expectedSignature)) {
    return false
  }

  try {
    const decodedPayload = new TextDecoder().decode(base64UrlDecode(payload))
    const session = JSON.parse(decodedPayload) as { expiresAt?: number }

    return typeof session.expiresAt === 'number' && session.expiresAt > now
  } catch {
    return false
  }
}

export async function hashAdminPassword(password: string) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(password))

  return base64UrlEncode(new Uint8Array(digest))
}

export async function verifyAdminPassword(password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME || ''
  const configuredPassword = process.env.ADMIN_PASSWORD || ''
  const configuredPasswordHash = process.env.ADMIN_PASSWORD_HASH_SHA256 || ''

  if (!expectedUsername || (!configuredPassword && !configuredPasswordHash)) {
    return false
  }

  if (configuredPasswordHash) {
    const passwordHash = await hashAdminPassword(password)

    return constantTimeEqual(passwordHash, configuredPasswordHash)
  }

  return constantTimeEqual(password, configuredPassword)
}

export function isSecureCookieEnvironment() {
  return process.env.NODE_ENV === 'production'
}
