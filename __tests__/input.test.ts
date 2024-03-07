import { getInputs, getVenvInput, getVersionInput } from '../src/inputs'

const TEST_ENV_VARS = {
  INPUT_MISSING: '',
  INPUT_FALSY: 'false',
  INPUT_TRUTHY: 'true',
  INPUT_VERSION_UNSUPPORTED: '0.0.3',
  INPUT_VERSION_SUPPORTED: '0.1.2',

  'INPUT_UV-VERSION': '0.1.2',
  'INPUT_UV-VENV': 'my_venv'
}

describe('options', () => {
  beforeEach(() => {
    for (const key in TEST_ENV_VARS) {
      process.env[key] = TEST_ENV_VARS[key as keyof typeof TEST_ENV_VARS]
    }
  })

  afterEach(() => {
    for (const key in TEST_ENV_VARS) {
      Reflect.deleteProperty(TEST_ENV_VARS, key)
    }
  })

  it('getVersionInput returns null if input is missing', () => {
    expect(getVersionInput('missing')).toBeNull()
  })

  it('getInputs returns inputs', () => {
    expect(getInputs()).toStrictEqual({
      version: '0.1.2',
      venv: 'my_venv'
    })
  })

  it('getVersionInput throws if input is not valid', () => {
    expect(() => getVersionInput('falsy')).toThrow(
      "Passed uv version 'false' is not a valid"
    )
  })

  it('getVersionInput returns version if input is supported', () => {
    expect(getVersionInput('version_supported')).toBe('0.1.2')
  })

  it('getVenvInput returns venv name if input is valid', () => {
    expect(getVenvInput('uv-venv')).toBe('my_venv')
  })

  it('getVenvInput returns null if input is not provided', () => {
    expect(getVenvInput('SOMETHING')).toBeNull()
  })
})
