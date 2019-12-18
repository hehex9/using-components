const { fixture } = require('./util')
const { findComponent } = require('../lib/components')

const fixtureHome = fixture('pages/home/home.wxml')
const fixtureProfile = fixture('pages/profile/profile.wxml')
const globalPath = fixture()

describe('find components', () => {
  test('find child component', async () => {
    let r = await findComponent(fixtureHome, 'c-not-found')
    expect(r).toBe(null)

    r = await findComponent(fixtureHome, 'c-two', { globalPath })
    expect(r).toBe('components/c-two/c-two')

    r = await findComponent(fixtureHome, 'c-three', { globalPath })
    expect(r).toBe('/components/c-three/index')
  })

  test('find nearest component', async () => {
    let r = await findComponent(fixtureProfile, 'c-two', { globalPath })
    expect(r).toBe('/components/c-two/c-two')
  })
})

describe('find components with options', () => {
  const file = fixture('pages/profile/profile.axml')

  test('find axml component', async () => {
    let r = await findComponent(file, 'c-axml-one', { globalPath, ext: 'axml' })
    expect(r).toBe('/components/c-axml-one/index')
  })

  test('find component from custom components', async () => {
    let r = await findComponent(file, 'cc-one', {
      globalPath,
      dirname: 'custom-components',
    })
    expect(r).toBe('/custom-components/cc-one/cc-one')

    r = await findComponent(file, 'cc-inner', {
      globalPath,
      dirname: 'custom-components',
    })
    expect(r).toBe('custom-components/cc-inner/index')
  })
})
