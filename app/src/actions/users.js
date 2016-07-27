'use strict'
import {push} from 'react-router-redux'
import Auth from '../auth'
import {del, get, patchJson, postJson} from '../utils/request'
import {RECEIVE_USERS, USER_CREATED, USER_UPDATED, USER_DELETED, TOGGLE_CREATE_USER, SHOW_EDIT_USER,
    HIDE_EDIT_USER, SET_USER, LOGOUT} from '../constants/action-types'

export const receiveUsers = users => ({ type: RECEIVE_USERS, users })
export const userCreated = user => ({ type: USER_CREATED, user })
export const userUpdated = user => ({ type: USER_UPDATED, user })
export const userDeleted = login => ({ type: USER_DELETED, login })

export const toggleCreateUser = () => ({type: TOGGLE_CREATE_USER})
export const showEditUser = login => ({type: SHOW_EDIT_USER, login})
export const hideEditUser = () => ({type: HIDE_EDIT_USER})

export const setUser = user => ({type: SET_USER, user})
export const logout = () => ({type: LOGOUT})

export function fetchUsers() {
  return async function(dispatch) {
    const response = await get('/api/users')

    if (response.ok) {
      const users = await response.json()
      dispatch(receiveUsers(users))
    }
  };
}

export function createUser(user, redirectTo) {
  return async function (dispatch) {
    const response = await postJson('/api/users', user)

    if (response.ok) {
      if (redirectTo)
        dispatch(push(redirectTo))
      else
        dispatch(userCreated(user))
    }
  }
}

export function updateUser(user) {
  return async function(dispatch) {
    const response = await patchJson(`/api/users/${user.login}`, user)

    if (response.ok) {
      dispatch(userUpdated(user))
      dispatch(hideEditUser())
    }
  };
}

export function deleteUser(login) {
  return async function(dispatch) {
    const response = await del(`/api/users/${login}`)

    if (response.ok) {
      dispatch(userDeleted(login))
      dispatch(hideEditUser())
    }
  };
}

export function fetchUserDetails() {
  return async function(dispatch) {
    const response = await get('/api/users/current_user')

    if (response.ok) {
      const user = await response.json()
      dispatch(setUser(user))
      dispatch(push(user.role === 'USER_MANAGER' ? '/users' : '/meals'))
    } else {
      Auth.logout()
      dispatch(logout())
      dispatch(push('/login'))
    }
  };
}