import htmlminifier from 'html-minifier'

const processor = (element, actions, options, $) => {
  // if need remove
  if (actions.indexOf('remove') > -1) {
    element.remove()
    return Promise.resolve(true)
  }

  if (actions.indexOf('compress') > -1) {
    const src = $.html(element)
    const dist = htmlminifier.minify(src, {
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
  }

  return Promise.resolve(true)
}

export default processor
