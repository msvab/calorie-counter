'use strict';
import _ from 'lodash/array'
import moment from 'moment'
import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import {RECEIVE_MEALS, MEAL_CREATED, MEAL_UPDATED, MEAL_DELETED,
    TOGGLE_CREATE_MEAL, SHOW_EDIT_MEAL, HIDE_EDIT_MEAL, SET_USER, LOGOUT,
    TOGGLE_CREATE_USER, SHOW_EDIT_USER, HIDE_EDIT_USER, RECEIVE_USERS,
    USER_CREATED, USER_DELETED, USER_UPDATED, MEALS_FILTERED, DAILY_LIMIT_CHANGED,
    SHOW_EDIT_DAILY_LIMIT} from '../constants/action-types'

const sortMeals = (a, b) => moment(`${a.date} ${a.time}`).isAfter(`${b.date} ${b.time}`)
const sortUsers = (a, b) => a.login > b.login
const sumCalories = meals => meals
    .filter(meal => moment().isSame(meal.date, 'day'))
    .reduce((sum, next) => +next.calories + sum, 0)

const initialMealsState = {
  create: false,
  edit: false,
  list: [],
  filteredList: [],
  filter: {fromDate: null, toDate: null, fromTime: null, toTime: null},
  todaysCalories: 0
}

function meals(state = initialMealsState, action) {
  switch (action.type) {
    case LOGOUT:
      return initialMealsState
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

const initialCurrentUserState = {login: null, role: null, maxDailyCalories: null, editLimit: false}
function currentUser(state = initialCurrentUserState, action) {
  switch (action.type) {
    case SET_USER: {
      return Object.assign({}, state, action.user)}
    case LOGOUT:
      return Object.assign({}, state, {login: null, role: null, maxDailyCalories: null})
    case SHOW_EDIT_DAILY_LIMIT:
      return Object.assign({}, state, {editLimit: true})
    case DAILY_LIMIT_CHANGED:
      return Object.assign({}, state, {editLimit: false, maxDailyCalories: action.limit})
    default:
      return state
  }
}

const initialUserState = {create: false, edit: null, list: []}
function users(state = initialUserState, action) {
  switch (action.type) {
    case LOGOUT:
      return initialUserState
    case RECEIVE_USERS: {
      action.users.sort(sortUsers)
      return Object.assign({}, state, {list: action.users})
    }
    case USER_CREATED: {
      const newState = Object.assign({}, state, {create: false})
      newState.list.push(action.user)
      newState.list.sort(sortUsers)
      return newState
    }
    case USER_UPDATED: {
      const newState = Object.assign({}, state, {edit: null})
      const oldUser = newState.list[newState.list.findIndex(user => user.login === action.user.login)]
      Object.assign(oldUser, action.user)
      return newState
    }
    case USER_DELETED: {
      const newState = Object.assign({}, state)
      _.remove(newState.list, user => user.login === action.login)
      return newState
    }
    case TOGGLE_CREATE_USER:
      return Object.assign({}, state, {create: !state.create})
    case SHOW_EDIT_USER:
      return Object.assign({}, state, {edit: action.login})
    case HIDE_EDIT_USER:
      return Object.assign({}, state, {edit: null})
    default:
      return state
  }
}

const rootReducer = combineReducers({
  meals,
  currentUser,
  users,
  routing: routerReducer
})

export default rootReducer