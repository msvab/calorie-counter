'use strict'
const expect = require('chai').expect

const TestApp = require('../test-app')
const helper = require('../test-helpers')
const knex = require('../../src/repo/db-model').knex
const Users = require('../../src/repo/users')

TestApp.start()

describe('/login', () => {
  afterEach(function*() {
    yield knex.raw('DELETE FROM users WHERE login IN (\'test-user\', \'test-admin\')')
  })

  describe('POST /', () => {
    it('should set session cookies', function* () {
      const user = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'USER'})

      const response = yield helper.request('http://127.0.0.1:3001/login',
          {method: 'POST', form: {fields: {login: user.login, password: 'pwd'}}})

      expect(response.statusCode).to.equal(200)
      expect(response.headers).to.include.keys(['set-cookie'])
    })

    it('should return 401 for wrong credentials', function* () {
      const user = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'USER'})

      const response = yield helper.request('http://127.0.0.1:3001/login',
          {method: 'POST', form: {fields: {login: user.login, password: 'wrong password'}}})

      expect(response.statusCode).to.equal(422)
    })
  })
})