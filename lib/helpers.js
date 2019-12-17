const fs = require('fs')
const util = require('util')

/**
 * @param {*} o1
 * @param {*} o2
 * @returns {boolean}
 */
function shallowEqual(o1, o2) {
  if (typeof o1 !== 'object' || typeof o2 !== 'object') {
    return Object.is(o1, o2)
  }

  if (o1 === null || o2 === null) {
    return o1 === o2
  }

  const props1 = Object.getOwnPropertyNames(o1)
  const props2 = Object.getOwnPropertyNames(o2)

  if (props1.length !== props2.length) {
    return false
  }

  for (const name of props1) {
    if (props2.indexOf(name) === -1) {
      return false
    }

    if (!Object.is(o1[name], o2[name])) {
      return false
    }
  }

  return true
}

/**
 * @param {string[]} argv
 * @param {string} name
 * @returns {*}
 */
function getArg(argv, name) {
  if (!Array.isArray(argv) || !name) {
    return null
  }

  const idx = argv.indexOf(name.startsWith('-') ? name : `--${name}`)
  if (idx === -1) {
    return null
  }

  const next = argv[idx + 1]
  if (!next) {
    return null
  }

  if (next.startsWith('-')) {
    return null
  }

  return next
}

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

exports.shallowEqual = shallowEqual
exports.getArg = getArg
exports.findExists = findExists
