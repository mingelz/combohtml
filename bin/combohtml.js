#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')
const combohtml = require('..')

program
  .version(pkg.version)
  .description('Inline your HTML files')
  .option('-i, --input <input>', 'Input file(s)')
  .option('-o, --output <output>', 'Output directory or file name')
  .option('-r, --root [root]', 'Files root path, default to current working directory (process.cwd())')
  .option('-a, --attr [attr]', 'Specified attribute, default to "data-combohtml"')
  .parse(process.argv)

if (!program.input || !program.output) {
  const key = program.input ? 'output' : 'input'
  console.error(`--${key} option is required.`)
  process.exit(1)
}

const options = {
  input: program.input,
  output: program.output,
  root: program.root || process.cwd(),
  attr: program.attr || 'data-combohtml',
}
combohtml(options)
