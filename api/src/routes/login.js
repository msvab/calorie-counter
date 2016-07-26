'use strict';
const _         = require('lodash')
const router    = require('koa-router')()
const jwt       = require('jwt-simple')
const Password  = require('../auth/password')
const jwtConfig = require('../auth/jwt-config')
const Users     = require('../repo/users')

function* login() {
  const user = yield Users.findByLogin(this.request.body.login)
  if (user) {
    try {
      yield Password.verifyPassword(this.request.body.password, user.password)

      const payload = {login: user.login}
      const token = jwt.encode(payload, jwtConfig.jwtSecret, 'HS256')
      this.body = {token: token, user: _.omit(user, 'password')}
    } catch (err) {
      this.status = 422
    }
  } else {
    this.status = 422
  }
}

router.post('/', login)

module.exports = router