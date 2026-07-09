import crypto from 'crypto'
import path from 'path'
import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'
import {
  deleteCmsDocument,
  deleteCmsMedia,
  isSupabaseCmsConfigured,
  listCmsDocuments,
  listCmsMedia,
  normalizeCmsPath,
  readCmsDocument,
  readCmsMedia,
  revalidateCmsContent,
  uploadCmsMedia,
  upsertCmsDocument,
} from '@/lib/supabaseCms'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type DecapAsset = {
  path: string
  content: string
  encoding: BufferEncoding
}

type DecapDataFile = {
  path: string
  raw: string
  newPath?: string
}

type DecapRequest = {
  action?: string
  params?: Record<string, unknown>
}

const repoRoot = process.cwd()
const allowedRoots = [
  {
    publicPrefix: 'src/content',
    absolutePath: path.join(process.cwd(), 'src', 'content'),
  },
  {
    publicPrefix: 'public/uploads',
    absolutePath: path.join(process.cwd(), 'public', 'uploads'),
  },
]

function canUseLocalCmsFallback() {
  return process.env.NODE_ENV !== 'production'
}

function assertCmsPersistenceAvailable() {
  if (!isSupabaseCmsConfigured() && !canUseLocalCmsFallback()) {
    throw new Error('Supabase CMS is not configured. Set SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.')
  }
}

function sha256(content: Buffer) {
  return crypto.createHash('sha256').update(content).digest('hex')
}

function resolveRepoPath(filePath: string) {
  const normalizedPath = normalizeCmsPath(filePath)
  const matchingRoot = allowedRoots.find(
    (root) => normalizedPath === root.publicPrefix || normalizedPath.startsWith(`${root.publicPrefix}/`),
  )

  if (!matchingRoot) {
    throw new Error('Invalid file path.')
  }

  const relativePath = normalizedPath.slice(matchingRoot.publicPrefix.length).replace(/^\/+/, '')
  const resolvedPath = path.resolve(matchingRoot.absolutePath, relativePath)

  if (!resolvedPath.startsWith(matchingRoot.absolutePath)) {
    throw new Error('Invalid file path.')
  }

  return resolvedPath
}

function parseJson(raw: string) {
  try {
    return JSON.parse(raw)
  } catch {
    throw new Error('Invalid JSON content.')
  }
}

function inferMimeType(filePath: string) {
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

async function readLocalEntry(filePath: string, label?: string) {
  try {
    const content = await fs.readFile(resolveRepoPath(filePath))

    return {
      data: content.toString(),
      file: {
        path: normalizeCmsPath(filePath),
        label,
        id: sha256(content),
      },
    }
  } catch {
    return {
      data: null,
      file: {
        path: normalizeCmsPath(filePath),
        label,
        id: null,
      },
    }
  }
}

async function readEntry(filePath: string, label?: string) {
  assertCmsPersistenceAvailable()

  if (!isSupabaseCmsConfigured()) {
    return readLocalEntry(filePath, label)
  }

  const data = await readCmsDocument(filePath)

  if (!data) {
    return {
      data: null,
      file: {
        path: normalizeCmsPath(filePath),
        label,
        id: null,
      },
    }
  }

  const content = Buffer.from(JSON.stringify(data, null, 2))

  return {
    data: content.toString(),
    file: {
      path: normalizeCmsPath(filePath),
      label,
      id: sha256(content),
    },
  }
}

async function listLocalFiles(folder: string, extension: string, depth: number): Promise<string[]> {
  if (depth <= 0) {
    return []
  }

  try {
    const folderPath = resolveRepoPath(folder)
    const entries = await fs.readdir(folderPath, { withFileTypes: true })
    const files = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(folder, entry.name)

        if (entry.isDirectory()) {
          return listLocalFiles(entryPath, extension, depth - 1)
        }

        return !extension || entryPath.endsWith(extension) ? [normalizeCmsPath(entryPath)] : []
      }),
    )

    return files.flat()
  } catch {
    return []
  }
}

async function listFiles(folder: string, extension: string, depth: number): Promise<string[]> {
  assertCmsPersistenceAvailable()

  if (!isSupabaseCmsConfigured()) {
    return listLocalFiles(folder, extension, depth)
  }

  const documents = await listCmsDocuments(folder)

  return documents
    .map((document) => normalizeCmsPath(document.path))
    .filter((filePath) => !extension || filePath.endsWith(extension))
}

async function writeEntry(filePath: string, raw: string) {
  assertCmsPersistenceAvailable()

  if (isSupabaseCmsConfigured()) {
    await upsertCmsDocument(filePath, parseJson(raw))
    return
  }

  const resolvedPath = resolveRepoPath(filePath)

  await fs.mkdir(path.dirname(resolvedPath), { recursive: true })
  await fs.writeFile(resolvedPath, raw)
}

async function writeMedia(filePath: string, content: Buffer) {
  assertCmsPersistenceAvailable()

  if (isSupabaseCmsConfigured()) {
    await uploadCmsMedia(filePath, content, inferMimeType(filePath))
    return
  }

  const resolvedPath = resolveRepoPath(filePath)

  await fs.mkdir(path.dirname(resolvedPath), { recursive: true })
  await fs.writeFile(resolvedPath, content)
}

