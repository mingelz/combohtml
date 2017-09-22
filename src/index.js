const path = require('path')
const fs = require('fs')
const glob = require('glob')
const processor = require('./processor')

const getAbsoluteNames = (input, output, root) => {
  const source = path.resolve(root, input)
  let target = path.resolve(root, output)

  if (path.dirname(target) === target) {
    const filename = path.basename(source)
    target = path.resolve(root, output, filename)
  }

  return { source, target }
}

const processOne = (options) => {
  const { source, target } = options
  const data = fs.readFileSync(source, 'utf8')
  processor(data, options)
    .then((result) => {
      fs.writeFileSync(target, result, 'utf8')
    })
    .catch((error) => {
      // TODO
      console.error('error', error)
    })
}

const combohtml = (options) => {
  const config = {
    attr: 'data-combohtml',
    root: process.cwd(),
    ...options,
  }
  const { input, output, root } = config

  if (!input || !output) {
    const key = input ? 'output' : 'input'
    console.error(`${key} is required!`)
    process.exit(1)
  }

  // a specific file
  if (input.indexOf('*') < 0) {
    const { source, target } = getAbsoluteNames(input, output, root)
    processOne({ source, target, ...config })
  }
  else {
    const files = glob.sync(input, { cwd: root })
    if (files) {
      for (let i = 0; i < files.length; i += 1) {
        const { source, target } = getAbsoluteNames(files[i], output, root)
        processOne({ source, target, ...config })
      }
    }
  }
}

module.exports = combohtml
