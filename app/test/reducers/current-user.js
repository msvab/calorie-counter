'use strict'
import {expect} from 'chai'
import {Map} from 'immutable'
import '../test-helper'
import reducer from '../../src/reducers/current-user'
import {SET_USER} from '../../src/constants/action-types'

describe('currentUser reducer', () => {
  it('should return initial state', () => {
    const state = reducer(undefined, {type: null})

    expect(state).to.deep.equal(Map({login: null, role: null, maxDailyCalories: null, editLimit: false}))
  })

  it('should update user details on SET_USER', () => {
    const oldUser = Map({role: 'USER', login: 'Joe'})
    const newUser = {role: 'ADMIN', login: 'Amy'}

    const state = reducer(oldUser, {type: SET_USER, user: newUser})

    expect(state).to.deep.equal(Map(newUser))
  })
})