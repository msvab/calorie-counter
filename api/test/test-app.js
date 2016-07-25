'use strict'
const koa = require('koa')
const router = require('koa-router')
const bodyParser  = require('koa-body')
const session     = require('koa-session')

const passport    = require('../src/auth/passport')
const authenticationCheck = require('../src/auth/authentication-check')
const mealRoutes = require('../src/route/meal')
const userRoutes = require('../src/route/user')
const loginRoutes = require('../src/route/login')

class TestApp {
  static start() {
    if (TestApp.started) return

    TestApp.started = true
    const app = koa()
    app.keys = ['i am secret']
    app
        .use(bodyParser())
        .use(session(app))
        .use(passport.initialize())
        .use(passport.session())
        .use(authenticationCheck)
        .use(router()
            .use('/api/meals', mealRoutes.routes())
            .use('/api/users', userRoutes.routes())
            .use('/login', loginRoutes.routes())
            .routes())
        .listen(3001)
  }
}

TestApp.prototype.started = false

module.exports = TestApp