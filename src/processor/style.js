import CleanCSS from 'clean-css'
import { fatal } from '../utils'

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

const processor = (element, actions) => Promise.resolve()
  .then(() => {
    if (actions.indexOf('compress') > -1) {
      return compressor(element)
    }
    return true
  })

export default processor
