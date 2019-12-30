const fs = require('fs')
const path = require('path')

/**
 * @param {string} name
 * @returns {string}
 */
const fixture = name => path.join(__dirname, 'fixtures', name || '')

/**
 * @param {string} name
 * @returns {string}
 */
const fixtureContent = name => fs.readFileSync(fixture(name)).toString()

module.exports = { fixture, fixtureContent }
