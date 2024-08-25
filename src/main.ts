import { setFailed, getInput } from '@actions/core'
import { findUv } from './find'
import { getInputs } from './inputs'
import { activateVenv, createVenv } from './venv'
import { setupCache, restoreCache, saveCache, minimizeCache } from './cache'

async function run(): Promise<void> {
  try {
    const inputs = getInputs()
    const cacheDir = getInput('uv-cache-dir')

    if (cacheDir) {
      process.env.UV_CACHE_DIR = cacheDir
    }

    await setupCache()
    await restoreCache()

    await findUv(inputs.version)
    if (inputs.venv) {
      await createVenv(inputs.venv)
      await activateVenv(inputs.venv)
    }

    await saveCache()
    await minimizeCache()
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
