const cheerio = require('cheerio')
const scriptProcessor = require('./script')
const linkProcessor = require('./link')
const styleProcessor = require('./style')

const methods = {
  script: scriptProcessor,
  link: linkProcessor,
  style: styleProcessor,
}

const bridge = (html, options) => {
  const { attr } = options
  const $ = cheerio.load(html, { decodeEntities: true })
  const elements = $(`[${attr}]`)

  const queue = []
  for (let i = 0; i < elements.length; i += 1) {
    const element = elements.eq(i)
    const tagName = elements[i].name
    const method = methods[tagName]
    if (method) {
      const actions = element.attr(attr).split(',').map(v => v.trim())
      element.removeAttr(attr)
      queue.push(method(element, actions, options))
    }
    else {
      queue.push(Promise.resolve(true))
    }
  }

  return Promise.all(queue)
    .then(() => $.html())
    .catch((error) => {
      console.error(error)
    })
}

module.exports = bridge
