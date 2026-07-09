import fs from 'node:fs/promises'
import path from 'node:path'

const projectRoot = process.cwd()
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, '')
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'meraba-uploads'

const contentFiles = [
  'src/content/site-settings.json',
  'src/content/site.json',
  'src/content/header.json',
  'src/content/footer.json',
  'src/content/media.json',
  'src/content/homepage.json',
  'src/content/homepage-product-areas.json',
  'src/content/products-page.json',
  'src/content/about-page.json',
  'src/content/contact-page.json',
  'src/content/accessibility-page.json',
  'src/content/industries.json',
  'src/content/categories.json',
  'src/content/products.json',
]

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

function headers(extra = {}) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    ...extra,
  }
}

function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/').replace(/^\/+/, '')
}

function hashStorageSegment(segment) {
  let hash = 2166136261

  for (let index = 0; index < segment.length; index += 1) {
    hash ^= segment.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return (hash >>> 0).toString(36).slice(0, 8)
}

function safeStorageSegment(segment) {
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
  const hash = hashStorageSegment(segment)

  return `${base}-${hash}${extension ? `.${extension}` : ''}`
}

function storagePathFromCmsPath(filePath) {
  return normalizePath(filePath)
    .replace(/^public\/uploads\/+/, '')
    .split('/')
    .map(safeStorageSegment)
    .join('/')
}

function inferMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase()

  switch (extension) {
    case '.avif':
      return 'image/avif'
    case '.gif':
      return 'image/gif'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.svg':
      return 'image/svg+xml'
    case '.webp':
      return 'image/webp'
    default:
      return 'application/octet-stream'
  }
}

async function requestJson(url, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...headers(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`${response.status} ${response.statusText}: ${text}`)
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

async function upsertDocument(filePath) {
  const fullPath = path.join(projectRoot, filePath)
  const raw = await fs.readFile(fullPath, 'utf8')
  const data = JSON.parse(raw)

  await requestJson(`${supabaseUrl}/rest/v1/cms_documents?on_conflict=path`, {
    method: 'POST',
    body: JSON.stringify({
      path: normalizePath(filePath),
      data,
      updated_at: new Date().toISOString(),
      updated_by: 'migration',
    }),
    headers: {
      Prefer: 'resolution=merge-duplicates',
    },
  })

  console.log(`document: ${filePath}`)
}

async function walkFiles(folder) {
  const entries = await fs.readdir(folder, { withFileTypes: true }).catch(() => [])
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(folder, entry.name)

      if (entry.isDirectory()) {
        return walkFiles(entryPath)
      }

      return [entryPath]
    }),
  )

  return files.flat()
}

async function uploadMedia(fullPath) {
  const relativePath = normalizePath(path.relative(projectRoot, fullPath))
  const storagePath = storagePathFromCmsPath(relativePath)
  const uploadPath = storagePath.split('/').map(encodeURIComponent).join('/')
  const content = await fs.readFile(fullPath)
  const mimeType = inferMimeType(fullPath)

  const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${uploadPath}`, {
    method: 'POST',
    headers: {
      ...headers({
        'Content-Type': mimeType,
        'x-upsert': 'true',
      }),
    },
    body: content,
  })

  if (!uploadResponse.ok) {
    const text = await uploadResponse.text().catch(() => '')
    throw new Error(`Media upload failed for ${relativePath}: ${uploadResponse.status} ${text}`)
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${uploadPath}`

  await requestJson(`${supabaseUrl}/rest/v1/cms_media?on_conflict=path`, {
    method: 'POST',
    body: JSON.stringify({
      path: relativePath,
      storage_bucket: bucket,
      storage_path: storagePath,
      public_url: publicUrl,
      mime_type: mimeType,
      size_bytes: content.length,
      updated_at: new Date().toISOString(),
    }),
    headers: {
      Prefer: 'resolution=merge-duplicates',
    },
  })

  console.log(`media: ${relativePath}`)
}

for (const filePath of contentFiles) {
  await upsertDocument(filePath)
}

const uploadsDir = path.join(projectRoot, 'public', 'uploads')
const uploadFiles = await walkFiles(uploadsDir)

for (const filePath of uploadFiles) {
  await uploadMedia(filePath)
}

console.log('MERABA CMS migration complete.')
