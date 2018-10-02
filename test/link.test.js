const expect = require('chai').expect
const combohtml = require('..')

describe('<style>', () => {
  describe('no attr', () => {
    it('无属性，不处理', () => {
      const input = '<style>div { color: #ffffff; }</style>'
      expect(combohtml({ input })).to.eql(input)
    })
    it('有属性，无 compress，不处理', () => {
      const input = '<style data-combohtml="">div { color: #ffffff; }</style>'
      expect(combohtml({ input })).to.eql(input)
    })
  })

  describe('compress', () => {
    it('压缩', () => {
      const input = '<style>div { color: #ffffff; }</style>'
      const output = '<style>div{color:#fff}</style>'
      expect(combohtml({ input })).to.eql(output)
    })
  })
})
