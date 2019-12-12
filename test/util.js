const fs = require('fs')
const path = require('path')

const fixture = name => path.join(__dirname, 'fixtures', name || '')
const fixtureContent = name => fs.readFileSync(fixture(name)).toString()


module.exports = { fixture, fixtureContent }
