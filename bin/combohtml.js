#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')
const combohtml = require('..')

program
  .version(pkg.version)
  .description('Inline your HTML files.')
  .option('-i, --input <input>', 'Input file(s)')
  .option('-o, --output <output>', 'Output directory or file name')
  .option('-r, --root [root]', 'Files root path, default to current working directory (process.cwd())')
  .option('-a, --attr [attr]', 'Specified attribute, default to "data-combohtml"')
  .parse(process.argv)

const options = {
  input: program.input,
  output: program.output,
  root: program.root || process.cwd(),
  attr: program.attr,
}
combohtml(options)
