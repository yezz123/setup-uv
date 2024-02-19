import { setFailed } from '@actions/core'
import { findUv } from './find'
import { getInputs } from './inputs'
import { activateVenv, createVenv } from './venv'
import { exec } from '@actions/exec'
async function run(): Promise<void> {
  try {
    const inputs = getInputs()

    await findUv(inputs)
    if (inputs.venv) {
      await createVenv(inputs.venv)
      await activateVenv(inputs.venv)
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
