import {
  buildContentFromDocuments,
  contentDocumentPaths,
  contentDocuments,
  fallbackContent,
  type SiteContent,
} from '@/lib/fallbackContent'

export const cmsContentTag = 'cms-content'
export const cmsStorageBucket = process.env.SUPABASE_STORAGE_BUCKET || 'meraba-uploads'

type SupabaseDocumentRow = {
  path: string
  data: unknown
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, '') || ''
  const anonKey = process.env.SUPABASE_ANON_KEY || ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  return {
    url,
    anonKey,
    serviceRoleKey,
    enabled: Boolean(url && serviceRoleKey),
  }
}

export function isSupabaseCmsConfigured() {
  return getSupabaseConfig().enabled
}

function getSupabaseHeaders(useServiceRole = true) {
  const config = getSupabaseConfig()
  const apiKey = useServiceRole ? config.serviceRoleKey : config.anonKey || config.serviceRoleKey

  if (!config.url || !apiKey) {
    throw new Error('Supabase CMS is not configured. Set SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.')
  }

  return {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
  }
}

async function supabaseJsonRequest<T>(path: string, init: RequestInit = {}) {
  const config = getSupabaseConfig()

  if (!config.enabled) {
    throw new Error('Supabase CMS is not configured.')
  }

  const response = await fetch(`${config.url}${path}`, {
    ...init,
    headers: {
      ...getSupabaseHeaders(true),
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Supabase request failed (${response.status}): ${text || response.statusText}`)
  }

  if (response.status === 204) {
    return null as T
  }

  const text = await response.text()
  return (text ? JSON.parse(text) : null) as T
}

export function normalizeCmsPath(filePath: string) {
  return filePath.replace(/\\/g, '/').replace(/^\/+/, '')
}

function safeStorageSegment(segment: string) {
  let hashValue = 2166136261

  for (let index = 0; index < segment.length; index += 1) {
    hashValue ^= segment.charCodeAt(index)
    hashValue = Math.imul(hashValue, 16777619)
  }

  const hash = (hashValue >>> 0).toString(36).slice(0, 8)
  const normalized = segment.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  const extensionIndex = normalized.lastIndexOf('.')
  const hasExtension = extensionIndex > 0 && extensionIndex < normalized.length - 1
  const rawBase = hasExtension ? normalized.slice(0, extensionIndex) : normalized
  const rawExtension = hasExtension ? normalized.slice(extensionIndex + 1) : ''
  const base = rawBase
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'file'
  const extension = rawExtension.toLowerCase().replace(/[^a-z0-9]+/g, '')

  return `${base}-${hash}${extension ? `.${extension}` : ''}`
}

export function storagePathFromCmsPath(filePath: string) {
  const normalizedPath = normalizeCmsPath(filePath)
  let storagePath = normalizedPath

  if (normalizedPath.startsWith('public/uploads/')) {
    storagePath = normalizedPath.replace(/^public\/uploads\/+/, '')
  } else if (normalizedPath.startsWith('uploads/')) {
    storagePath = normalizedPath.replace(/^uploads\/+/, '')
  }

  return storagePath.split('/').map(safeStorageSegment).join('/')
}

export function getSupabasePublicMediaUrl(filePath: string) {
  const config = getSupabaseConfig()
  const storagePath = storagePathFromCmsPath(filePath)

  if (!config.url || !storagePath) {
    return filePath
  }

  return `${config.url}/storage/v1/object/public/${cmsStorageBucket}/${storagePath.split('/').map(encodeURIComponent).join('/')}`
}

export function resolveCmsMediaValue(value: string) {
  if (!value) return value

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  if (value.startsWith('/uploads/')) {
    return getSupabasePublicMediaUrl(value.replace(/^\/uploads\/+/, 'public/uploads/'))
  }

  if (value.startsWith('public/uploads/')) {
    return getSupabasePublicMediaUrl(value)
  }

  return value
}

function resolveMediaValues<T>(value: T): T {
  if (typeof value === 'string') {
    return resolveCmsMediaValue(value) as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveMediaValues(item)) as T
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, resolveMediaValues(entryValue)])
    ) as T
  }

  return value
}

export async function readCmsDocument(filePath: string) {
  const normalizedPath = normalizeCmsPath(filePath)
  const rows = await supabaseJsonRequest<SupabaseDocumentRow[]>(
    `/rest/v1/cms_documents?path=eq.${encodeURIComponent(normalizedPath)}&select=path,data&limit=1`,
    { cache: 'no-store' },
  )

  return rows[0]?.data ?? null
}

export async function readCmsDocuments(filePaths = contentDocumentPaths as string[]) {
  const entries = await Promise.all(
    filePaths.map(async (filePath) => {
      const data = await readCmsDocument(filePath)
      return data ? ([normalizeCmsPath(filePath), data] as [string, unknown]) : null
    }),
  )

  return Object.fromEntries(entries.filter((entry): entry is [string, unknown] => Boolean(entry)))
}

async function loadSupabaseContent() {
  if (!isSupabaseCmsConfigured()) {
    return fallbackContent
  }

  try {
    const documents = await readCmsDocuments()
    return resolveMediaValues(buildContentFromDocuments(documents as Partial<Record<keyof typeof contentDocuments, unknown>>))
  } catch (error) {
    console.error('Failed to load Supabase CMS content. Falling back to bundled content.', error)
    return fallbackContent
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  return loadSupabaseContent()
}

export async function upsertCmsDocument(filePath: string, data: unknown) {
  const normalizedPath = normalizeCmsPath(filePath)

  await supabaseJsonRequest('/rest/v1/cms_documents?on_conflict=path', {
    method: 'POST',
    body: JSON.stringify({
      path: normalizedPath,
      data,
      updated_at: new Date().toISOString(),
    }),
    headers: {
      Prefer: 'resolution=merge-duplicates',
    },
  })
}

export async function deleteCmsDocument(filePath: string) {
  const normalizedPath = normalizeCmsPath(filePath)

  await supabaseJsonRequest(`/rest/v1/cms_documents?path=eq.${encodeURIComponent(normalizedPath)}`, {
    method: 'DELETE',
  })
}

export async function listCmsDocuments(prefix = 'src/content') {
  return supabaseJsonRequest<SupabaseDocumentRow[]>(
    `/rest/v1/cms_documents?path=like.${encodeURIComponent(`${normalizeCmsPath(prefix)}%`)}&select=path,data&order=path.asc`,
    { cache: 'no-store' },
  )
}

export async function uploadCmsMedia(filePath: string, content: Buffer, contentType = 'application/octet-stream') {
  const config = getSupabaseConfig()
  const storagePath = storagePathFromCmsPath(filePath)
  const uploadPath = storagePath.split('/').map(encodeURIComponent).join('/')

  if (!config.enabled) {
    throw new Error('Supabase CMS is not configured.')
  }

  const response = await fetch(`${config.url}/storage/v1/object/${cmsStorageBucket}/${uploadPath}`, {
    method: 'POST',
    headers: {
      ...getSupabaseHeaders(true),
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body: new Uint8Array(content),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Supabase media upload failed (${response.status}): ${text || response.statusText}`)
  }

  const publicUrl = getSupabasePublicMediaUrl(filePath)

  await supabaseJsonRequest('/rest/v1/cms_media?on_conflict=path', {
    method: 'POST',
    body: JSON.stringify({
      path: normalizeCmsPath(filePath),
      storage_bucket: cmsStorageBucket,
      storage_path: storagePath,
      public_url: publicUrl,
      mime_type: contentType,
      size_bytes: content.length,
      updated_at: new Date().toISOString(),
    }),
    headers: {
      Prefer: 'resolution=merge-duplicates',
    },
  })

  return publicUrl
}

export async function readCmsMedia(filePath: string) {
  const config = getSupabaseConfig()
  const storagePath = storagePathFromCmsPath(filePath)
  const objectPath = storagePath.split('/').map(encodeURIComponent).join('/')

  if (!config.enabled) {
    throw new Error('Supabase CMS is not configured.')
  }

  const response = await fetch(`${config.url}/storage/v1/object/${cmsStorageBucket}/${objectPath}`, {
    headers: getSupabaseHeaders(true),
    cache: 'no-store',
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Supabase media read failed (${response.status}): ${text || response.statusText}`)
  }

  return Buffer.from(await response.arrayBuffer())
}

export async function listCmsMedia() {
  const rows = await supabaseJsonRequest<Array<{ path: string; public_url: string }>>(
    '/rest/v1/cms_media?select=path,public_url&order=path.asc',
    { cache: 'no-store' },
  )

  return rows
}

export async function deleteCmsMedia(filePath: string) {
  const config = getSupabaseConfig()
  const storagePath = storagePathFromCmsPath(filePath)
  const objectPath = storagePath.split('/').map(encodeURIComponent).join('/')

  if (!config.enabled) {
    throw new Error('Supabase CMS is not configured.')
  }

  await fetch(`${config.url}/storage/v1/object/${cmsStorageBucket}/${objectPath}`, {
    method: 'DELETE',
    headers: getSupabaseHeaders(true),
  })

  await supabaseJsonRequest(`/rest/v1/cms_media?path=eq.${encodeURIComponent(normalizeCmsPath(filePath))}`, {
    method: 'DELETE',
  })
}

export function revalidateCmsContent() {
  return undefined
}
