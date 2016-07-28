'use strict'
import {Map} from 'immutable'

import {SET_USER, LOGOUT, DAILY_LIMIT_CHANGED, SHOW_EDIT_DAILY_LIMIT} from '../constants/action-types'

const INITIAL_STATE = Map({login: null, role: null, maxDailyCalories: null, editLimit: false})

export default function currentUser(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_USER:
      return state.merge(action.user)
    case LOGOUT:
      return state.merge({login: null, role: null, maxDailyCalories: null})
    case SHOW_EDIT_DAILY_LIMIT:
      return state.set('editLimit', true)
    case DAILY_LIMIT_CHANGED:
      return state.merge({editLimit: false, maxDailyCalories: action.limit})
    default:
      return state
  }
}