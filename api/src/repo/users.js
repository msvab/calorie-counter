"use strict";
const User = require('./db-model').User

module.exports = class Users {
  static save(user) {
    return new User(user).save({}, {method: 'insert'}).then(user => user.toJSON())
  }

  static update(user) {
    const login = user.login
    delete user.login
    return new User({login: login}).save(user, {method: 'update', patch: true})
  }

  static remove(login) {
    return User.where({login: login}).destroy()
  }

  static findByLogin(login) {
    return User.where({login: login}).fetch().then(user => user ? user.toJSON() : null)
  }

  static findAll() {
    const dbUsers = User.fetchAll().then(result => result.toJSON());
    return dbUsers.then(users => users.map(user => {
      delete user.password
      return user
    }))
  }
}