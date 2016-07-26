'use strict'
const expect = require('chai').expect

const TestApp = require('../test-app')
const helper = require('../test-helpers')
const knex = require('../../src/repo/db-model').knex
const Meals = require('../../src/repo/meals')

TestApp.start()

describe('/api/meals', () => {
  afterEach(function* () {
    yield knex.raw("DELETE FROM users WHERE login ILIKE 'test-%'")
  })

  describe('GET /', () => {
    it('should return only users meals', function* () {
      const user = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'USER'})
      const admin = yield helper.createUser({login: 'test-admin', password: 'pwd', role: 'ADMIN'})
      const userMeal1 = yield Meals.save({login: 'test-user', date: '2011-12-04', time: '09:00', name: 'brekkie', calories: 100})
      const userMeal2 = yield Meals.save({login: 'test-user', date: '2011-12-04', time: '12:00', name: 'lunch', calories: 600})
      const adminMeal = yield Meals.save({login: 'test-admin', date: '2011-12-04', time: '09:30', name: 'brekkie', calories: 100})

      const token = yield helper.login({login: user.login, password: 'pwd'})

      const response = yield helper.request('http://127.0.0.1:3001/api/meals',
          {method: 'GET', headers: {'Authorization': `JWT ${token}`}})

      expect(response.statusCode).to.equal(200)
      const meals = JSON.parse(response.body)
      expect(meals).to.deep.equal([userMeal1, userMeal2])
    })

    it('should return meals of all users to administrator', function* () {
      const user = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'USER'})
      const admin = yield helper.createUser({login: 'test-admin', password: 'pwd', role: 'ADMIN'})
      const userMeal1 = yield Meals.save({login: 'test-user', date: '2011-12-04', time: '09:00', name: 'brekkie', calories: 100})
      const userMeal2 = yield Meals.save({login: 'test-user', date: '2011-12-04', time: '12:00', name: 'lunch', calories: 600})
      const adminMeal = yield Meals.save({login: 'test-admin', date: '2011-12-04', time: '09:30', name: 'brekkie', calories: 100})

      const token = yield helper.login({login: admin.login, password: 'pwd'})

      const response = yield helper.request('http://127.0.0.1:3001/api/meals',
          {method: 'GET', headers: {'Authorization': `JWT ${token}`}})

      expect(response.statusCode).to.equal(200)
      const meals = JSON.parse(response.body)
      expect(meals).to.deep.include.members([userMeal1, userMeal2, adminMeal])
    })

    it('shouldnt be possible to get meals, when not logged in', function* () {
      const response = yield helper.request('http://127.0.0.1:3001/api/meals', {method: 'GET'})

      expect(response.statusCode).to.equal(401)
    })
  })

  describe('POST /', () => {
    it('should create a meal', function* () {
      const user = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'USER'})
      const newMeal = {date: '2012-12-22', time: '08:00', name: 'brekkie', calories: 500}

      const token = yield helper.login({login: 'test-user', password: 'pwd'})

      let response = yield helper.request('http://127.0.0.1:3001/api/meals',
          {method: 'POST', json: newMeal, headers: {'Authorization': `JWT ${token}`}})

      expect(response.statusCode).to.equal(200)

      const meals = yield helper.getMeals(token)
      expect(meals).to.have.length(1)
    })
  })

  describe('DELETE /:id', () => {
    it('should delete a meal', function* () {
      const user = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'USER'})
      const meal = yield Meals.save({login: user.login, date: '2011-12-04', time: '09:00', name: 'brekkie', calories: 100})

      const token = yield helper.login({login: 'test-user', password: 'pwd'})

      let response = yield helper.request(`http://127.0.0.1:3001/api/meals/${meal.id}`,
          {method: 'DELETE', headers: {'Authorization': `JWT ${token}`}})

      expect(response.statusCode).to.equal(200)

      const meals = yield helper.getMeals(token)
      expect(meals).to.have.length(0)
    })
  })

  describe('PUT /:id', () => {
    it('should update a meal', function* () {
      const user = yield helper.createUser({login: 'test-user', password: 'pwd', role: 'USER'})
      const meal = yield Meals.save({login: user.login, date: '2011-12-04', time: '09:00', name: 'brekkie', calories: 100})
      const updatedMeal = Object.assign({}, meal, {time: '10:00', calories: 200})

      const token = yield helper.login({login: 'test-user', password: 'pwd'})

      let response = yield helper.request(`http://127.0.0.1:3001/api/meals/${meal.id}`,
          {method: 'PUT', json: updatedMeal, headers: {'Authorization': `JWT ${token}`}})

      expect(response.statusCode).to.equal(200)

      const meals = yield helper.getMeals(token)
      expect(meals).to.deep.equal([updatedMeal])
    })
  })
})