async function deleteFile(filePath: string) {
  assertCmsPersistenceAvailable()

  if (isSupabaseCmsConfigured()) {
    const normalizedPath = normalizeCmsPath(filePath)

    if (normalizedPath.startsWith('src/content/')) {
      await deleteCmsDocument(filePath)
    } else if (normalizedPath.startsWith('public/uploads/')) {
      await deleteCmsMedia(filePath)
    }

    return
  }

  await fs.unlink(resolveRepoPath(filePath)).catch(() => undefined)
}

async function renameFile(filePath: string, newPath: string) {
  assertCmsPersistenceAvailable()

  if (isSupabaseCmsConfigured()) {
    const entry = await readCmsDocument(filePath)

    if (entry) {
      await upsertCmsDocument(newPath, entry)
      await deleteCmsDocument(filePath)
    }

    return
  }

  const from = resolveRepoPath(filePath)
  const to = resolveRepoPath(newPath)

  await fs.mkdir(path.dirname(to), { recursive: true })
  await fs.rename(from, to)
}

async function readMediaFile(filePath: string) {
  assertCmsPersistenceAvailable()
  const content = isSupabaseCmsConfigured()
    ? await readCmsMedia(filePath)
    : await fs.readFile(resolveRepoPath(filePath))

  return {
    id: sha256(content),
    content: content.toString('base64'),
    encoding: 'base64',
    path: normalizeCmsPath(filePath),
    name: path.basename(filePath),
  }
}

function getParams(body: DecapRequest) {
  return (body.params || {}) as Record<string, unknown>
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function asNumber(value: unknown, fallback = 1) {
  return typeof value === 'number' ? value : fallback
}

export async function POST(request: Request) {
  let body: DecapRequest

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const params = getParams(body)

  try {
    switch (body.action) {
      case 'info':
        return NextResponse.json({
          repo: path.basename(repoRoot),
          publish_modes: ['simple'],
          type: isSupabaseCmsConfigured() ? 'supabase' : 'local_fs',
        })

      case 'entriesByFiles': {
        const files = Array.isArray(params.files) ? params.files : []
        const entries = await Promise.all(
          files.map((file) => {
            const entryFile = file as { path?: string; label?: string }
            return readEntry(asString(entryFile.path), entryFile.label)
          }),
        )

        return NextResponse.json(entries)
      }

      case 'entriesByFolder': {
        const files = await listFiles(
          asString(params.folder),
          asString(params.extension),
          asNumber(params.depth, 1),
        )
        const entries = await Promise.all(files.map((filePath) => readEntry(filePath)))

        return NextResponse.json(entries)
      }

      case 'getEntry':
        return NextResponse.json(await readEntry(asString(params.path)))

      case 'persistEntry': {
        const entry = params.entry as DecapDataFile | undefined
        const dataFiles = (Array.isArray(params.dataFiles) ? params.dataFiles : entry ? [entry] : []) as DecapDataFile[]
        const assets = (Array.isArray(params.assets) ? params.assets : []) as DecapAsset[]

        await Promise.all(dataFiles.map((file) => writeEntry(file.path, file.raw)))
        await Promise.all(
          assets.map((asset) => writeMedia(asset.path, Buffer.from(asset.content, asset.encoding))),
        )
        await Promise.all(
          dataFiles
            .filter((file) => file.newPath && file.newPath !== file.path)
            .map((file) => renameFile(file.path, file.newPath as string)),
        )

        revalidateCmsContent()

        return NextResponse.json({ message: 'entry persisted' })
      }

      case 'getMedia': {
        if (isSupabaseCmsConfigured()) {
          const mediaFiles = await listCmsMedia()
          const serializedMedia = await Promise.all(mediaFiles.map((file) => readMediaFile(file.path)))

          return NextResponse.json(serializedMedia)
        }

        const mediaFolder = asString(params.mediaFolder)
        const mediaFiles = await listLocalFiles(mediaFolder, '', 1)
        const serializedMedia = await Promise.all(mediaFiles.map((filePath) => readMediaFile(filePath)))

        return NextResponse.json(serializedMedia)
      }

      case 'getMediaFile':
        return NextResponse.json(await readMediaFile(asString(params.path)))

      case 'persistMedia': {
        const asset = params.asset as DecapAsset | undefined

        if (!asset) {
          return NextResponse.json({ error: 'Missing media asset.' }, { status: 422 })
        }

        await writeMedia(asset.path, Buffer.from(asset.content, asset.encoding))
        revalidateCmsContent()

        return NextResponse.json(await readMediaFile(asset.path))
      }

      case 'deleteFile':
        await deleteFile(asString(params.path))
        revalidateCmsContent()
        return NextResponse.json({ message: `deleted file ${asString(params.path)}` })

      case 'deleteFiles': {
        const paths = Array.isArray(params.paths) ? params.paths.map(asString) : []
        await Promise.all(paths.map((filePath) => deleteFile(filePath)))
        revalidateCmsContent()

        return NextResponse.json({ message: `deleted files ${paths.join(', ')}` })
      }

      case 'unpublishedEntries':
        return NextResponse.json([])

      case 'getDeployPreview':
        return NextResponse.json(null)

      default:
        return NextResponse.json({ error: `Unknown action ${body.action}` }, { status: 422 })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
