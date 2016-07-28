'use strict'
import moment from 'moment'
import {List, Map} from 'immutable'

import {RECEIVE_MEALS, MEAL_CREATED, MEAL_UPDATED, MEAL_DELETED, LOGOUT,
    TOGGLE_CREATE_MEAL, SHOW_EDIT_MEAL, HIDE_EDIT_MEAL, MEALS_FILTERED} from '../constants/action-types'

const sortMeals = (a, b) => moment(`${a.get('date')} ${a.get('time')}`).isAfter(`${b.get('date')} ${b.get('time')}`)

const sumCalories = meals => meals
    .filter(meal => moment().isSame(meal.get('date'), 'day'))
    .reduce((sum, next) => +next.get('calories') + sum, 0)

const INITIAL_STATE = Map({
  create: false,
  edit: false,
  list: List(),
  filteredList: List(),
  filter: Map({fromDate: null, toDate: null, fromTime: null, toTime: null}),
  todaysCalories: 0
})

export default function meals(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGOUT:
      return INITIAL_STATE
    case RECEIVE_MEALS: {
      const immutableMeals = List(action.meals).sort(sortMeals)
      const newState = state.merge({list: immutableMeals, filteredList: immutableMeals})
      return newState.set('todaysCalories', sumCalories(newState.get('list')))
    }
    case MEALS_FILTERED:
      return state.set('filteredMeals', action.filteredMeals)
    case MEAL_CREATED: {
        const newState = state
            .set('create', false)
            .update(prevState => prevState.update('list', prevList => prevList.push(Map(action.meal)).sort(sortMeals)))
        return newState.set('todaysCalories', sumCalories(newState.get('list')))
    }
    case MEAL_UPDATED: {
      const newState = state
          .set('edit', null)
          .update('list', prevList => {
            const index = prevList.findKey(val => val.get('id') === action.meal.id)
            return prevList.set(index, Map(action.meal))
          })
      return newState.set('todaysCalories', sumCalories(newState.get('list')))
    }
    case MEAL_DELETED: {
      const newState = state.update('list', prevList => {
        const index = prevList.findKey(val => val.get('id') === action.id)
        return prevList.delete(index)
      })
      return newState.set('todaysCalories', sumCalories(newState.get('list')))
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
