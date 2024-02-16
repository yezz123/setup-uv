import { setFailed } from '@actions/core'
import { findUv } from './find'
import { getInputs } from './inputs'

async function run(): Promise<void> {
  try {
    const inputs = getInputs()

    await findUv(inputs)
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
