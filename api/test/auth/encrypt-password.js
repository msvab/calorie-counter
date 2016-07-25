'use strict'
const expect = require('chai').expect
const password = require('../../src/auth/password')

require('../test-helpers')

describe('encrypt password', () => {
  it('password encrypted with the same salt should always provide the same hash', function* () {
    const input = 'hello'
    const generated = yield password.encryptPassword(input)

    const matches = yield password.verifyPassword(input, generated)

    expect(matches).to.equal(true)
  })
})