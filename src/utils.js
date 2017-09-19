const path = require('path')

const URL_REGEXP = /^(?:\s*)(https?:)?\/\//i

module.exports = {
  // detect a remote path
  isRemoteUrl (url) {
    return URL_REGEXP.test(url)
  },

  // get real path for remote url or local path
  getRealPath (src, host) {
    const match = src.match(URL_REGEXP)
    if (match) {
      return match[1] ? src : `http:${src}`
    }

    return path.resolve(path.dirname(host), src)
  },
}
