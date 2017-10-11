import fs from 'fs'
import request from 'request'
import uglifyjs from 'uglify-js'
import { isRemoteUrl, getRealPath } from '../utils/misc'

const compressor = (element, actions, content) => {
  const src = typeof content === 'undefined' ? element.html() : content

  let dist = src
  if (actions.indexOf('compress') > -1) {
    let { error, code } = uglifyjs.minify(src)
    if (error) {
      console.error(error)
      process.exit(1)
    }
    else {
      dist = code
    }
  }

  // don't use `element.html(dist)`, the dist will be encode if it has `<` or `>`
  element.replaceWith(`<script>${dist}</script>`)
}

const processor = (element, actions, options) => {
  // if need remove
  if (actions.indexOf('remove') > -1) {
    element.remove()
    return Promise.resolve(true)
  }

  const src = element.attr('src')
  if (src && actions.indexOf('inline') > -1) {
    const url = getRealPath(src, options.source)

    if (isRemoteUrl(url)) {
      return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            compressor(element, actions, body)
            resolve(true)
          }
          else {
            console.error(`Download ${url} failed.`)
            reject(error)
          }
        })
      })
    }

    const content = fs.readFileSync(url, 'utf8')
    compressor(element, actions, content)
  }
  else if (actions.indexOf('compress') > -1) {
    compressor(element, actions)
  }

  return Promise.resolve(true)
}

export default processor
