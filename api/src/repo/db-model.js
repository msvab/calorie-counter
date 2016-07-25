'use strict'

const pg = require('pg');
pg.defaults.ssl = true;

const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: 'public'
});

const bookshelf = require('bookshelf')(knex);
bookshelf.plugin('bookshelf-camelcase')

const User = bookshelf.Model.extend({
  tableName: 'users',
  idAttribute: 'login'
});

const Meal = bookshelf.Model.extend({
  tableName: 'meals'
});

module.exports = {
  knex: knex,
  User: User,
  Meal: Meal
};