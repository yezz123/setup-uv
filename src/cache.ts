import * as core from '@actions/core'
import * as cache from '@actions/cache'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as fs from 'fs'
import * as crypto from 'crypto'
import * as path from 'path'
import * as os from 'os'

const UV_CACHE_DIR =
  process.env.UV_CACHE_DIR || path.join(os.tmpdir(), '.uv-cache')

export async function setupCache(): Promise<void> {
  core.info(`Setting up uv cache directory: ${UV_CACHE_DIR}`)
  await io.mkdirP(UV_CACHE_DIR)
  core.exportVariable('UV_CACHE_DIR', UV_CACHE_DIR)
}

export async function restoreCache(): Promise<void> {
  const lockFile = 'uv.lock'
  if (!fs.existsSync(lockFile)) {
    core.info('No uv.lock file found. Skipping cache restore.')
    return
  }

  const hash = await getFileHash(lockFile)
  const cacheKey = `uv-${process.platform}-${hash}`

  core.info(`Attempting to restore uv cache with key: ${cacheKey}`)
  const cacheHit = await cache.restoreCache([UV_CACHE_DIR], cacheKey, [
    `uv-${process.platform}-`
  ])

  if (cacheHit) {
    core.info('Cache restored successfully')
  } else {
    core.info('No cache found. A new cache will be created after installation.')
  }
}

export async function saveCache(): Promise<void> {
  const lockFile = 'uv.lock'
  if (!fs.existsSync(lockFile)) {
    core.info('No uv.lock file found. Skipping cache save.')
    return
  }

  const hash = await getFileHash(lockFile)
  const cacheKey = `uv-${process.platform}-${hash}`

  core.info(`Saving uv cache with key: ${cacheKey}`)
  try {
    await cache.saveCache([UV_CACHE_DIR], cacheKey)
    core.info('Cache saved successfully')
  } catch (error) {
    core.warning(`Failed to save cache: ${error}`)
  }
}

export async function minimizeCache(): Promise<void> {
  core.info('Minimizing uv cache')
  await exec.exec('uv', ['cache', 'prune', '--ci'])
}

async function getFileHash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    const stream = fs.createReadStream(filePath)
    stream.on('error', err => reject(err))
    stream.on('data', chunk => hash.update(chunk))
    stream.on('end', () => resolve(hash.digest('hex')))
  })
}
