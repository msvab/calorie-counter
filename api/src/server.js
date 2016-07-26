'use strict'
const koa         = require('koa')
const serve       = require('koa-static')
const logger      = require('koa-logger')
const bodyParser  = require('koa-body')

const passport    = require('./auth/passport')
const router      = require('./routes')
const printRoutes = require('./util/koa-print-routes')

const app = koa();
app.name = 'Calorie Counter'

app
    .use(logger())
    .use(bodyParser())
    .use(passport.initialize())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve('./app/build'))

app.listen(process.env.PORT || 3000)

printRoutes(router)