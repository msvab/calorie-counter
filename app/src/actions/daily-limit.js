'use strict'
import {patchJson} from '../utils/request'

export const SHOW_EDIT_DAILY_LIMIT = 'daily-limit/SHOW_EDIT'
export const DAILY_LIMIT_CHANGED = 'daily-limit/CHANGED'

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