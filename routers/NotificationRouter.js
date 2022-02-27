const router = require('express-promise-router')()
const passport = require('passport')
const passportConfig = require('../middleware/passport')
const { validationBody } = require('../validator')
const notificationController = require('../controllers/NotificationController')
//
router.route('/me')
    .get(passport.authenticate('jwt', { session: false }), notificationController.getMyNotificationsMethod)
module.exports = router