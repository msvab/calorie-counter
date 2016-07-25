const koa                    = require('koa')
const serve                  = require('koa-static')
const logger                 = require('koa-logger')
const router                 = require('koa-router')()
const bodyParser             = require('koa-body')
const session                = require('koa-session')
const cors                   = require('kcors')

const passport               = require('./auth/passport')
const authenticationCheck    = require('./auth/authentication-check')
const userRoutes             = require('./route/user')
const mealRoutes             = require('./route/meal')
const loginRoutes            = require('./route/login')

const app = koa();
app.name = 'Calorie Counter'
app.proxy = true
app.keys = ['i am secret']

router.use('/api/users', userRoutes.routes())
router.use('/api/meals', mealRoutes.routes())
router.use('/login', loginRoutes.routes())

app
    .use(session(app))
    .use(logger())
    .use(bodyParser({multipart: true}))
    .use(cors({credentials: true, allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'}))
    .use(passport.initialize())
    .use(passport.session())
    .use(authenticationCheck)
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve('./app/build'))

app.listen(process.env.PORT || 3000)