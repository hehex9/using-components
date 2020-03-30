const { join, dirname, relative } = require('path')
const findUp = require('find-up')
const { findExists } = require('./helpers')

/**
 * @typedef {object} FindOption
 * @prop {string} [ext='wxml']
 * @prop {string} [dirname]
 * @prop {string} [root]
 */

/**
 * Find nearest component based on tag name
 *
 * @param {string} xml
 * @param {string} tagName
 * @param {FindOption=} options
 * @returns {Promise<string>}
 */
async function findComponent(xml, tagName, options = {}) {
  const defaultName = options.dirname || 'components'
  const ext = options.ext || 'wxml'

  const components = await findUp(
    async (dir) => {
      const path = join(dir, defaultName, tagName)
      const hit = await findUp.exists(path)

      if (!hit && dir === options.root) {
        return findUp.stop
      }

      return hit && dir
    },
    { cwd: dirname(xml), type: 'directory' }
  )

  if (!components) {
    return null
  }

  const rootPath = join(components, defaultName, tagName)

  // choose `the` file (only support tagName.ext/index.ext)
  const path = await findExists([
    [join(rootPath, `${tagName}.${ext}`), join(rootPath, tagName)],
    [join(rootPath, `index.${ext}`), join(rootPath, 'index')],
  ])

  if (!path) {
    return null
  }

  // root components
  if (components === options.root) {
    return `/${relative(options.root, path)}`
  }

  return relative(dirname(xml), path)
}

/**
 * @param {string} cwd
 * @returns {Promise<string[]>}
 */
async function globalComponents(cwd) {
  const appJson = await findUp('app.json', { cwd })
  if (appJson) {
    // eslint-disable-next-line import/no-dynamic-require
    const json = require(appJson)
    return Object.keys(json.usingComponents || {})
  }

  return []
}

exports.findComponent = findComponent
exports.globalComponents = globalComponents
