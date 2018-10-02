import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import processor from './processor/index'
import { fatal } from './utils'

// <<<<<<< Updated upstream:src/index.js
const processOne = (options) => {
  const { source, target } = options
  const data = fs.readFileSync(source, 'utf8')
  return processor(data, options)
// =======
// const combine = (code, options) => {
//   processor(code, options)
// >>>>>>> Stashed changes:src/core.js
    .then((result) => {
      const { output } = options
      if (output) {
        const pathname = path.dirname(output)
        if (!fs.existsSync(pathname)) {
          mkdirp.sync(pathname, '0755')
        }
        fs.writeFileSync(output, result, 'utf8')
      }
      else {
        process.stdout.write(result)
      }
    })
    .catch(fatal)
}

/**
 * @param {Object}      options
 * @param {string}      options.input    input file path or source code
 * @param {string}      [options.output] output file path, (if not specified STDOUT will be used for output)
 * @param {string}      [options.root]   relative path's root, default to file directory or command current directory
 * @param {string}      [options.attr]   specified attribute, default to `data-combohtml`
 */
const combohtml = (options) => {
  // merge default options
  const config = {
    attr: 'data-combohtml',
    ...options,
  }

  const { input, root } = config
  if (!input) {
    fatal('input (a file path or source code) is required!')
  }

  try {
    const stats = fs.statSync(input)
    if (stats.isFile()) {
      const code = fs.readFileSync(input, 'utf8')
      if (!root) {
        config.root = path.dirname(input)
      }
      combine(code, config)
    }
    else {
      fatal(`${input} is not a file path`)
    }
  }
// <<<<<<< Updated upstream:src/index.js

  const orders = files.map(file => processOne({ ...config, ...file }))
  return Promise.all(orders)
// =======
//   catch (e1) {
//     // not a path
//     if (e1.code === 'ENOENT') {
//       try {
//         if (!root) {
//           config.root = __dirname
//         }
//         combine(input, config)
//       }
//       catch (e2) {
//         fatal(`${input} is not a file path or source code`)
//       }
//     }
//     else {
//       fatal(e1)
//     }
//   }
// >>>>>>> Stashed changes:src/core.js
}

export default combohtml
