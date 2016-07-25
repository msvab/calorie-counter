'use strict';
const passport      = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const Password      = require('./password')
const Users         = require('../repo/users');

function serializeUser(user, done) {
  done(null, user.login)
}

function deserializeUser(login, done) {
  Users.findByLogin(login).then(user => done(null, user))
}

function authorizeUserInDatabase(login, password, done) {
  return Users.findByLogin(login)
      .then(user =>
          Password.verifyPassword(password, user.password).then(() => user)
      )
      .then(user => done(null, user))
      .catch(() => done(null, false))
}

passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)
passport.use(new LocalStrategy({usernameField: 'fields[login]', passwordField: 'fields[password]'}, authorizeUserInDatabase))

module.exports = passport