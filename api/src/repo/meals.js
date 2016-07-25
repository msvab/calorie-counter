"use strict";
const moment = require('moment')
const Meal   = require('./db-model').Meal

class Meals {
  static save(meal) {
    return new Meal(meal).save().then(createdMeal => createdMeal.toJSON())
  }

  static update(meal) {
    return new Meal(meal).save({}, {method: 'update'}).then(updatedMeal => updatedMeal.toJSON())
  }

  static remove(login, mealId) {
    return Meal.where({login: login, id: mealId}).destroy()
  }

  static findByUser(login) {
    const dbMeals = Meal.where({login: login}).fetchAll().then(result => result.toJSON());
    return dbMeals.then(meals => meals.map(meal => {
      meal.date = moment(meal.date).format('YYYY-MM-DD')
      meal.time = moment(meal.time, 'HH:mm:ss').format('HH:mm')
      return meal
    }))
  }

  static findAll() {
    const dbMeals = Meal.fetchAll().then(result => result.toJSON());
    return dbMeals.then(meals => meals.map(meal => {
      meal.date = moment(meal.date).format('YYYY-MM-DD')
      meal.time = moment(meal.time, 'HH:mm:ss').format('HH:mm')
      return meal
    }))
  }
}

module.exports = Meals