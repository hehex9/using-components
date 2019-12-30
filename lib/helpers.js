const fs = require('fs')
const util = require('util')

const exists = util.promisify(fs.exists)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

exports.readFile = readFile
exports.exists = exists

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

/**
 * @param {string[]} argv
 * @returns {boolean}
 */
function hasArg(argv, ...args) {
  return args.some(name => {
    if (!name) {
      return false
    }

    if (name.startsWith('-')) {
      return argv.includes(name)
    }

    return name.length === 1
      ? argv.includes(`-${name}`)
      : argv.includes(`--${name}`)
  })
}

/**
 * @param {[string, string][] | string[]} paths
 * @returns {Promise<string>}
 */
async function findExists(paths) {
  if (!Array.isArray(paths)) {
    return null
  }

  for (const o of paths) {
    if (Array.isArray(o)) {
      if (await exists(o[0])) {
        return o[1] || o[0]
      }
    } else {
      if (await exists(o)) {
        return o
      }
    }
  }

  return null
}

/**
 * @param {string} path
 * @param {Object.<string, string>} result
 * @returns {Promise<boolean>}
 */
async function write(path, result) {
  let json = {}

  if (await exists(path)) {
    json = JSON.parse(String(await readFile(path, 'utf8')))
  }

  // is null if nothing matched it
  if (!result) {
    return false
  }

  const obj = {}
  Object.keys(result).forEach(k => {
    if (result[k]) {
      obj[k] = result[k]
    }
  })

  // empty object
  if (Object.keys(obj).length === 0) {
    return false
  }

  const usingComponents = { ...obj, ...json.usingComponents }
  if (shallowEqual(usingComponents, json.usingComponents)) {
    return false
  }

  json.usingComponents = usingComponents
  await writeFile(path, JSON.stringify(json, null, 2).concat('\n'))
  return true
}

/**
 * @param {Object.<string, object>} map
 * @param {{ ext: string }} [options]
 * @returns {Promise<number>}
 */
async function writeToJson(map, options = { ext: 'wxml' }) {
  let affected = 0

  for (let xml of Object.keys(map)) {
    const path = xml.replace(new RegExp(`.${options.ext}$`), '.json')

    if (await write(path, map[xml])) {
      affected += 1
    }
  }

  return affected
}

exports.getArg = getArg
exports.hasArg = hasArg

exports.findExists = findExists
exports.shallowEqual = shallowEqual

exports.write = write
exports.writeToJson = writeToJson
