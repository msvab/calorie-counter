'use strict'
import _ from 'lodash/array'
import moment from 'moment'

import {RECEIVE_MEALS, MEAL_CREATED, MEAL_UPDATED, MEAL_DELETED, LOGOUT,
    TOGGLE_CREATE_MEAL, SHOW_EDIT_MEAL, HIDE_EDIT_MEAL, MEALS_FILTERED} from '../actions/meals'

const sortMeals = (a, b) => moment(`${a.date} ${a.time}`).isAfter(`${b.date} ${b.time}`)

const sumCalories = meals => meals
    .filter(meal => moment().isSame(meal.date, 'day'))
    .reduce((sum, next) => +next.calories + sum, 0)

const INITIAL_STATE = {
  create: false,
  edit: false,
  list: [],
  filteredList: [],
  filter: {fromDate: null, toDate: null, fromTime: null, toTime: null},
  todaysCalories: 0
}

export default function meals(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGOUT:
      return INITIAL_STATE
    case RECEIVE_MEALS: {
      action.meals.sort(sortMeals)
      return Object.assign({}, state, {list: action.meals, filteredList: action.meals, todaysCalories: sumCalories(action.meals)})
    }
    case MEALS_FILTERED: {
      return Object.assign({}, state, {filteredList: action.filteredMeals})
    }
    case MEAL_CREATED: {
      const newState = Object.assign({}, state, {create: false})
      newState.list.push(action.meal)
      newState.list.sort(sortMeals)
      newState.todaysCalories = sumCalories(newState.list)
      return newState
    }
    case MEAL_UPDATED: {
      const newState = Object.assign({}, state, {edit: null})
      const oldMeal = newState.list[newState.list.findIndex(meal => meal.id === action.meal.id)]
      Object.assign(oldMeal, action.meal)
      newState.list.sort(sortMeals)
      newState.todaysCalories = sumCalories(newState.list)
      return newState
    }
    case MEAL_DELETED: {
      const newState = Object.assign({}, state)
      _.remove(newState.list, meal => meal.id === action.id)
      _.remove(newState.filteredList, meal => meal.id === action.id)
      newState.todaysCalories = sumCalories(newState.list)
      return newState
    }
    case TOGGLE_CREATE_MEAL:
      return Object.assign({}, state, {create: !state.create})
    case SHOW_EDIT_MEAL:
      return Object.assign({}, state, {edit: action.id})
    case HIDE_EDIT_MEAL:
      return Object.assign({}, state, {edit: null})
    default:
      return state
  }
}
