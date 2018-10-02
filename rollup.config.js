import buble from 'rollup-plugin-buble'

const baseConfig = {
  plugins: [
    buble({
      target: { node: 4 },
      include: ['src/**'],
      objectAssign: 'Object.assign',
    }),
  ],
  external: [
    // builtin modules
    'fs',
    'path',

    // dependencies
    'glob',
    'cheerio',
    'request',
    'clean-css',
    'uglify-js',
    'html-minifier',
    'mkdirp',
  ],
}

const core = Object.assign({}, baseConfig, {
  input: 'src/core.js',
  output: [
    { file: 'dist/core.js', format: 'cjs' },
    { file: 'dist/core.esm.js', format: 'es' },
  ],
})

const cli = Object.assign({}, baseConfig, {
  input: 'src/cli.js',
  output: [
    { file: 'dist/cli.js', format: 'cjs' },
  ],
  banner: '#!/usr/bin/env node\n',
})

export default [core, cli]
