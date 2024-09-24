import { setFailed, getInput, warning } from '@actions/core'
import { findUv } from './find'
import { getInputs, isCacheAllowed } from './inputs'
import { activateVenv, createVenv } from './venv'
import { setupCache, restoreCache, saveCache, minimizeCache } from './cache'

async function run(): Promise<void> {
  try {
    const inputs = getInputs()
    const cacheDir = getInput('uv-cache-dir')

    if (cacheDir) {
      process.env.UV_CACHE_DIR = cacheDir
    }

    const shouldCache = inputs.cache && isCacheAllowed(inputs.version)

    if (shouldCache) {
      await setupCache()
      await restoreCache()
    } else if (inputs.cache && !isCacheAllowed(inputs.version)) {
      warning(
        'Caching is not supported for uv versions below 0.3.0. Skipping cache operations.'
      )
    }

    await findUv(inputs.version)
    if (inputs.venv) {
      await createVenv(inputs.venv)
      await activateVenv(inputs.venv)
    }

    if (shouldCache) {
      await saveCache()
      await minimizeCache()
    }
  } catch (error) {
    setFailed(errorAsMessage(error))
  }
}

function errorAsMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

run()
