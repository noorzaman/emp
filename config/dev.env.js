'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CALENDAR_API: '"http://development.6awinxwfj9.us-east-1.elasticbeanstalk.com"'
})
