import {
  getInputs,
  getVenvInput,
  getVersionInput,
  getCacheInput,
  isCacheAllowed
} from '../src/inputs'
import * as core from '@actions/core'

jest.mock('@actions/core')

const mockedCore = core as jest.Mocked<typeof core>

const TEST_ENV_VARS = {
  INPUT_MISSING: '',
  INPUT_FALSY: 'false',
  INPUT_TRUTHY: 'true',
  INPUT_VERSION_UNSUPPORTED: '0.0.3',
  INPUT_VERSION_SUPPORTED: '0.1.2',
  INPUT_VERSION_CACHE_SUPPORTED: '0.3.0',
  INPUT_VERSION_LATEST: 'latest',
  'INPUT_UV-VERSION': '0.1.2',
  'INPUT_UV-VENV': 'my_venv',
  'INPUT_UV-CACHE': 'true'
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

  it('getVersionInput throws if input is not valid', () => {
    mockedCore.getInput.mockReturnValue('false')
    expect(() => getVersionInput('falsy')).toThrow(
      "Passed uv version 'false' is not valid"
    )
  })

  it('getVersionInput warns if version is unsupported', () => {
    mockedCore.getInput.mockReturnValue('0.2.9')
    expect(getVersionInput('version_unsupported')).toBe('0.2.9')
    expect(mockedCore.warning).toHaveBeenCalledWith(
      "Passed uv version '0.2.9' is less than 0.3.0. Caching will be disabled."
    )
    expect(mockedCore.warning).toHaveBeenCalledWith(
      'Using uv version 0.2.9. This may not be the latest version.'
    )
  })

  it('getVersionInput warns for supported version', () => {
    mockedCore.getInput.mockReturnValue('0.3.0')
    expect(getVersionInput('version_supported')).toBe('0.3.0')
    expect(mockedCore.warning).toHaveBeenCalledWith(
      'Using uv version 0.3.0. This may not be the latest version.'
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

  it('getInputs returns inputs including cache', () => {
    mockedCore.getInput.mockImplementation(name => {
      if (name === 'uv-version') {
        return '0.3.0'
      }
      if (name === 'uv-venv') {
        return 'my_venv'
      }
      if (name === 'uv-cache') {
        return 'true'
      }
      return ''
    })
    expect(getInputs()).toStrictEqual({
      version: '0.3.0',
      venv: 'my_venv',
      cache: true
    })
    expect(mockedCore.warning).toHaveBeenCalledWith(
      'Using uv version 0.3.0. This may not be the latest version.'
    )
  })

  it('getCacheInput returns true if input is true and version is supported', () => {
    mockedCore.getInput.mockReturnValue('true')
    expect(getCacheInput('uv-cache', '0.3.0')).toBe(true)
  })

  it('getCacheInput returns false if input is true but version is not supported', () => {
    mockedCore.getInput.mockReturnValue('true')
    expect(getCacheInput('uv-cache', '0.2.9')).toBe(false)
    expect(mockedCore.warning).toHaveBeenCalledWith(
      'Cache requested but uv version is less than 0.3.0. Caching will be disabled.'
    )
  })

  it('getCacheInput returns false if input is false', () => {
    mockedCore.getInput.mockReturnValue('false')
    expect(getCacheInput('uv-cache', '0.3.0')).toBe(false)
  })

  it('getCacheInput returns true if input is true and version is null (latest)', () => {
    mockedCore.getInput.mockReturnValue('true')
    expect(getCacheInput('uv-cache', null)).toBe(true)
  })

  it('isCacheAllowed returns true for supported versions', () => {
    expect(isCacheAllowed('0.3.0')).toBe(true)
    expect(isCacheAllowed('0.4.0')).toBe(true)
    expect(isCacheAllowed(null)).toBe(true) // null represents latest version
  })

  it('isCacheAllowed returns false for unsupported versions', () => {
    expect(isCacheAllowed('0.2.9')).toBe(false)
    expect(isCacheAllowed('0.1.0')).toBe(false)
  })

  it('getCacheInput returns false if cache is not requested, even if version is supported', () => {
    mockedCore.getInput.mockReturnValue('false')
    expect(getCacheInput('uv-cache', '0.3.0')).toBe(false)
  })

  it('getInputs returns cache as false when cache is not requested, even if version is supported', () => {
    mockedCore.getInput.mockImplementation(name => {
      if (name === 'uv-version') {
        return '0.3.0'
      }
      if (name === 'uv-venv') {
        return 'my_venv'
      }
      if (name === 'uv-cache') {
        return 'false'
      }
      return ''
    })
    expect(getInputs()).toStrictEqual({
      version: '0.3.0',
      venv: 'my_venv',
      cache: false
    })
    expect(mockedCore.warning).toHaveBeenCalledWith(
      'Using uv version 0.3.0. This may not be the latest version.'
    )
  })
})
