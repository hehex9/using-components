const { join, dirname, relative } = require('path')
const findUp = require('find-up')
const pkgDir = require('pkg-dir').sync()

/**
 * @typedef {object} FindOption
 * @prop {string} globalPath
 * @prop {string} dirname
 * @prop {string} root
 */

/**
 * Find nearest component based on tag name
 *
 * @param {string} wxml
 * @param {string} tagName
 * @param {FindOption=} options
 * @returns {Promise<string>}
 */
async function findComponent(wxml, tagName, options = {}) {
  const defaultPath = options.globalPath || join(pkgDir, 'src') // TODO
  const defaultName = options.dirname || 'components'
  const root = options.root || pkgDir

  const components = await findUp(
    async dir => {
      const path = join(dir, defaultName, tagName)
      const hit = await findUp.exists(path)

      if (!hit && dir === root) {
        return findUp.stop
      }

      return hit && dir
    },
    { cwd: dirname(wxml), type: 'directory' }
  )

  if (!components) {
    return null
  }

  // TODO: handle index.wxml style
  const path = join(components, defaultName, tagName, `${tagName}`)

  // root components
  if (components === defaultPath) {
    return `/${relative(defaultPath, path)}`
  }

  return relative(dirname(wxml), path)
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

exports.findComponent = findComponent
exports.globalComponents = globalComponents
