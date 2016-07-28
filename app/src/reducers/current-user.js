'use strict'

import {SET_USER, LOGOUT, DAILY_LIMIT_CHANGED, SHOW_EDIT_DAILY_LIMIT} from '../constants/action-types'

const INITIAL_STATE = {login: null, role: null, maxDailyCalories: null, editLimit: false}

export default function currentUser(state = INITIAL_STATE, action) {
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