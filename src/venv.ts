import { exec } from '@actions/exec'
import { exportVariable, addPath } from '@actions/core'
import os from 'os'

export async function createVenv(venv: string) {
  await exec('uv', ['venv', venv])
}

export async function activateVenv(venv: string) {
  if (os.platform() === 'win32') {
    await exec('powershell', [`${venv}\\Scripts\\activate.ps1`])
    addPath(`${venv}/Scripts`)
  } else {
    await exec('/bin/bash', ['-c', `source ${venv}/bin/activate`])
    addPath(`${venv}/bin`)
  }
  exportVariable('VIRTUAL_ENV', venv)
}
