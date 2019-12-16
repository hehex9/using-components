const fs = require('fs')
const util = require('util')
const { join, dirname, relative } = require('path')
const findUp = require('find-up')
const pkgDir = require('pkg-dir').sync()

const exists = util.promisify(fs.exists)

/**
 * @param {[string, string][]} paths
 * @returns {Promise<string>}
 */
async function findExists(paths) {
  if (!Array.isArray(paths)) {
    return null
  }

  for (const [path, ret] of paths) {
    if (await exists(path)) {
      return ret
    }
  }

  return null
}

/**
 * @typedef {object} FindOption
 * @prop {string} [ext='wxml']
 * @prop {string} [globalPath]
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
  const defaultPath = options.globalPath || join(pkgDir, 'src') // TODO
  const defaultName = options.dirname || 'components'
  const root = options.root || pkgDir
  const ext = options.ext || 'wxml'

  const components = await findUp(
    async dir => {
      const path = join(dir, defaultName, tagName)
      const hit = await findUp.exists(path)

      if (!hit && dir === root) {
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
  if (components === defaultPath) {
    return `/${relative(defaultPath, path)}`
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
    const json = require(appJson)
    return Object.keys(json.usingComponents || {})
  }

  return []
}

exports.findExists = findExists
exports.findComponent = findComponent
exports.globalComponents = globalComponents
