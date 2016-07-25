'use strict';
const router = require('koa-router')();
const Meals = require('../repo/meals');

function* createMeal() {
  const meal = this.request.body

  if (!meal.date || !meal.time || !meal.name || !meal.calories) {
    this.status = 442
    return
  }

  meal.login = this.passport.user.login

  this.body = yield Meals.save(meal)
}

function* updateMeal() {
  const meal = this.request.body
  meal.login = this.passport.user.login

  yield Meals.update(meal)
  this.status = 200
}

function* deleteMeal() {
  const mealId = this.params.id
  const login = this.passport.user.login

  yield Meals.remove(login, mealId)
  this.status = 200
}

function* listMeals() {
  if (this.passport.user.role === 'ADMIN') {
    this.body = yield Meals.findAll()
  } else {
    const login = this.passport.user.login
    this.body = yield Meals.findByUser(login)
  }
}

router.get('/', listMeals)
router.post('/', createMeal)
router.put('/:id', updateMeal)
router.delete('/:id', deleteMeal)

module.exports = router;