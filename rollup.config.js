import buble from 'rollup-plugin-buble'

const config = {
  input: 'src/index.js',
  output: [
    { file: 'dist/combohtml.js', format: 'cjs' },
    { file: 'dist/combohtml.esm.js', format: 'es' },
  ],
  plugins: [
    buble({
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
    'csso',
    'uglify-js',
    'mkdirp',
  ],
}

export default config
