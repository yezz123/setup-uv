import { addPath } from '@actions/core'
import { exec } from '@actions/exec'
import { downloadTool } from '@actions/tool-cache'
import { Inputs } from './inputs'
import os from 'os'
import path from 'path'

const GET_UV_URL_OS = 'https://astral.sh/uv/install.sh'
const GET_UV_URL_WIN = 'https://astral.sh/uv/install.ps1'

export async function findUv(inputs: Inputs): Promise<void> {
  let installScript: string
  if (os.platform() === 'win32') {
    installScript = GET_UV_URL_WIN
  } else {
    installScript = GET_UV_URL_OS
  }

  // Download uv installation script
  const uvInstallPath = await downloadTool(installScript)

  // Run uv installation script
  if (os.platform() === 'win32') {
    await exec('powershell', [uvInstallPath])
  } else {
    await exec('sh', [uvInstallPath])
  }

  // Add uv executable to the PATH
  const uvPath = path.join(os.homedir(), ...getUvPathArgs())
  addPath(uvPath)
}

function getUvPathArgs(): string[] {
  switch (os.platform()) {
    case 'win32':
      return ['AppData', 'Roaming', 'uv']
    default:
      return ['.local', 'bin']
  }
}
