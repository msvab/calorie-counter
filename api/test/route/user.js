'use strict'
const expect = require('chai').expect
const _ = require('lodash')

const TestApp = require('../test-app')
const helper = require('../test-helpers')
const knex = require('../../src/repo/db-model').knex
const Users = require('../../src/repo/users')

TestApp.start()

describe('/api/users', () => {
  afterEach(function* () {
    yield knex.raw("DELETE FROM users WHERE login ILIKE 'test-%'")
  })

  describe('GET /', () => {
    it('should return all users', function* () {
      const user = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'USER', maxDailyCalories: 2100})
      const admin = yield helper.createUser({login: 'test-admin', password: 'pwd', role: 'ADMIN', maxDailyCalories: null})

      yield helper.login({login: admin.login, password: 'pwd'})

      const response = yield helper.request('http://127.0.0.1:3001/api/users', {method: 'GET'})

      expect(response.statusCode).to.equal(200)
      const users = JSON.parse(response.body)
      expect(users).to.deep.include.members([_.omit(user, 'password'), _.omit(admin, 'password')])
    })

    it('should return 403 when user is not ADMIN nor USER_MANAGER', function* () {
      const user = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'USER', maxDailyCalories: 2100})

      yield helper.login({login: user.login, password: 'pwd'})

      const response = yield helper.request('http://127.0.0.1:3001/api/users', {method: 'GET'})

      expect(response.statusCode).to.equal(403)
    })

    it('shouldnt be possible to get users, when not logged in', function* () {
      helper.clearCookies()

      const response = yield helper.request('http://127.0.0.1:3001/api/users', {method: 'GET'})

      expect(response.statusCode).to.equal(401)
    })
  })

  describe('GET /current_user', () => {
    it('should return user details of a user that is currently logged in', function* () {
      const user = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'USER', maxDailyCalories: 2100})

      yield helper.login({login: user.login, password: 'pwd'})

      const response = yield helper.request('http://127.0.0.1:3001/api/users/current_user', {method: 'GET'})

      expect(response.statusCode).to.equal(200)
      const users = JSON.parse(response.body)
      expect(users).to.deep.equal(_.omit(user, 'password'))
    })
  })

  describe('POST /', () => {
    it('should create a user', function* () {
      const userManager = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'USER_MANAGER', maxDailyCalories: 2100})
      const newUser = {login: 'test-user-2', password: 'pwd', role: 'USER', maxDailyCalories: null}

      yield helper.login({login: userManager.login, password: 'pwd'})

      let response = yield helper.request('http://127.0.0.1:3001/api/users', {method: 'POST', json: newUser})

      expect(response.statusCode).to.equal(200)

      const users = yield helper.getUsers()
      expect(users).to.deep.include.members([_.omit(newUser, 'password')])
    })

    it('should not be possible to create admin user unless logged in', function* () {
      const newUser = {login: 'test-user-2', password: 'pwd', role: 'ADMIN', maxDailyCalories: null}

      helper.clearCookies()

      let response = yield helper.request('http://127.0.0.1:3001/api/users', {method: 'POST', json: newUser})

      expect(response.statusCode).to.equal(422)
    })
  })

  describe('DELETE /:login', () => {
    it('should delete a user', function* () {
      const userManager = yield helper.createUser({login: 'test-user-mgr', password: 'pwd', role: 'USER_MANAGER'})
      const user = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'USER'})

      yield helper.login({login: userManager.login, password: 'pwd'})

      let response = yield helper.request(`http://127.0.0.1:3001/api/users/${user.login}`, {method: 'DELETE'})

      expect(response.statusCode).to.equal(200)

      const users = yield helper.getMeals()
      expect(users).to.not.deep.include.members([_.omit(user, 'password')])
    })
  })

  describe('PATCH /:login', () => {
    it('should update a user', function* () {
      const user = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'ADMIN', maxDailyCalories: null})
      const update = {login: user.login, maxDailyCalories: 2100}
      const updatedUser = Object.assign({}, user, update)

      yield helper.login({login: user.login, password: 'pwd'})

      let response = yield helper.request(`http://127.0.0.1:3001/api/users/${user.login}`, {method: 'PATCH', json: update})

      expect(response.statusCode).to.equal(200)

      const users = yield helper.getUsers()
      expect(users).to.deep.include.members([_.omit(updatedUser, 'password')])
    })
  })
})