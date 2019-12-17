const fs = require('fs')
const util = require('util')
const { join } = require('path')
const glob = require('fast-glob')
const { usingComponents, globalComponents } = require('./main')
const { findExists, shallowEqual, getArg } = require('./helpers')

/**
 * @param {string[]} argv
 */
exports.run = async function run(argv) {
  const write = argv.includes('--write')
  const paths = argv.filter(i => !i.startsWith('-'))

  if (argv.includes('--version') || argv.includes('-v')) {
    console.log(require('../package.json').version)
    return
  }

  if (paths.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    console.log(`
Usage: using-components [dir1] [dir2] [options]

Options:
  --version, -v   Show version
  --help, -h      Show help
  --write         Edit json files in-place
  --ext           Extension of XML file
                  Defaults to wxml
    `)
    return
  }

  const cwd = process.cwd()
  const globalPath = await findExists([
    [join(cwd, 'components'), cwd],
    [join(cwd, 'src', 'components'), join(cwd, 'src')],
  ])

  if (!globalPath) {
    // error
    return
  }

  const ext = getArg(argv, 'ext')
  const files = await glob(
    paths.map(i => (i.includes('*') ? i : `${i}/**/*.${ext}`))
  )
  const globals = await globalComponents(globalPath)
  const list = await Promise.all(
    files.map(file =>
      usingComponents(file, {
        ext,
        globalPath,
        globalComponents: globals,
      }).then(r => (Object.keys(r).length === 0 ? null : { [file]: r }))
    )
  )

  const map = list.filter(Boolean).reduce((r, i) => ({ ...r, ...i }), {})

  if (!write) {
    console.log(map)
    return
  }

  const affected = await writeToJson(map)
  console.log('affected:', affected, affected > 1 ? 'files' : 'file')
}

const exists = util.promisify(fs.exists)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

/**
 * @param {Object.<string, object>} map
 * @returns {Promise<number>}
 */
async function writeToJson(map) {
  let affected = 0

  for (let wxml of Object.keys(map)) {
    let json = {}
    const jsonPath = wxml.replace(/\.wxml$/, '.json')

    if (await exists(jsonPath)) {
      json = JSON.parse(String(await readFile(jsonPath, 'utf8')))
    }

    // usingComponents
    const usingComponents = { ...map[wxml], ...json.usingComponents }

    if (shallowEqual(usingComponents, json.usingComponents)) {
      continue
    }

    affected += 1
    json.usingComponents = usingComponents
    await writeFile(jsonPath, JSON.stringify(json, null, 2).concat('\n'))
  }

  return affected
}
