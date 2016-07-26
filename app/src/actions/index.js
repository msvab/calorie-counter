'use strict'

import * as users from './users'
import * as meals from './meals'
import * as dailyLimit from './daily-limit'

export default {...users, ...meals, ...dailyLimit}