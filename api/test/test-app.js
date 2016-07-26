'use strict'
const koa        = require('koa')
const bodyParser = require('koa-body')

const passport   = require('../src/auth/passport')
const router     = require('../src/routes')

class TestApp {
  static start() {
    if (TestApp.started) return

    TestApp.started = true
    const app = koa()
    app
        .use(bodyParser())
        .use(passport.initialize())
        .use(router.routes())
        .use(router.allowedMethods())
        .listen(3001)
  }
}

TestApp.prototype.started = false

module.exports = TestApp