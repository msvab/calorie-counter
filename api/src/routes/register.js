'use strict';
const router = require('koa-router')();
const Users = require('../repo/users');
const password = require('../auth/password')

function* registerUser() {
  const user = this.request.body

  if (!user.password || !user.login) {
    this.status = 422
    return
  }

  if (user.role !== 'USER' && (this.passport.user == null || this.passport.user.role === 'USER')) {
    this.status = 422
    return
  }

  user.password = yield password.encryptPassword(user.password)

  yield Users.save(user)
  this.status = 200
}

router.post('/', registerUser)

module.exports = router;