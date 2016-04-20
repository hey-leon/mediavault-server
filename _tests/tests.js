import assert from 'assert'

describe('String#split', function () {
  it('should return an array', function () {
    assert(Array.isArray('a,b,c'.split(',')))
  })
})
