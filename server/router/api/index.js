const routes = require('express').Router()
  , signups = require('./signups')
  , meals = require('./meals')
  , notification = require('./notification')
  , mail = require('./mail')
  , user = require('./user')
  , github = require('./github')
  , controller = require(process.env.FOOD_HOME + 'router/controller/update')
  , error = require(process.env.FOOD_HOME + 'modules/error');

routes.use('/github', github);

routes.get('/update',
  error.router.validate('query', {
    version: /^[0-9]{0,100}$/
  }),
  controller.update
);

routes.use('/signups', signups);
routes.use('/meals', meals);
routes.use('/user', user);
routes.use('/mail', mail);
routes.use('/notification', notification);

module.exports = routes;
