const { fixture } = require('./util')
const { findComponent } = require('../lib/components')

const fixtureHome = fixture('pages/home/home.wxml')
const fixtureProfile = fixture('pages/profile/profile.wxml')
const globalPath = fixture()

test('find child component', async () => {
  await findComponent(fixtureHome, 'c-not-found').then(r =>
    expect(r).toBe(null)
  )

  await findComponent(fixtureHome, 'c-two', { globalPath }).then(r =>
    expect(r).toBe('components/c-two/c-two')
  )

  await findComponent(fixtureHome, 'c-three', { globalPath }).then(r =>
    expect(r).toBe('/components/c-three/index')
  )
})

test('find nearest component', async () => {
  await findComponent(fixtureProfile, 'c-two', { globalPath }).then(r =>
    expect(r).toBe('/components/c-two/c-two')
  )
})

test('find axml component', async () => {
  const file = fixture('pages/profile/profile.axml')
  await findComponent(file, 'c-axml-one', { globalPath, ext: 'axml' }).then(r =>
    expect(r).toBe('/components/c-axml-one/index')
  )
})
