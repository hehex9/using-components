const { fixture } = require('./util')
const { usingComponents } = require('../lib/main')
const { globalComponents } = require('../lib/components')

const root = fixture()

test('using components (c-one)', async () => {
  const path = fixture('components/c-one/c-one.wxml')
  const result = await usingComponents(path, {
    root,
    globalComponents: await globalComponents(path),
  })

  expect(result).toEqual({ 'c-two': '/components/c-two/c-two' })
})

test('using components (home)', async () => {
  const path = fixture('pages/home/home.wxml')
  const result = await usingComponents(path, {
    root,
    globalComponents: await globalComponents(path),
  })

  expect(result).toEqual({
    'c-one': '/components/c-one/c-one',
    'c-two': 'components/c-two/c-two',
  })
})

test('using components (profile)', async () => {
  const path = fixture('pages/profile/profile.wxml')
  const result = await usingComponents(path, {
    root,
    globalComponents: await globalComponents(path),
  })

  expect(result).toEqual({ 'c-two': '/components/c-two/c-two' })
})

test('using components (profile.axml)', async () => {
  const path = fixture('pages/profile/profile.axml')
  const result = await usingComponents(path, {
    ext: 'axml',
    root,
    globalComponents: [],
  })

  expect(result).toEqual({ 'c-axml-one': '/components/c-axml-one/index' })
})
