'use strict'
import {patchJson} from './request-utils'
import {SHOW_EDIT_DAILY_LIMIT, DAILY_LIMIT_CHANGED} from './types'

export const showEditDailyLimit = () => ({type: SHOW_EDIT_DAILY_LIMIT})
export const dailyLimitChanged = limit => ({type: DAILY_LIMIT_CHANGED, limit})

export function setDailyLimit(login, limit) {
  return async function(dispatch) {
    const response = await patchJson(`/api/users/${login}`, {login: login, maxDailyCalories: limit})

    if (response.ok) {
      dispatch(dailyLimitChanged(limit))
    }
  };
}