'use strict'
const _ = require('lodash')

module.exports = function printRoutes(router) {
  let actions = _(router.stack)
      .sortBy('path')
      .groupBy('path')
      .mapValues(actions =>  actions.map(a => a.methods).reduce((all, next) => all.concat(next), []))
      .toPairs()
      .map(pair => `${pair[0]} (${pair[1]})`)
      .value()
  console.log('============ API ============')
  actions.forEach(line => console.log(line))
  console.log('\n')
}