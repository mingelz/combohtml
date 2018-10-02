import fs from 'fs'
import request from 'request'
import uglifyjs from 'uglify-js'
import { fatal, isRemoteUrl, getRealPath } from '../utils'

const compressor = (element) => {
  const source = element.html()
  if (source) {
    const { error, code } = uglifyjs.minify(source)
    if (error) {
      fatal(error)
    }
    else {
      // don't use `element.html(dist)`, the inner code will be encode if it has `<` or `>`
      element.replaceWith(`<script>${code}</script>`)
    }
  }

  return true
}

const processor = (element, actions, options) => Promise.resolve()
  .then(() => {
    const src = element.attr('src')
    if (src && actions.indexOf('inline') > -1) {
      const url = getRealPath(src, options.root)
      if (isRemoteUrl(url)) {
        return new Promise((resolve, reject) => {
          request(url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
              element.replaceWith(`<script>${body}</script>`)
              resolve(true)
            }
            else {
              reject(error)
            }
          })
        })
      }

      const source = fs.readFileSync(url, 'utf8')
      element.replaceWith(`<script>${source}</script>`)
    }

    return true
  })
  .then(() => {
    if (actions.indexOf('compress') > -1) {
      return compressor(element)
    }
    return true
  })

export default processor
