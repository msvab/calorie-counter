'use strict'

module.exports = function* authenticationCheck(next) {
  if (this.isAuthenticated()
      || !this.path.startsWith('/api/')
      || (this.path === '/api/users' && this.method === 'POST')) {
    yield next
  } else {
    this.throw(401)
  }
}