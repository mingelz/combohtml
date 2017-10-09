const fs = require('fs')
const processor = require('./processor')
const getFiles = require('./utils/get-files')

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
  const { input, output } = config

  if (!input || !output) {
    const key = input ? 'output' : 'input'
    console.error(`${key} is required!`)
    process.exit(1)
  }

  const files = getFiles(config)
  if (files.error) {
    console.error(files.error)
    process.exit(1)
  }
  else if (!files.length) {
    console.error(`no file to process.`)
    process.exit(1)
  }

  for (let i = 0; i < files.length; i++) {
    const { source, target } = files[i]
    processOne({...config, source, target})
  }
}

module.exports = combohtml
