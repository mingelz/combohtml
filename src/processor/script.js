const fs = require('fs')
const request = require('request')
const uglifyjs = require('uglify-js')
const { isRemoteUrl, getRealPath } = require('./utils/misc')

const compressor = (element, actions, content) => {
  const src = typeof content === 'undefined' ? element.html() : content
  const dist = actions.indexOf('compress') > -1
    ? uglifyjs.minify(src).code
    : src
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

module.exports = processor
