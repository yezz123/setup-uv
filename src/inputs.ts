import { getInput } from '@actions/core'
import semver from 'semver'
export interface Inputs {
  // Finder related inputs
  preview: boolean
  version: string | null
  venv: string | null
}

export function getInputs(): Inputs {
  return {
    preview: getBooleanInput('uv-preview'),
    version: getVersionInput('uv-version'),
    venv: getVenvInput('uv-venv')
  }
}

export function getBooleanInput(name: string, default_ = false): boolean {
  const value = getInput(name)
  if (!value) {
    return default_
  }

  return value === 'true'
}

export function getVersionInput(name: string): string | null {
  const version = getInput(name)
  if (!version) {
    return null
  }

  const coerced = semver.coerce(version)
  if (!coerced) {
    throw new Error(`Passed uv version '${version}' is not a valid`)
  } else if (!semver.satisfies(coerced, '>=0.1.2')) {
    throw new Error(
      `Passed uv version '${coerced}' is not supported.
       Please use any other supported version >=0.1.2`
    )
  }

  return version.trim()
}

export function getVenvInput(name: string, default_ = '.venv'): string {
  const venv = getInput(name)
  if (!venv) {
    return default_
  }
  return venv.trim()
}
