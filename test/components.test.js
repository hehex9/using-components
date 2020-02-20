const { fixture } = require('./util')
const { findComponent } = require('../lib/components')

const fixtureHome = fixture('pages/home/home.wxml')
const fixtureProfile = fixture('pages/profile/profile.wxml')
const root = fixture()

describe('find components', () => {
  test('find child component', async () => {
    let r = await findComponent(fixtureHome, 'c-not-found')
    expect(r).toBe(null)

    r = await findComponent(fixtureHome, 'c-two', { root })
    expect(r).toBe('components/c-two/c-two')

    r = await findComponent(fixtureHome, 'c-three', { root })
    expect(r).toBe('/components/c-three/index')
  })

  test('find nearest component', async () => {
    const r = await findComponent(fixtureProfile, 'c-two', { root })
    expect(r).toBe('/components/c-two/c-two')
  })
})

describe('find components with options', () => {
  const file = fixture('pages/profile/profile.axml')

  test('find axml component', async () => {
    const r = await findComponent(file, 'c-axml-one', { root, ext: 'axml' })
    expect(r).toBe('/components/c-axml-one/index')
  })

  test('find component from custom components', async () => {
    let r = await findComponent(file, 'cc-one', {
      root,
      dirname: 'custom-components',
    })
    expect(r).toBe('/custom-components/cc-one/cc-one')

    r = await findComponent(file, 'cc-inner', {
      root,
      dirname: 'custom-components',
    })
    expect(r).toBe('custom-components/cc-inner/index')
  })
})
