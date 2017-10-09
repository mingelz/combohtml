import path from 'path'

const URL_REGEXP = /^\s*(https?:)?\/\//i

// detect a remote path
export const isRemoteUrl = url => URL_REGEXP.test(url)

// get real path for remote url or local path
export const getRealPath = (src, host) => {
  const match = src.match(URL_REGEXP)
  if (match) {
    return match[1] ? src : `http:${src}`
  }

  return path.resolve(path.dirname(host), src)
}
