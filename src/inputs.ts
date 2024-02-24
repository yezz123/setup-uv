import { getInput } from '@actions/core'
import semver from 'semver'
export interface Inputs {
  version: string | null
  venv: string | null
}

export function getInputs(): Inputs {
  return {
    version: getVersionInput('uv-version'),
    venv: getVenvInput('uv-venv')
  }
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

export function getVenvInput(name: string): string | null {
  const venv = getInput(name)
  if (!venv) {
    return null
  }
  return venv.trim()
}
