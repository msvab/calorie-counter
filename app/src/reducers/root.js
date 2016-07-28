'use strict'
import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import meals from './meals'
import users from './users'
import currentUser from './current-user'

const rootReducer = combineReducers({
  meals,
  currentUser,
  users,
  routing: routerReducer
})

export default rootReducer