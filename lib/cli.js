const fs = require('fs')
const util = require('util')
const { join } = require('path')
const glob = require('fast-glob')
const { usingComponents, globalComponents } = require('./main')
const { findExists } = require('./components')

/**
 * using-components src --write
 */
exports.run = async function run() {
  const argv = process.argv.slice(2)
  const write = argv.includes('--write')

  const paths = argv.filter(i => !i.startsWith('-'))
  if (paths.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    console.log(`
Usage: using-components [dir1] [dir2] [options]

Options:
  --help, -h      Show help
  --write         Edit json files in-place
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

  const files = await glob(
    paths.map(i => (i.includes('*') ? i : `${i}/**/*.wxml`))
  )
  const globals = await globalComponents(globalPath)
  const list = await Promise.all(
    files.map(file =>
      usingComponents(file, {
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

  writeToJson(map)
}

const exists = util.promisify(fs.exists)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

async function writeToJson(map) {
  for (let wxml of Object.keys(map)) {
    let json = {}
    const jsonPath = wxml.replace(/\.wxml$/, '.json')

    if (await exists(jsonPath)) {
      json = JSON.parse(String(await readFile(jsonPath, 'utf8')))
    }

    json.usingComponents = {
      ...map[wxml],
      ...json.usingComponents, // user can override it
    }

    await writeFile(jsonPath, JSON.stringify(json, null, 2).concat('\n'))
  }
}
