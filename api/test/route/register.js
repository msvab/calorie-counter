'use strict'
const expect = require('chai').expect
const _ = require('lodash')

const TestApp = require('../test-app')
const helper = require('../test-helpers')
const knex = require('../../src/repo/db-model').knex
const Users = require('../../src/repo/users')

TestApp.start()

describe('/register', () => {
  afterEach(function* () {
    yield knex.raw("DELETE FROM users WHERE login ILIKE 'test-%'")
  })

  describe('POST /', () => {
    it('should create a user', function* () {
      const userManager = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'USER_MANAGER', maxDailyCalories: 2100})
      const newUser = {login: 'test-user-2', password: 'pwd', role: 'USER', maxDailyCalories: null}

      const token = yield helper.login({login: userManager.login, password: 'pwd'})

      let response = yield helper.request('http://127.0.0.1:3001/register',
          {method: 'POST', json: newUser, headers: {'Authorization': `JWT ${token}`}})

      expect(response.statusCode).to.equal(200)

      const users = yield helper.getUsers(token)
      expect(users).to.deep.include.members([_.omit(newUser, 'password')])
    })

    it('should not be possible to create admin user unless logged in', function* () {
      const newUser = {login: 'test-user-2', password: 'pwd', role: 'ADMIN', maxDailyCalories: null}

      let response = yield helper.request('http://127.0.0.1:3001/register', {method: 'POST', json: newUser})

      expect(response.statusCode).to.equal(422)
    })
  })
})