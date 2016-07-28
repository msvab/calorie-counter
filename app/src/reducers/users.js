'use strict';
import {Map, List, fromJS} from 'immutable'

import {LOGOUT, TOGGLE_CREATE_USER, SHOW_EDIT_USER, HIDE_EDIT_USER, RECEIVE_USERS,
    USER_CREATED, USER_DELETED, USER_UPDATED} from '../constants/action-types'

const sortUsers = (a, b) => a.login > b.login
const sortImmutableUsers = (a, b) => a.get('login').localeCompare(b.get('login'))

const INITIAL_STATE = Map({create: false, edit: null, list: List()})

export default function users(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGOUT:
      return INITIAL_STATE
    case RECEIVE_USERS: {
      action.users.sort(sortUsers)
      return state.set('list', fromJS(action.users))
    }
    case USER_CREATED:
      return state
          .set('create', false)
          .update('list', prevList => prevList.push(Map(action.user)).sort(sortImmutableUsers))
    case USER_UPDATED:
      return state
          .set('edit', null)
          .update('list', prevList => {
            const index = prevList.findKey(val => val.get('login') === action.user.login)
            return prevList.set(index, Map(action.user))
          })
    case USER_DELETED:
      return state.update('list', prevList => {
        const index = prevList.findKey(val => val.get('login') === action.login)
        return prevList.delete(index)
      })
    case TOGGLE_CREATE_USER:
      return state.set('create', !state.get('create'))
    case SHOW_EDIT_USER:
      return state.set('edit', action.login)
    case HIDE_EDIT_USER:
      return state.set('edit', null)
    default:
      return state
  }
}