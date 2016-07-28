'use strict'
import {expect} from 'chai'
import {Map, List} from 'immutable'
import '../test-helper'
import reducer from '../../src/reducers/users'
import {USER_CREATED, USER_UPDATED, USER_DELETED} from '../../src/constants/action-types'

describe('users reducer', () => {
  it('should return initial state', () => {
    const state = reducer(undefined, {type: null})

    expect(state).to.deep.equal(Map({create: false, edit: null, list: List()}))
  })

  it('should add new user on USER_CREATED and keep the list sorted', () => {
    const newUser = {login: 'Amy'}
    const oldUser = Map({login: 'Xenia'})
    const oldState = Map({list: List.of(oldUser)})
    const expectedState = Map({list: List.of(Map(newUser), oldUser), create: false})

    const state = reducer(oldState, {type: USER_CREATED, user: newUser})

    expect(state).to.deep.equal(expectedState)
  })

  it('should update a user on USER_UPDATED', () => {
    const updatedUser = {login: 'Amy', role: 'USER'}
    const userToUpdate = Map({login: 'Amy', role: 'ADMIN'})
    const oldState = Map({list: List.of(userToUpdate)})
    const expectedState = Map({list: List.of(Map(updatedUser)), edit: null})

    const state = reducer(oldState, {type: USER_UPDATED, user: updatedUser})

    expect(state).to.deep.equal(expectedState)
  })

  it('should delete a user on USER_DELETED', () => {
    const user = Map({login: 'Amy', role: 'USER'})
    const userToDelete = Map({login: 'Dave', role: 'ADMIN'})
    const oldState = Map({list: List.of(userToDelete, user)})
    const expectedState = Map({list: List.of(user)})

    const state = reducer(oldState, {type: USER_DELETED, login: userToDelete.get('login')})

    expect(state).to.deep.equal(expectedState)
  })
})