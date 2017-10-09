const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Get source & target filename with options
//
// Examples:
// -i,                -o
//
// src/**/*.html,     dist
// src/**/*.html,     dist/**/*.html
//
// src/**/*.html,     dist/bar.html
// src/**/*.html,     dist/bar.html/**/*.html
//
// src,               dist
// src/**/*.html,     dist/**/*.html
//
// src/foo,           dist
// src/foo/**/*.html, dist/**/*.html
//
// src/foo,           dist/bar
// src/foo/**/*.html, dist/bar/**/*.html
//
// src,               dist/bar.html
// src/**/*.html,     dist/bar.html/**/*.html
//
// src/foo.html,      dist
// src/foo.html,      dist/foo.html
//
// src/foo.html,      dist/bar.html
// src/foo.html,      dist/bar.html

const resolveFiles = ({ input, output, root }) => {
  let $input = input

  // Step 1: format input string
  // if input is a directory, add magical patterns
  if (!glob.hasMagic(input)) {
    const absInput = path.resolve(root, input)

    if (fs.existsSync(absInput)) {
      const fileStat = fs.statSync(absInput)

      if (fileStat.isDirectory()) {
        $input = `${input.replace(/\/$/, '')}/**/*.html`
      }
      else if (!fileStat.isFile()) {
        return { error: `Unsupported input type: "${input}".` }
      }
    }
    else {
      return { error: `Input path: "${input}" is not exists!` }
    }
  }

  // Step 2.1: if $input has magical patterns
  if (glob.hasMagic($input)) {
    // get a path without magical patterns
    let inputPrefix = input
    if (glob.hasMagic(input)) {
      const inputSteps = input.split(path.sep)
      let magicalIndex = -1
      inputSteps.forEach((v, i) => {
        if (/[*/\\]/.test(v) && magicalIndex < 0) {
          magicalIndex = i
        }
      })
      const regularSteps = magicalIndex < 0
        ? inputSteps
        : inputSteps.slice(0, magicalIndex)
      inputPrefix = regularSteps.join(path.sep)
    }

    const files = glob.sync($input, { cwd: root })
      .map((v) => {
        const source = path.resolve(root, v)
        const relPath = path.relative(inputPrefix, v)
        const target = path.resolve(root, output, relPath)
        return { source, target }
      })
    return files
  }

  // Step 2.2: if $input is single file
  const absInput = path.resolve(root, input)
  const absOutput = path.resolve(root, output)
  let target = absOutput
  if (fs.existsSync(absOutput) && fs.statSync(absOutput).isDirectory()) {
    const filename = path.basename($input)
    target = path.resolve(root, output, filename)
  }
  return [{ source: absInput, target }]
}

module.exports = resolveFiles
