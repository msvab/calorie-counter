'use strict';
const router = require('koa-router')();
const Users = require('../repo/users');
const password = require('../auth/password')

function* updateUser() {
  const user = this.request.body
  if (user.password)
    user.password = yield password.encryptPassword(user.password)

  yield Users.update(user)
  this.status = 200
}

function* deleteUser() {
  const login = this.params.login

  yield Users.remove(login)
  this.status = 200
}

function* listUsers() {
  const role = this.passport.user.role
  if (role !== 'ADMIN' && role !== 'USER_MANAGER')
    this.status = 403
  else
    this.body = yield Users.findAll()
}

function* getCurrentUserDetails() {
  const login = this.passport.user.login
  const user = yield Users.findByLogin(login)
  delete user.password
  this.body = user
}

router.get('/', listUsers)
router.get('/current_user', getCurrentUserDetails)
router.patch('/:login', updateUser)
router.delete('/:login', deleteUser)

module.exports = router;