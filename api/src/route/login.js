'use strict';
const router   = require('koa-router')()
const passport = require('koa-passport')

router.post('/', function* (next) {
  var ctx = this
  yield passport.authenticate('local', function*(err, user) {
    if (err) throw err
    if (user === false) {
      ctx.status = 422
    } else {
      yield ctx.login(user)
      const dbUser = Object.assign({}, ctx.passport.user)
      delete dbUser.password
      ctx.body = dbUser
    }
  }).call(this, next)
})

module.exports = router