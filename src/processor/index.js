import cheerio from 'cheerio'
import scriptProcessor from './script'
import linkProcessor from './link'
import styleProcessor from './style'
import htmlProcessor from './html'

const methods = {
  script: scriptProcessor,
  link: linkProcessor,
  style: styleProcessor,
}

const bridge = (html, options) => {
  const { attr } = options
  const $ = cheerio.load(html, { decodeEntities: false })
  const elements = $(`[${attr}]`)

  const assetElements = []
  const generalElements = []
  for (let i = 0; i < elements.length; i += 1) {
    const element = elements.eq(i)
    const { tagName } = elements.get(i)
    const method = methods[tagName]
    const actions = element.attr(attr).split(',').map(v => v.trim())

    element.removeAttr(attr)

    // hoist asset tags
    if (method) {
      assetElements.push({ element, method, actions })
    }
    else {
      generalElements.push({ element, method: htmlProcessor, actions })
    }
  }

  const queue = []
    .concat(assetElements, generalElements.reverse())
    .map(({ element, method, actions }) => method(element, actions, options, $))

  return Promise.all(queue)
    .then(() => $.html())
    .catch((error) => {
      console.error(error)
    })
}

export default bridge
