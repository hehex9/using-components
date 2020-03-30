const htmlparser = require('htmlparser2')
const isMinaTag = require('is-mina-tag')

/**
 * @param {string} content
 * @param {{ blacklist?: string[], filter?: Function }} [arg2={blacklist: []}]
 * @returns {Promise<string[]>}
 */
function readTags(content, { blacklist, filter } = { blacklist: [] }) {
  const set = new Set()
  const blackSet = new Set(blacklist)

  const filterFn = (t) => !blackSet.has(t) && (filter ? filter(t) : true)

  return new Promise((resolve, reject) => {
    const parser = new htmlparser.Parser({
      onopentagname(tag) {
        if (filterFn(tag)) {
          set.add(tag)
        }
      },

      onend() {
        resolve([...set])
      },

      onerror: reject,
    })
    parser.write(content)
    parser.end()
  })
}

function isNotMinaTag(t) {
  return !isMinaTag(t)
}

function customWxmlTags(content) {
  return readTags(content, { filter: isNotMinaTag })
}

exports.readTags = readTags
exports.customWxmlTags = customWxmlTags
