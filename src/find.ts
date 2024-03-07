import { addPath } from '@actions/core'
import { exec } from '@actions/exec'
import { mv } from '@actions/io'
import { downloadTool } from '@actions/tool-cache'
import os from 'os'
import path from 'path'

const UV_UNIX_LATEST_URL = 'https://astral.sh/uv/install.sh'

const UV_WIN_LATEST_URL = 'https://astral.sh/uv/install.ps1'

export async function findUv(version: string | null): Promise<void> {
  const installScriptUrl = getInstallScriptUrl(version)
  const uvInstallPath = await downloadTool(installScriptUrl)
  await installUv(os.platform(), uvInstallPath)
  // Add uv executable to the PATH
  const uvPath = path.join(os.homedir(), ...getUvPathArgs())
  addPath(uvPath)
}

function getInstallScriptUrl(version: string | null): string {
  let installScript: string
  if (os.platform() === 'win32') {
    installScript =
      version == null
        ? UV_WIN_LATEST_URL
        : `https://github.com/astral-sh/uv/releases/download/${version}/uv-installer.ps1`
  } else {
    installScript =
      version == null
        ? UV_UNIX_LATEST_URL
        : `https://github.com/astral-sh/uv/releases/download/${version}/uv-installer.sh`
  }
  return installScript
}

async function installUv(
  platform: string,
  uvInstallPath: string
): Promise<number> {
  if (platform === 'win32') {
    await mv(uvInstallPath, uvInstallPath + '.ps1')
    return await exec('powershell', ['-File', `${uvInstallPath}.ps1`])
  } else {
    return await exec('sh', [uvInstallPath])
  }
}

function getUvPathArgs(): string[] {
  if (os.platform() === 'win32') {
    return ['AppData', 'Roaming', 'uv']
  }
  return ['.local', 'bin']
}
