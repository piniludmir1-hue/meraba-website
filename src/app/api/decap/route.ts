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
const githubApiBase = 'https://api.github.com'
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

function getGithubConfig() {
  const token = process.env.GITHUB_TOKEN || ''
  const owner = process.env.GITHUB_OWNER || ''
  const repo = process.env.GITHUB_REPO || ''
  const branch = process.env.GITHUB_BRANCH || 'main'

  return {
    token,
    owner,
    repo,
    branch,
    enabled: Boolean(token && owner && repo && branch),
  }
}

function canUseLocalCmsFallback() {
  return process.env.NODE_ENV !== 'production'
}

function assertCmsPersistenceAvailable() {
  if (!getGithubConfig().enabled && !canUseLocalCmsFallback()) {
    throw new Error('GitHub CMS persistence is not configured. Set GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, and GITHUB_BRANCH.')
  }
}

function sha256(content: Buffer) {
  return crypto.createHash('sha256').update(content).digest('hex')
}

function getAllowedRepoPath(filePath: string) {
  const normalizedPath = normalizePath(filePath).replace(/^\/+/, '')
  const matchingRoot = allowedRoots.find(
    (root) => normalizedPath === root.publicPrefix || normalizedPath.startsWith(`${root.publicPrefix}/`),
  )

  if (!matchingRoot) {
    throw new Error('Invalid file path.')
  }

  const relativePath = normalizedPath.slice(matchingRoot.publicPrefix.length).replace(/^\/+/, '')

  return {
    normalizedPath,
    matchingRoot,
    relativePath,
  }
}

function resolveRepoPath(filePath: string) {
  const { matchingRoot, relativePath } = getAllowedRepoPath(filePath)
  const resolvedPath = path.resolve(matchingRoot.absolutePath, relativePath)

  if (!resolvedPath.startsWith(matchingRoot.absolutePath)) {
    throw new Error('Invalid file path.')
  }

  return resolvedPath
}

function encodeRepoPath(filePath: string) {
  return getAllowedRepoPath(filePath)
    .normalizedPath
    .split('/')
    .map(encodeURIComponent)
    .join('/')
}

function contentToBase64(content: string | Buffer) {
  return Buffer.isBuffer(content)
    ? content.toString('base64')
    : Buffer.from(content, 'utf8').toString('base64')
}

function base64ToBuffer(content: string) {
  return Buffer.from(content.replace(/\s/g, ''), 'base64')
}

