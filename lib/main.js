const fs = require('fs')
const util = require('util')
const { findComponent, globalComponents } = require('./components')
const { customWxmlTags } = require('./tags')

const readFile = util.promisify(fs.readFile)

/**
 * @typedef {object} Options
 * @prop {string} [ext='wxml']
 * @prop {string} [globalPath]
 * @prop {string[]} [globalComponents]
 */

/**
 * @param {string} path
 * @param {Options} options
 * @returns {Promise<Object.<string, string>>}
 */
async function usingComponents(path, options = {}) {
  const fileContent = String(await readFile(path, 'utf8'))
  const tags = await customWxmlTags(fileContent)

  const globals = options.globalComponents || []
  const customTags = globals ? tags.filter(i => !globals.includes(i)) : tags

  /** @type {[string, string][]} */
  const result = await Promise.all(
    customTags.map(tag => findComponent(path, tag, options).then(r => [tag, r]))
  )

  return result.reduce((r, i) => ({ ...r, [i[0]]: i[1] }), {})
}

exports.usingComponents = usingComponents
exports.customWxmlTags = customWxmlTags
exports.findComponent = findComponent
exports.globalComponents = globalComponents
