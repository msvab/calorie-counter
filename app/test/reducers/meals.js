'use strict'
import {expect} from 'chai'
import {Map, List} from 'immutable'
import '../test-helper'
import reducer from '../../src/reducers/meals'
import {MEAL_CREATED, MEAL_UPDATED, MEAL_DELETED, MEALS_FILTERED} from '../../src/constants/action-types'

describe('meals reducer', () => {
  it('should return initial state', () => {
    const state = reducer(undefined, {type: null})

    expect(state).to.deep.equal(Map({
      create: false,
      edit: false,
      list: List(),
      filteredList: List(),
      filter: Map({fromDate: null, toDate: null, fromTime: null, toTime: null}),
      todaysCalories: 0
    }))
  })

  it('should add new meal on MEAL_CREATED and keep the list sorted', () => {
    const newMeal = {name: 'cake', date: '2008-09-22', time: '12:00', calories: 200}
    const oldMeal = Map({name: 'cookie', date: '2008-10-22', time: '12:00', calories: 300})
    const oldState = Map({list: List.of(oldMeal)})
    const expectedState = Map({list: List.of(Map(newMeal), oldMeal), create: false, todaysCalories: 0})

    const state = reducer(oldState, {type: MEAL_CREATED, meal: newMeal})

    expect(state).to.deep.equal(expectedState)
  })

  it('should update a meal on MEAL_UPDATED and keep the list sorted', () => {
    const updatedMeal = {name: 'cake', date: '2008-09-22', time: '12:00', calories: 200}
    const mealToUpdate = Map({login: 'cookie', date: '2016-09-22', time: '11:00', calories: 300})
    const oldState = Map({list: List.of(mealToUpdate)})
    const expectedState = Map({list: List.of(Map(updatedMeal)), edit: null, todaysCalories: 0})

    const state = reducer(oldState, {type: MEAL_UPDATED, meal: updatedMeal})

    expect(state).to.deep.equal(expectedState)
  })

  it('should delete a meal on MEAL_DELETED', () => {
    const meal = Map({name: 'cake', date: '2008-09-22', time: '12:00', calories: 250})
    const mealToDelete = Map({name: 'cookie', date: '2008-09-22', time: '12:00', calories: 300})
    const oldState = Map({list: List.of(mealToDelete, meal)})
    const expectedState = Map({list: List.of(meal), todaysCalories: 0})

    const state = reducer(oldState, {type: MEAL_DELETED, id: mealToDelete.get('id')})

    expect(state).to.deep.equal(expectedState)
  })
})