async function githubRequest<T>(url: string, init: RequestInit = {}) {
  const github = getGithubConfig()

  if (!github.enabled) {
    throw new Error('GitHub CMS persistence is not configured.')
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${github.token}`,
      'User-Agent': 'meraba-cms',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {}),
    },
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`GitHub API request failed (${response.status}): ${text || response.statusText}`)
  }

  return response.json() as Promise<T>
}

async function githubRawFile(filePath: string) {
  const github = getGithubConfig()
  const encodedPath = encodeRepoPath(filePath)
  const url = `${githubApiBase}/repos/${github.owner}/${github.repo}/contents/${encodedPath}?ref=${encodeURIComponent(github.branch)}`
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.raw',
      Authorization: `Bearer ${github.token}`,
      'User-Agent': 'meraba-cms',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`GitHub raw file request failed (${response.status}): ${text || response.statusText}`)
  }

  return Buffer.from(await response.arrayBuffer())
}

async function getGithubContent(filePath: string) {
  const github = getGithubConfig()
  const encodedPath = encodeRepoPath(filePath)
  const url = `${githubApiBase}/repos/${github.owner}/${github.repo}/contents/${encodedPath}?ref=${encodeURIComponent(github.branch)}`

  return githubRequest<{
    type: 'file' | 'dir'
    path: string
    name: string
    sha: string
    content?: string
    encoding?: string
  }>(url)
}

async function getGithubContentIfExists(filePath: string) {
  try {
    return await getGithubContent(filePath)
  } catch (error) {
    if (error instanceof Error && error.message.includes('(404)')) {
      return null
    }

    throw error
  }
}

async function listGithubFiles(folder: string, extension: string, depth: number): Promise<string[]> {
  if (depth <= 0) {
    return []
  }

  const github = getGithubConfig()
  const encodedPath = encodeRepoPath(folder)
  const url = `${githubApiBase}/repos/${github.owner}/${github.repo}/contents/${encodedPath}?ref=${encodeURIComponent(github.branch)}`
  const entries = await githubRequest<Array<{ type: 'file' | 'dir'; path: string; name: string }>>(url)
  const files = await Promise.all(
    entries.map(async (entry) => {
      if (entry.type === 'dir') {
        return listGithubFiles(entry.path, extension, depth - 1)
      }

      return !extension || entry.path.endsWith(extension) ? [normalizePath(entry.path)] : []
    }),
  )

  return files.flat()
}

async function writeGithubFile(filePath: string, content: string | Buffer, message: string) {
  const github = getGithubConfig()
  const encodedPath = encodeRepoPath(filePath)
  const existingFile = await getGithubContentIfExists(filePath)
  const url = `${githubApiBase}/repos/${github.owner}/${github.repo}/contents/${encodedPath}`

  return githubRequest(url, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: contentToBase64(content),
      branch: github.branch,
      ...(existingFile?.sha ? { sha: existingFile.sha } : {}),
    }),
  })
}

async function deleteGithubFile(filePath: string, message: string) {
  const github = getGithubConfig()
  const encodedPath = encodeRepoPath(filePath)
  const existingFile = await getGithubContentIfExists(filePath)

  if (!existingFile?.sha) {
    return
  }

  const url = `${githubApiBase}/repos/${github.owner}/${github.repo}/contents/${encodedPath}`

  await githubRequest(url, {
    method: 'DELETE',
    body: JSON.stringify({
      message,
      sha: existingFile.sha,
      branch: github.branch,
    }),
  })
}

async function readEntry(filePath: string, label?: string) {
  try {
    const github = getGithubConfig()
    assertCmsPersistenceAvailable()
    const content = github.enabled
      ? base64ToBuffer((await getGithubContent(filePath)).content || '')
      : await fs.readFile(resolveRepoPath(filePath))

    return {
      data: content.toString(),
      file: {
        path: normalizePath(filePath),
        label,
        id: sha256(content),
      },
    }
  } catch (error) {
    const github = getGithubConfig()
    const message = error instanceof Error ? error.message : ''

    if (!canUseLocalCmsFallback() && !github.enabled) {
      throw error
    }

    if (github.enabled && !message.includes('(404)')) {
      throw error
    }

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

  const github = getGithubConfig()

  if (github.enabled) {
    return listGithubFiles(folder, extension, depth)
  }

  assertCmsPersistenceAvailable()

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
  const github = getGithubConfig()

  if (github.enabled) {
    await writeGithubFile(filePath, content, `Update ${normalizePath(filePath)}`)
    return
  }

  assertCmsPersistenceAvailable()

  const resolvedPath = resolveRepoPath(filePath)

  await fs.mkdir(path.dirname(resolvedPath), { recursive: true })
  await fs.writeFile(resolvedPath, content)
}

async function deleteFile(filePath: string) {
  const github = getGithubConfig()

  if (github.enabled) {
    await deleteGithubFile(filePath, `Delete ${normalizePath(filePath)}`)
    return
  }

  assertCmsPersistenceAvailable()

  await fs.unlink(resolveRepoPath(filePath)).catch(() => undefined)
}

async function renameFile(filePath: string, newPath: string) {
  const github = getGithubConfig()

  if (github.enabled) {
    const content = await githubRawFile(filePath)
    await writeGithubFile(newPath, content, `Move ${normalizePath(filePath)} to ${normalizePath(newPath)}`)
    await deleteGithubFile(filePath, `Remove moved file ${normalizePath(filePath)}`)
    return
  }

  assertCmsPersistenceAvailable()

  const from = resolveRepoPath(filePath)
  const to = resolveRepoPath(newPath)

  await fs.mkdir(path.dirname(to), { recursive: true })
  await fs.rename(from, to)
}

async function readMediaFile(filePath: string) {
  const github = getGithubConfig()
  assertCmsPersistenceAvailable()
  const content = github.enabled
    ? await githubRawFile(filePath)
    : await fs.readFile(resolveRepoPath(filePath))

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
          type: getGithubConfig().enabled ? 'github' : 'local_fs',
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
            .map((file) => renameFile(file.path, file.newPath as string)),
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
        await deleteFile(asString(params.path))
        return NextResponse.json({ message: `deleted file ${asString(params.path)}` })

      case 'deleteFiles': {
        const paths = Array.isArray(params.paths) ? params.paths.map(asString) : []
        await Promise.all(paths.map((filePath) => deleteFile(filePath)))

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
