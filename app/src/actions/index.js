'use strict'
import moment from 'moment'
import {push} from 'react-router-redux'
import Auth from '../auth'

export const RECEIVE_MEALS = 'RECEIVE_MEALS'
export const MEALS_FILTERED = 'MEALS_FILTERED'
export const MEAL_CREATED = 'MEAL_CREATED'
export const MEAL_UPDATED = 'MEAL_UPDATED'
export const MEAL_DELETED = 'MEAL_DELETED'

export const RECEIVE_USERS = 'RECEIVE_USERS'
export const USER_CREATED = 'USER_CREATED'
export const USER_UPDATED = 'USER_UPDATED'
export const USER_DELETED = 'USER_DELETED'

export const TOGGLE_CREATE_MEAL = 'TOGGLE_CREATE_MEAL'
export const SHOW_EDIT_MEAL = 'SHOW_EDIT_MEAL'
export const HIDE_EDIT_MEAL = 'HIDE_EDIT_MEAL'

export const TOGGLE_CREATE_USER = 'TOGGLE_CREATE_USER'
export const SHOW_EDIT_USER = 'SHOW_EDIT_USER'
export const HIDE_EDIT_USER = 'HIDE_EDIT_USER'

export const SET_USER = 'SET_USER'
export const LOGOUT = 'LOGOUT'

export const SHOW_EDIT_DAILY_LIMIT = 'SHOW_EDIT_DAILY_LIMIT'
export const DAILY_LIMIT_CHANGED = 'DAILY_LIMIT_CHANGED'

export const receiveMeals = meals => ({ type: RECEIVE_MEALS, meals })
export const mealsFiltered = filteredMeals => ({ type: MEALS_FILTERED, filteredMeals })
export const mealCreated = meal => ({ type: MEAL_CREATED, meal })
export const mealUpdated = meal => ({ type: MEAL_UPDATED, meal })
export const mealDeleted = id => ({ type: MEAL_DELETED, id })

export const receiveUsers = users => ({ type: RECEIVE_USERS, users })
export const userCreated = user => ({ type: USER_CREATED, user })
export const userUpdated = user => ({ type: USER_UPDATED, user })
export const userDeleted = login => ({ type: USER_DELETED, login })

export const toggleCreateMeal = () => ({type: TOGGLE_CREATE_MEAL})
export const showEditMeal = id => ({type: SHOW_EDIT_MEAL, id})
export const hideEditMeal = () => ({type: HIDE_EDIT_MEAL})

export const toggleCreateUser = () => ({type: TOGGLE_CREATE_USER})
export const showEditUser = login => ({type: SHOW_EDIT_USER, login})
export const hideEditUser = () => ({type: HIDE_EDIT_USER})

export const setUser = user => ({type: SET_USER, user})
export const logout = () => ({type: LOGOUT})

export const showEditDailyLimit = () => ({type: SHOW_EDIT_DAILY_LIMIT})
export const dailyLimitChanged = limit => ({type: DAILY_LIMIT_CHANGED, limit})

// const host = 'http://127.0.0.1:3000'
const host = ''

export function fetchUsers() {
  return async function(dispatch) {
    const response = await fetch(`${host}/api/users`, {
      credentials: 'include',
      mode: 'cors'
    })

    if (response.ok) {
      const users = await response.json()
      dispatch(receiveUsers(users))
    }
  };
}

export function createUser(user, redirectTo) {
  return async function (dispatch) {
    const response = await fetch(`${host}/api/users`, {
      method: 'post',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })

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
    const response = await fetch(`${host}/api/users/${user.login}`, {
      method: 'PATCH',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })

    if (response.ok) {
      dispatch(userUpdated(user))
      dispatch(hideEditUser())
    }
  };
}

export function deleteUser(login) {
  return async function(dispatch) {
    const response = await fetch(`${host}/api/users/${login}`, {
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors'
    })

    if (response.ok) {
      dispatch(userDeleted(login))
      dispatch(hideEditUser())
    }
  };
}

export function fetchMeals() {
  return async function(dispatch) {
    const response = await fetch(`${host}/api/meals`, {
      credentials: 'include',
      mode: 'cors'
    })

    if (response.ok) {
      const meals = await response.json()
      dispatch(receiveMeals(meals))
    }
  };
}

export function createMeal(meal) {
  return async function(dispatch) {
    const response = await fetch(`${host}/api/meals`, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meal)
    })

    if (response.ok) {
      const createdMeal = await response.json()
      dispatch(mealCreated(createdMeal))
    }
  };
}

export function updateMeal(meal, id) {
  return async function(dispatch) {
    const response = await fetch(`${host}/api/meals/${id}`, {
      method: 'PUT',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meal)
    })

    if (response.ok) {
      dispatch(mealUpdated(meal))
      dispatch(hideEditMeal())
    }
  };
}

export function deleteMeal(id) {
  return async function(dispatch) {
    const response = await fetch(`${host}/api/meals/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors'
    })

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

export function setDailyLimit(login, limit) {
  return async function(dispatch) {
    const response = await fetch(`${host}/api/users/${login}`, {
      method: 'PATCH',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({login: login, maxDailyCalories: limit})
    })

    if (response.ok) {
      dispatch(dailyLimitChanged(limit))
    }
  };
}

export function fetchUserDetails() {
  return async function(dispatch) {
    const response = await fetch(`${host}/api/users/current_user`, {
      credentials: 'include',
      mode: 'cors'
    })

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
