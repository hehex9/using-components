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

exports.shallowEqual = shallowEqual
