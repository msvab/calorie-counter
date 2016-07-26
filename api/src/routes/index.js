'use strict'
const router      = require('koa-router')()

const passport    = require('../auth/passport')
const userRoutes  = require('./user')
const mealRoutes  = require('./meal')
const loginRoutes = require('./login')
const registerRoutes = require('./register')

router.use('/api/users', passport.authenticate(), userRoutes.routes())
router.use('/api/meals', passport.authenticate(), mealRoutes.routes())
router.use('/login', loginRoutes.routes())
router.use('/register', registerRoutes.routes())

module.exports = router