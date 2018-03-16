const routes = require('express').Router(),
  unsubscribe = require(process.env.FOOD_HOME + 'router/controller/unsubscribe'),
  staticRouter = require('./static'),
  instance = require('./instance'),
  api = require('./api'),
  bodyparser = require('body-parser'),
  compression = require('compression'),
  xssFilter = require('x-xss-protection'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  timestamp = require(process.env.FOOD_HOME + 'middleware/timestamp'),
  admin = require(process.env.FOOD_HOME + 'router/controller/index').administration,
  logger = require(process.env.FOOD_HOME + 'middleware/logger')

routes.use(bodyparser.json())
routes.use(bodyparser.urlencoded({ extended: true }))
routes.use(compression())
routes.use(xssFilter())
routes.use(timestamp)
routes.use(logger)

routes.use(staticRouter)

routes.use(instance)

routes.use(jwt.checkToken)
routes.use('/api', api)

// fallback for direct usage without subdomain
routes.get('/unsubscribe', unsubscribe)

// catch-all
routes.get('*', admin)
routes.all('*', (req, res) => res.status(404).json({ error: 'Unknown Route' }))

module.exports = routes
