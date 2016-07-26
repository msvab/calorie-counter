'use strict';
const passport    = require('koa-passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt  = require('passport-jwt').ExtractJwt
const jwtConfig   = require('./jwt-config')
const Users       = require('../repo/users')

const jwtOptions = {secretOrKey: jwtConfig.jwtSecret, jwtFromRequest: ExtractJwt.fromAuthHeader()}

function onAuthenticated(payload, done) {
  return Users.findByLogin(payload.login)
      .then(user => done(null, user))
      .catch(() => done(null, false))
}

passport.use(new JwtStrategy(jwtOptions, onAuthenticated))

module.exports = {
  initialize: function() {
    return passport.initialize()
  },
  authenticate: function() {
    return passport.authenticate('jwt', jwtConfig.jwtSession)
  }
}