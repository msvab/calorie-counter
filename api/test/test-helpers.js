'use strict'
const mocha = require('mocha')
const coMocha = require('co-mocha')
const Promise = require('bluebird')
const request = require("request")

const Users = require('../src/repo/users')
const Password = require('../src/auth/password')

coMocha(mocha)

let cookies = request.jar()
let promiseRequest = Promise.promisify(request.defaults({jar: cookies}))

const login = Promise.coroutine(function* (user) {
  const response = yield promiseRequest('http://127.0.0.1:3001/login',
      {method: 'POST', form: {fields: {login: user.login, password: user.password}}})

  if (response.statusCode !== 200)
    throw new Error('Could not login')
  return response
})

const getMeals = Promise.coroutine(function* () {
  const response = yield promiseRequest('http://127.0.0.1:3001/api/meals')
  return JSON.parse(response.body)
})

const getUsers = Promise.coroutine(function* () {
  const response = yield promiseRequest('http://127.0.0.1:3001/api/users')
  return JSON.parse(response.body)
})

const createUser = Promise.coroutine(function* (user) {
  user.password = yield Password.encryptPassword(user.password)
  return yield Users.save(user)
})

function clearCookies() {
  cookies = request.jar()
}

module.exports = {
  login: login,
  getMeals: getMeals,
  getUsers: getUsers,
  createUser: createUser,
  request: promiseRequest,
  clearCookies: clearCookies
}