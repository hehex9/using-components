const { fixture } = require('./util')
const { findExists, hasArg, getArg, shallowEqual } = require('../lib/helpers')

test('is object equal', () => {
  expect(shallowEqual(null, {})).toBeFalsy()
  expect(shallowEqual(null, null)).toBeTruthy()
  expect(shallowEqual(undefined, undefined)).toBeTruthy()
  expect(shallowEqual(NaN, NaN)).toBeTruthy()

  expect(shallowEqual({}, {})).toBeTruthy()
  expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBeTruthy()
  expect(shallowEqual({ a: 1, b: 2 }, { a: 1 })).toBeFalsy()
  expect(shallowEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBeTruthy()

  // that is what the `shallow` means
  expect(
    shallowEqual({ a: 1, b: { bb: 1 } }, { a: 1, b: { bb: 1 } })
  ).toBeFalsy()
})

test('find exists', async () => {
  /** @type {[string, string][]} */
  const input1 = [
    [fixture('a.wxml'), 'a.wxml'],
    [fixture('404.wxml'), 'notfound.wxml'],
  ]
  expect(await findExists(input1)).toBe('a.wxml')

  const input2 = [fixture('a.wxml'), fixture('404.wxml')]
  expect(await findExists(input2)).toBe(fixture('a.wxml'))
})

describe('cli args helpers', () => {
  const argv = ['--name', 'foo', '--count', '1', '--dry-run']

  test('getArg', () => {
    expect(getArg(argv, 'name')).toBe('foo')
    expect(getArg(argv, '--name')).toBe('foo')

    expect(getArg(argv, 'count')).toBe('1')
    expect(getArg(argv, 'dry-run')).toBeNull()
    expect(getArg(argv, '--dry-run')).toBeNull()
  })

  test('hasArg', () => {
    expect(hasArg(argv, 'name')).toBeTruthy()
    expect(hasArg(argv, 'no')).toBeFalsy()
    expect(hasArg(argv, 'dry-run')).toBeTruthy()
    expect(hasArg(argv, '--name')).toBeTruthy()
    expect(hasArg(argv, '1')).toBeFalsy()
  })
})
