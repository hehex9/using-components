const { fixture } = require('./util')
const { findComponent } = require('../lib/components')

const fixtureHome = fixture('pages/home/home.wxml')
const fixtureProfile = fixture('pages/profile/profile.wxml')

const cases1 = [
  [[fixtureHome, 'c-not-found'], null],
  [[fixtureHome, 'c-two'], 'components/c-two/c-two'],
]

const cases2 = [
  [
    [fixtureProfile, 'c-two', { globalPath: fixture() }],
    '/components/c-two/c-two',
  ],
]

test('find child component', () => {
  return Promise.all(
    cases1.map(([args, output]) =>
      findComponent(...args).then(r => expect(r).toBe(output))
    )
  )
})

test('find nearest component', () => {
  return Promise.all(
    cases2.map(([args, output]) =>
      findComponent(...args).then(r => expect(r).toBe(output))
    )
  )
})
