const signupsDB = require(process.env.FOOD_HOME + 'modules/db/signups')
  , paymentDB = require(process.env.FOOD_HOME + 'modules/db/payment')
  , mealsDB = require(process.env.FOOD_HOME + 'modules/db/meals')
  , error = require(process.env.FOOD_HOME + 'modules/error')
  , caches = require(process.env.FOOD_HOME + 'modules/cache')
  , log = require(process.env.FOOD_HOME + 'modules/log');

let signupCache = caches.getCache('signups'),
  mealCache = caches.getCache('meals'),
  updateCache = caches.getCache('update'),
  userCache = caches.getCache('users'),
  userListCache = caches.getCache('userList');


const validatePrices = (priceList) => {
  return priceList.filter((price) => {
    if (!(
      ['meals', 'mealOptions', 'mealOptionValues'].includes(price.db)
      && error.validation.isNumber(price.id)
      && error.validation.isFloat(price.price)
    )) {
      return true;
    }
    return false;
  });
}

const validateUserCreator = (meal, user) => {
  return mealsDB.getMealById(meal)
    .then(meal => {
      if (meal.creatorId == user) {
        return Promise.resolve();
      } else {
        log(4, `User ${user} tried to set prices for meal ${meal} without being the creator.`);
        return Promise.reject({ status: 403, type: 'FORBIDDEN' });
      }
    });
}


module.exports = {
  setSignupPaymentStatus: (state) => (req, res) => {
    signupCache.delete(req.params.id);
    signupCache.delete('allSignups');
    updateCache.deleteAll();

    mealsDB.getMealCreatorBySignupId(req.params.id)
      .then(id => {
        if (id == req.user.id) {
          return signupsDB.setSignupPaymentStatusById(req.params.id, state);
        } else {
          log(4, `User ${req.user.id} tried to update signup ${req.params.id} without being the creator.`);
          return Promise.reject({ status: 403, type: 'FORBIDDEN' });
        }
      })
      .then((signup) => {
        res.status(200).send({ success: true });
      })
      .catch(error.router.internalError(res));
  },

  lockMeal: (req, res) => {
    const invalidElements = validatePrices(req.body.prices)

    if (invalidElements.length) {
      log(4, 'PriceArray not valid.');
      return res.status(400).send({ msg: 'Options not valid.', type: 'Invalid_Request', data: [JSON.stringify(invalidElements)] });
    }

    mealCache.delete(req.params.id);
    mealCache.delete('allMeals');
    signupCache.deleteAll();
    updateCache.deleteAll();
    userListCache.deleteAll();
    userCache.deleteAll();

    validateUserCreator(req.params.id, req.user.id)
      .then(() => paymentDB.setPrices(req.body.prices))
      .then(() => paymentDB.lockMealPrices(req.params.id))
      .then(() => paymentDB.getEligibleSignups(req.params.id))
      .then((eligibleSignups) => Promise.all(
        eligibleSignups.map(
          signup => paymentDB.payForSignup(signup.id)
            .then(res => Promise.resolve({ error: false, data: res }),
            err => Promise.resolve({ error: true, data: err })
            )
        )
      ))
      .then(results => log(6, results.filter(res => res.error).length + ' payments of ' + results.length + ' possible payments failed.'))
      .then(() => paymentDB.getPricesByMeal(req.params.id))
      .then(result => res.status(200).send(result))
      .catch(error.router.internalError(res));
  },

  savePrices: (req, res) => {
    const invalidElements = validatePrices(req.body.prices)

    if (invalidElements.length) {
      log(4, 'PriceArray not valid.');
      return res.status(400).send({ msg: 'Options not valid.', type: 'Invalid_Request', data: [JSON.stringify(invalidElements)] });
    }

    mealCache.delete(req.params.id);
    mealCache.delete('allMeals');
    updateCache.deleteAll();

    validateUserCreator(req.params.id, req.user.id)
      .then(() => paymentDB.setPrices(req.body.prices))
      .then(result => res.status(200).send(result))
      .catch(error.router.internalError(res));
  }
}

