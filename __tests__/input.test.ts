import { getBooleanInput, getInputs, getVersionInput } from '../src/inputs'

const TEST_ENV_VARS = {
  INPUT_MISSING: '',
  INPUT_FALSY: 'false',
  INPUT_TRUTHY: 'true',
  INPUT_VERSION_UNSUPPORTED: '0.0.3',
  INPUT_VERSION_SUPPORTED: '0.1.2',
  INPUT_VERSION_ALPHA: '0.1.3.0a1',

  'INPUT_UV-PREVIEW': 'true',
  'INPUT_UV-VERSION': '0.1.2'
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

  it('getBooleanInput returns false if input is missing', () => {
    expect(getBooleanInput('missing')).toBeFalsy()
  })

  it('getBooleanInput returns false if input is falsy', () => {
    expect(getBooleanInput('falsy')).toBeFalsy()
  })

  it('getBooleanInput returns true if input is truthy', () => {
    expect(getBooleanInput('truthy')).toBeTruthy()
  })

  it('getVersionInput returns null if input is missing', () => {
    expect(getVersionInput('missing')).toBeNull()
  })

  it('getInputs returns inputs', () => {
    expect(getInputs()).toStrictEqual({ preview: true, version: '0.1.2' })
  })

  it('getVersionInput throws if input is not valid', () => {
    expect(() => getVersionInput('falsy')).toThrow(
      "Passed uv version 'false' is not a valid"
    )
  })

  it('getVersionInput returns version if input is supported', () => {
    expect(getVersionInput('version_supported')).toBe('0.1.2')
  })

  it('getVersionInput returns version if input is alpha', () => {
    expect(getVersionInput('version_alpha')).toBe('0.1.3.0a1')
  })
})
