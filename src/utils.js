import path from 'path'

// throw error
export const fatal = (message) => {
  console.error(message)
  process.exit(1)
}

const REGEXP_URI = /^\s*(https?:)?\/\//i

// detect a remote path
export const isRemoteUrl = url => REGEXP_URI.test(url)

// get real path for remote url or local path
export const getRealPath = (src, host) => {
  const matched = src.match(REGEXP_URI)
  if (matched) {
    return matched[1] ? src : `http:${src}`
  }

  if (path.isAbsolute(src)) {
    return src
  }

  if (host) {
    return path.resolve(path.dirname(host), src)
  }

  return fatal('need `options.root` to resolve relative path')
}
