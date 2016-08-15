'use strict';
import _ from 'lodash/array'

import {LOGOUT, TOGGLE_CREATE_USER, SHOW_EDIT_USER, HIDE_EDIT_USER, RECEIVE_USERS,
    USER_CREATED, USER_DELETED, USER_UPDATED} from '../actions/users'

const sortUsers = (a, b) => a.login > b.login

const INITIAL_STATE = {create: false, edit: null, list: []}

export default function users(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGOUT:
      return INITIAL_STATE
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