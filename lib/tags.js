const htmlparser = require('htmlparser2')

/**
 * @param {string} content
 * @param {string[]=} blacklist
 * @returns {Promise<string[]>}
 */
function readTags(content, blacklist = []) {
  const set = new Set()
  const blackSet = new Set(blacklist)

  return new Promise((resolve, reject) => {
    const parser = new htmlparser.Parser({
      onopentagname(tag) {
        if (!blackSet.has(tag)) {
          set.add(tag)
        }
      },

      onend() {
        resolve(Array.from(set))
      },

      onerror: reject,
    })
    parser.write(content)
    parser.end()
  })
}

const WXML_BUILTIN_TAGS = [
  'cover-image',
  'cover-view',
  'movable-area',
  'movable-view',
  'scroll-view',
  'swiper',
  'swiper-item',
  'view',

  'icon',
  'progress',
  'rich-text',
  'text',

  'button',
  'checkbox',
  'checkbox-group',
  'editor',
  'form',
  'input',
  'label',
  'picker',
  'picker-view',
  'picker-view-column',
  'radio',
  'radio-group',
  'slider',
  'switch',
  'textarea',

  'functional-page-navigator',
  'navigator',

  'audio',
  'camera',
  'image',
  'live-player',
  'live-pusher',
  'video',

  'map',

  'canvas',

  'ad',
  'official-account',
  'open-data',
  'web-view',

  'navigation-bar',

  'page-meta',

  'block',
  'slot',
]

function customWxmlTags(content) {
  return readTags(content, WXML_BUILTIN_TAGS)
}

exports.readTags = readTags
exports.customWxmlTags = customWxmlTags
