'use strict'
const expect = require('chai').expect

const TestApp = require('../test-app')
const helper = require('../test-helpers')
const knex = require('../../src/repo/db-model').knex

TestApp.start()

describe('/login', () => {
  afterEach(function*() {
    yield knex.raw('DELETE FROM users WHERE login IN (\'test-user\', \'test-admin\')')
  })

  describe('POST /', () => {
    it('should return authentication token', function* () {
      const user = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'USER'})

      const response = yield helper.request('http://127.0.0.1:3001/login',
          {method: 'POST', json: {login: user.login, password: 'pwd'}})

      expect(response.statusCode).to.equal(200)
      expect(response.body.user).to.deep.equal({login: user.login, role: user.role, maxDailyCalories: null})
      expect(response.body.token).to.exist
    })

    it('should return 422 for wrong credentials', function* () {
      const user = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'USER'})

      const response = yield helper.request('http://127.0.0.1:3001/login',
          {method: 'POST', json: {login: user.login, password: 'wrong password'}})

      expect(response.statusCode).to.equal(422)
    })
  })
})