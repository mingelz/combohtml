import fs from 'fs'
import request from 'request'
import CleanCSS from 'clean-css'
import { fatal, isRemoteUrl, getRealPath } from '../utils'

const cleanCSS = new CleanCSS({
  inline: ['local'],
})

const compressor = (element) => {
  const source = element.html()
  if (source) {
    const { errors, styles } = cleanCSS.minify(source)
    if (errors) {
      fatal(errors)
    }
    else {
      // don't use `element.html(dist)`, the dist will be encode if it has `<` or `>`
      element.replaceWith(`<style>${styles}</style>`)
    }
  }

  return true
}

const processor = (element, actions, options) => {
  const entry = Promise.resolve()

  if (element.attr('rel') !== 'stylesheet') {
    return entry
  }

  return entry
    .then(() => {
      const src = element.attr('href')
      if (src && actions.indexOf('inline') > -1) {
        const url = getRealPath(src, options.root)
        if (isRemoteUrl(url)) {
          return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
              if (!error && response.statusCode === 200) {
                element.replaceWith(`<style>${body}</style>`)
                resolve(true)
              }
              else {
                reject(error)
              }
            })
          })
        }

        const source = fs.readFileSync(url, 'utf8')
        element.replaceWith(`<style>${source}</style>`)
      }

      return true
    })
    .then(() => {
      if (actions.indexOf('compress') > -1) {
        return compressor(element)
      }
      return true
    })
}

export default processor
