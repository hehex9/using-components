/* eslint-disable no-console */
const { join, resolve } = require('path')
const glob = require('fast-glob')
const { usingComponents, globalComponents } = require('./main')
const { findExists, writeToJson, getArg, hasArg } = require('./helpers')

/**
 * @param {string[]} argv
 */
exports.run = async function run(argv) {
  if (hasArg(argv, 'version', 'v')) {
    console.log(require('../package.json').version)
    return
  }

  if (hasArg(argv, 'help', 'h') || argv.every((i) => i.startsWith('-'))) {
    console.log(`
Usage: using-components [dir] [options]

Options:
  --version, -v   Show version
  --help, -h      Show help
  --write         Edit json files in-place
  --dirname       Component directory name
                  Defaults to components
  --ext           Extension of your XML-like files
                  Defaults to wxml
    `)
    return
  }

  // TODO: use commander/yargs?
  let path
  for (const arg of argv) {
    if (arg.startsWith('-')) {
      break
    }

    path = arg
    break
  }

  if (!path) {
    console.log('[ERROR] `directory` is required')
    return
  }

  const cwd = resolve(path)
  const dirname = getArg(argv, 'dirname') || 'components' // components dir name
  const root = (await findExists([[join(cwd, dirname), cwd]])) || process.cwd()
  const ext = getArg(argv, 'ext') || 'wxml'

  const files = await glob(`${path}/**/*.${ext}`)
  const options = {
    ext,
    root,
    dirname,
    globalComponents: await globalComponents(root),
  }

  const list = await Promise.all(
    files.map((file) =>
      usingComponents(file, options).then((r) => ({ [file]: r }))
    )
  )

  const map = list.reduce((r, i) => ({ ...r, ...i }), {})

  // filter out null/empty object
  if (!hasArg(argv, 'write')) {
    Object.keys(map).forEach((k) => {
      if (map[k] && Object.keys(map[k]).length > 0) {
        console.log(k, '=>')
        console.log(map[k])
        console.log()
      }
    })
    return
  }

  const affected = await writeToJson(map, { ext })
  console.log('affected:', affected, affected > 1 ? 'files' : 'file')
}
