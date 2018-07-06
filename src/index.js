import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import processor from './processor/index'
import getFiles from './utils/get-files'

const processOne = (options) => {
  const { source, target } = options
  const data = fs.readFileSync(source, 'utf8')
  return processor(data, options)
    .then((result) => {
      const pathname = path.dirname(target)
      if (!fs.existsSync(pathname)) {
        mkdirp.sync(pathname, '0755')
      }
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
    console.error('no file to process.')
    process.exit(1)
  }

  const orders = files.map(file => processOne({ ...config, ...file }))
  return Promise.all(orders)
}

export default combohtml
