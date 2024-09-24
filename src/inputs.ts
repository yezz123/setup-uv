import { getInput, notice, warning } from '@actions/core'
import semver from 'semver'

export interface Inputs {
  version: string | null
  venv: string | null
  cache: boolean
}

export function getInputs(): Inputs {
  const version = getVersionInput('uv-version')
  return {
    version,
    venv: getVenvInput('uv-venv'),
    cache: getCacheInput('uv-cache', version)
  }
}

export function getVersionInput(name: string): string | null {
  const version = getInput(name)
  if (!version || version.toLowerCase() === 'latest') {
    notice('Using latest uv version')
    return null
  }

  const coerced = semver.coerce(version)
  if (!coerced) {
    throw new Error(`Passed uv version '${version}' is not valid`)
  } else if (!semver.satisfies(coerced, '>=0.3.0')) {
    warning(
      `Passed uv version '${coerced}' is less than 0.3.0. Caching will be disabled.`
    )
  }

  warning(`Using uv version ${version}. This may not be the latest version.`)

  return version.trim()
}

export function getVenvInput(name: string): string | null {
  const venv = getInput(name)
  if (!venv) {
    return null
  }
  return venv.trim()
}

export function getCacheInput(name: string, version: string | null): boolean {
  const cache = getInput(name)
  const cacheRequested = cache.toLowerCase() === 'true'

  if (cacheRequested && version) {
    const coerced = semver.coerce(version)
    if (coerced && semver.satisfies(coerced, '>=0.3.0')) {
      return true
    } else {
      warning(
        'Cache requested but uv version is less than 0.3.0. Caching will be disabled.'
      )
      return false
    }
  }

  return cacheRequested && version === null // Allow caching for 'latest' version
}

export function isCacheAllowed(version: string | null): boolean {
  if (!version) {
    return true
  }
  const coerced = semver.coerce(version)
  return coerced ? semver.satisfies(coerced, '>=0.3.0') : false
}
