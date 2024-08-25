import { getInputs, getVenvInput, getVersionInput } from '../src/inputs'
import * as core from '@actions/core'

jest.mock('@actions/core')

const mockedCore = core as jest.Mocked<typeof core>

const TEST_ENV_VARS = {
  INPUT_MISSING: '',
  INPUT_FALSY: 'false',
  INPUT_TRUTHY: 'true',
  INPUT_VERSION_UNSUPPORTED: '0.0.3',
  INPUT_VERSION_SUPPORTED: '0.1.2',
  INPUT_VERSION_LATEST: 'latest',
  'INPUT_UV-VERSION': '0.1.2',
  'INPUT_UV-VENV': 'my_venv'
}

describe('options', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    for (const key in TEST_ENV_VARS) {
      process.env[key] = TEST_ENV_VARS[key as keyof typeof TEST_ENV_VARS]
    }
  })

  afterEach(() => {
    for (const key in TEST_ENV_VARS) {
      delete process.env[key]
    }
  })

  it('getVersionInput returns null if input is missing', () => {
    mockedCore.getInput.mockReturnValue('')
    expect(getVersionInput('missing')).toBeNull()
    expect(mockedCore.notice).toHaveBeenCalledWith('Using latest uv version')
  })

  it('getVersionInput returns null if input is "latest"', () => {
    mockedCore.getInput.mockReturnValue('latest')
    expect(getVersionInput('version_latest')).toBeNull()
    expect(mockedCore.notice).toHaveBeenCalledWith('Using latest uv version')
  })

  it('getInputs returns inputs', () => {
    mockedCore.getInput.mockImplementation(name => {
      if (name === 'uv-version') {
        return '0.1.2'
      }
      if (name === 'uv-venv') {
        return 'my_venv'
      }
      return ''
    })
    expect(getInputs()).toStrictEqual({
      version: '0.1.2',
      venv: 'my_venv'
    })
    expect(mockedCore.warning).toHaveBeenCalledWith(
      'Using uv version 0.1.2. This may not be the latest version.'
    )
  })

  it('getVersionInput throws if input is not valid', () => {
    mockedCore.getInput.mockReturnValue('false')
    expect(() => getVersionInput('falsy')).toThrow(
      "Passed uv version 'false' is not valid"
    )
  })

  it('getVersionInput throws if version is unsupported', () => {
    mockedCore.getInput.mockReturnValue('0.0.3')
    expect(() => getVersionInput('version_unsupported')).toThrow(
      "Passed uv version '0.0.3' is not supported. Please use any other supported version >=0.1.2"
    )
  })

  it('getVersionInput returns version and warns if input is supported', () => {
    mockedCore.getInput.mockReturnValue('0.1.2')
    expect(getVersionInput('version_supported')).toBe('0.1.2')
    expect(mockedCore.warning).toHaveBeenCalledWith(
      'Using uv version 0.1.2. This may not be the latest version.'
    )
  })

  it('getVenvInput returns venv name if input is valid', () => {
    mockedCore.getInput.mockReturnValue('my_venv')
    expect(getVenvInput('uv-venv')).toBe('my_venv')
  })

  it('getVenvInput returns null if input is not provided', () => {
    mockedCore.getInput.mockReturnValue('')
    expect(getVenvInput('SOMETHING')).toBeNull()
  })
})
