import crypto from 'crypto'
import path from 'path'
import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'

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

function normalizePath(filePath: string) {
  return filePath.replace(/\\/g, '/')
}

function sha256(content: Buffer) {
  return crypto.createHash('sha256').update(content).digest('hex')
}

function resolveRepoPath(filePath: string) {
  const normalizedPath = normalizePath(filePath).replace(/^\/+/, '')
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

async function readEntry(filePath: string, label?: string) {
  try {
    const content = await fs.readFile(resolveRepoPath(filePath))

    return {
      data: content.toString(),
      file: {
        path: normalizePath(filePath),
        label,
        id: sha256(content),
      },
    }
  } catch {
    return {
      data: null,
      file: {
        path: normalizePath(filePath),
        label,
        id: null,
      },
    }
  }
}

async function listFiles(folder: string, extension: string, depth: number): Promise<string[]> {
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
          return listFiles(entryPath, extension, depth - 1)
        }

        return !extension || entryPath.endsWith(extension) ? [normalizePath(entryPath)] : []
      }),
    )

    return files.flat()
  } catch {
    return []
  }
}

async function writeFile(filePath: string, content: string | Buffer) {
  const resolvedPath = resolveRepoPath(filePath)

  await fs.mkdir(path.dirname(resolvedPath), { recursive: true })
  await fs.writeFile(resolvedPath, content)
}

async function readMediaFile(filePath: string) {
  const content = await fs.readFile(resolveRepoPath(filePath))

  return {
    id: sha256(content),
    content: content.toString('base64'),
    encoding: 'base64',
    path: normalizePath(filePath),
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
          type: 'local_fs',
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

        await Promise.all(dataFiles.map((file) => writeFile(file.path, file.raw)))
        await Promise.all(
          assets.map((asset) => writeFile(asset.path, Buffer.from(asset.content, asset.encoding))),
        )
        await Promise.all(
          dataFiles
            .filter((file) => file.newPath && file.newPath !== file.path)
            .map(async (file) => {
              const from = resolveRepoPath(file.path)
              const to = resolveRepoPath(file.newPath as string)
              await fs.mkdir(path.dirname(to), { recursive: true })
              await fs.rename(from, to)
            }),
        )

        return NextResponse.json({ message: 'entry persisted' })
      }

      case 'getMedia': {
        const mediaFolder = asString(params.mediaFolder)
        const mediaFiles = await listFiles(mediaFolder, '', 1)
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

        await writeFile(asset.path, Buffer.from(asset.content, asset.encoding))

        return NextResponse.json(await readMediaFile(asset.path))
      }

      case 'deleteFile':
        await fs.unlink(resolveRepoPath(asString(params.path))).catch(() => undefined)
        return NextResponse.json({ message: `deleted file ${asString(params.path)}` })

      case 'deleteFiles': {
        const paths = Array.isArray(params.paths) ? params.paths.map(asString) : []
        await Promise.all(paths.map((filePath) => fs.unlink(resolveRepoPath(filePath)).catch(() => undefined)))

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
