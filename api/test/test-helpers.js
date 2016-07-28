'use strict'
const mocha = require('mocha')
const coMocha = require('co-mocha')

import chai from 'chai'
import dirtyChai from 'dirty-chai'

const Promise = require('bluebird')
const request = Promise.promisify(require('request'))

const Users = require('../src/repo/users')
const Password = require('../src/auth/password')

coMocha(mocha)
chai.use(dirtyChai)

const login = Promise.coroutine(function* (user) {
  const response = yield request('http://127.0.0.1:3001/login',
      {method: 'POST', json: {login: user.login, password: user.password}})

  if (response.statusCode !== 200)
    throw new Error('Could not login')
  return response.body.token
})

const getMeals = Promise.coroutine(function* (authToken) {
  const response = yield request('http://127.0.0.1:3001/api/meals', {headers: {'Authorization': `JWT ${authToken}`}})
  return JSON.parse(response.body)
})

const getUsers = Promise.coroutine(function* (authToken) {
  const response = yield request('http://127.0.0.1:3001/api/users', {headers: {'Authorization': `JWT ${authToken}`}})
  return JSON.parse(response.body)
})

const createUser = Promise.coroutine(function* (user) {
  user.password = yield Password.encryptPassword(user.password)
  return yield Users.save(user)
})

module.exports = {
  login: login,
  getMeals: getMeals,
  getUsers: getUsers,
  createUser: createUser,
  request: request
}