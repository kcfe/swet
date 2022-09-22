import {
  isChinese,
  isFunction,
  isNull,
  isPromise,
  isTypeOf,
  isUndefined,
  transformPropertyToCode,
} from '../src/utils'

describe('replenish test', () => {
  it('test isTypeof', () => {
    expect(isTypeOf('', '')).toBe(false)
    expect(isTypeOf(null, 'null')).toBeTruthy()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
    expect(isTypeOf(null, (() => {}) as any)).toBe(false)
  })

  it('test isUndefined', () => {
    expect(isUndefined(undefined)).toBe(true)
    expect(isUndefined(null)).toBe(false)
  })

  it('test isNull', () => {
    expect(isNull(undefined)).toBe(false)
    expect(isNull(null)).toBe(true)
  })

  it('test isFunction', () => {
    expect(isFunction({})).toBe(false)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isFunction(() => {})).toBe(true)
  })

  it('test isPromise', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isPromise(() => {})).toBe(false)
    expect(isPromise(Promise.resolve())).toBe(true)
  })

  it('test isChinese', () => {
    expect(isChinese('123213')).toBe(false)
    expect(isChinese('章三')).toBe(true)
    expect(isChinese('章1231三')).toBe(true)
  })

  it('test transformPropertyToCode', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(transformPropertyToCode({} as any, 'model')).toBe('any')
  })
})
