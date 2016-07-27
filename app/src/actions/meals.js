'use strict'
import moment from 'moment'
import {del, get, postJson, putJson} from '../utils/request'
import {RECEIVE_MEALS, MEALS_FILTERED, MEAL_CREATED, MEAL_UPDATED, MEAL_DELETED,
    TOGGLE_CREATE_MEAL, SHOW_EDIT_MEAL, HIDE_EDIT_MEAL} from '../constants/action-types'

export const receiveMeals = meals => ({ type: RECEIVE_MEALS, meals })
export const mealsFiltered = filteredMeals => ({ type: MEALS_FILTERED, filteredMeals })
export const mealCreated = meal => ({ type: MEAL_CREATED, meal })
export const mealUpdated = meal => ({ type: MEAL_UPDATED, meal })
export const mealDeleted = id => ({ type: MEAL_DELETED, id })

export const toggleCreateMeal = () => ({type: TOGGLE_CREATE_MEAL})
export const showEditMeal = id => ({type: SHOW_EDIT_MEAL, id})
export const hideEditMeal = () => ({type: HIDE_EDIT_MEAL})

export function fetchMeals() {
  return async function(dispatch) {
    const response = await get('/api/meals')

    if (response.ok) {
      const meals = await response.json()
      dispatch(receiveMeals(meals))
    }
  };
}

export function createMeal(meal) {
  return async function(dispatch) {
    const response = await postJson('/api/meals', meal)

    if (response.ok) {
      const createdMeal = await response.json()
      dispatch(mealCreated(createdMeal))
    }
  };
}

export function updateMeal(meal, id) {
  return async function(dispatch) {
    const response = await putJson(`/api/meals/${id}`, meal)

    if (response.ok) {
      dispatch(mealUpdated(meal))
      dispatch(hideEditMeal())
    }
  };
}

export function deleteMeal(id) {
  return async function(dispatch) {
    const response = await del(`/api/meals/${id}`)

    if (response.ok) {
      dispatch(mealDeleted(id))
    }
  };
}

export function filterMeals(meals, filter) {
  return function(dispatch) {
    let filtered = meals
    if (filter.fromDate)
      filtered = filtered.filter(meal => moment(meal.date).isSameOrAfter(filter.fromDate))
    if (filter.toDate)
      filtered = filtered.filter(meal => moment(meal.date).isSameOrBefore(filter.toDate))
    if (filter.fromTime)
      filtered = filtered.filter(meal => moment(meal.time, 'HH:mm').isSameOrAfter(filter.fromTime))
    if (filter.toTime)
      filtered = filtered.filter(meal => moment(meal.time, 'HH:mm').isSameOrBefore(filter.toTime))

    dispatch(mealsFiltered(filtered))
  }
}