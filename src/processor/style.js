import csso from 'csso'

const processor = (element, actions) => {
  // if need remove
  if (actions.indexOf('remove') > -1) {
    element.remove()
    return Promise.resolve(true)
  }

  if (actions.indexOf('compress') > -1) {
    // XXX: only `.html()` can get style textContent, but not `.text()`
    const src = element.html()
    const dist = csso.minify(src).css
    element.replaceWith(`<style>${dist}</style>`)
  }

  return Promise.resolve(true)
}

export default processor
