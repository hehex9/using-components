const { fixtureContent } = require('./util')
const { readTags, customWxmlTags } = require('../lib/tags')

test('get all tags', () => {
  return readTags(fixtureContent('a.wxml')).then(tags => {
    expect(tags).toEqual(['view', 'image', 'custom-view', 'custom-view-two'])
  })
})

test('get custom wxml tags', () => {
  return customWxmlTags(fixtureContent('a.wxml')).then(tags => {
    expect(tags).toEqual(['custom-view', 'custom-view-two'])
  })
})
