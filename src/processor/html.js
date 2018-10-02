import htmlminifier from 'html-minifier'

const compressor = (element, $) => {
  const source = $.html(element)
  const dist = htmlminifier.minify(source, {
    collapseInlineTagWhitespace: false,
    collapseWhitespace: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  })
  element.replaceWith(dist)
  return true
}

const processor = (element, actions, options, $) => Promise.resolve()
  .then(() => {
    if (actions.indexOf('compress') > -1) {
      return compressor(element, $)
    }
    return true
  })

export default processor
