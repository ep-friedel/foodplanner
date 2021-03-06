let stash = [],
  stashTimer

const gmail = require('gmail-send'),
  error = require(process.env.FOOD_HOME + 'modules/error'),
  log = require(process.env.FOOD_HOME + 'modules/log'),
  userDb = require(process.env.FOOD_HOME + 'modules/db/user'),
  signupsDb = require(process.env.FOOD_HOME + 'modules/db/signups'),
  instanceDb = require(process.env.FOOD_HOME + 'modules/db/instance'),
  caches = require(process.env.FOOD_HOME + 'modules/cache'),
  deadlineReminder = require(process.env.FOOD_HOME + 'modules/mailer/deadlineReminder.tmpl.js'),
  newPassword = require(process.env.FOOD_HOME + 'modules/mailer/newPassword.tmpl.js'),
  generateNewPassword = require(process.env.FOOD_HOME + 'modules/mailer/generateNewPassword.tmpl.js'),
  creationNotice = require(process.env.FOOD_HOME + 'modules/mailer/creationNotice.tmpl.js'),
  creationNotice_df = require(process.env.FOOD_HOME + 'modules/mailer/creationNotice_datefinder.tmpl.js'),
  mail = async (tmpl, cb, user, type, instanceId) => {
    try {
      const {sendEmail, instance} = await getMailer(instanceId)

      const instanceUrl =
        process.env.FOOD_EXTERNAL === 'localhost'
          ? `http://localhost:${process.env.FOOD_PORT}/${instance.id}/`
          : `https://${instance.subdomain}.${process.env.FOOD_EXTERNAL.split(/\.(.+)/)[1]}/`

      stash.push({ tmpl, cb, user, type })
      if (!stashTimer) {
        stashTimer = setInterval(() => {
          let mail = stash.shift()

          sendEmail(mail.tmpl(instanceUrl), err => {
            if (!err) {
              log(5, `sent ${mail.type}-mail to ${mail.user}`)
            }
            mail.cb(err)
          })

          if (!stash.length) {
            clearInterval(stashTimer)
            stashTimer = false
          }
        }, 1000)
      }
    } catch (err) {
      log(3, 'error getting mailer', err)
    }
  }

let mailerCache = caches.getCache('mailer')

const getMailer = async instanceId => {
  let mailerObj = mailerCache.get(instanceId)

  if (!mailerObj) {
    const instance = await instanceDb.getInstanceById(instanceId)

    if (instance.gmail_pass && instance.gmail_user) {
      let mailer = gmail({ user: instance.gmail_user, pass: instance.gmail_pass })

      mailerObj = { sendEmail: mailer, instance }
      mailerCache.put(instanceId, mailerObj)
    } else {
      return {instance: null, sendEmail: () => log(5, `Did not send mail for instance ${instanceId} due to missing login data`)}
    }
  }

  return mailerObj
}

module.exports = {
  sendDeadlineReminder(meal) {
    let signupsAvailable = Promise.resolve()

    if (meal.signupLimit) {
      signupsAvailable = signupsDb.getSignupsByProperty('meal', meal.id).then(result => {
        if (result.length === meal.signupLimit) {
          log(5, 'meal full - not sending reminder')
          return Promise.reject()
        }
      })
    }

    signupsAvailable
      .then(() => userDb.getUnsignedUsersByProperty(meal.id, 'deadlineReminder', 1))
      .then(data => {
        if (data.length) {
          data.forEach(user =>
            mail(deadlineReminder(user, meal), error.checkError(3, 'Error sending deadline reminder.'), user.name, 'deadlineReminder', meal.instance),
          )
        }
      })
      .catch(error.promise(4, 'error sending deadline mails'))
  },
  sendCreationNotice(instance, meal) {
    log(6, 'sending creation notice for meal ' + meal.name)
    userDb
      .getUsersByProperty(instance, 'creationNotice', 1)
      .then(data => {
        if (data.length) {
          data.forEach(user =>
            mail(
              meal.datefinder ? creationNotice_df(user, meal) : creationNotice(user, meal),
              error.checkError(3, 'Error sending creation notice.'),
              user.name,
              'creationNotice',
              meal.instance,
            ),
          )
        } else {
          log(6, 'no users found', data)
        }
      })
      .catch(error.promise(4, 'error sending creation mails'))
  },
  validateLoginData({ gmail_user, gmail_pass }) {
    return new Promise((resolve, reject) => {
      gmail({
        user: gmail_user,
        pass: gmail_pass,
      })(
        {
          to: gmail_user,
          subject: 'test subject',
          text: 'gmail-send example 1',
        },
        err => {
          if (err) {
            log(5, 'mail validation failed due to error: ', err)
            return resolve(false)
          }
          if (!err) return resolve(true)
        },
      )
    })
  },
  sendNewPassMail: (user, pass) => {
    mail(newPassword(user, pass), error.checkError(2, 'Error sending new password.'), user.name, 'newPassword', user.instance)
  },
  sendGenerateNewPassMail: (user, token) => {
    instanceDb.getInstanceById(user.instance)

    mail(generateNewPassword(user, token), error.checkError(2, 'Error sending new password.'), user.name, 'generateNewPassword', user.instance)
  },
}
