const router = require('express-promise-router')()
const passport = require('passport')
const passportConfig = require('../middleware/passport')
const { validationBody } = require('../validator')
const notificationController = require('../controllers/NotificationController')
//
router.route('/me')
    .get(passport.authenticate('jwt', { session: false }), notificationController.getMyNotificationsMethod)

router.route('/:notificationId')
    .put(passport.authenticate('jwt', { session: false }), notificationController.makeReadNotificationMethod)
    .delete(passport.authenticate('jwt', { session: false }), notificationController.deleteNotificationMethod)
module.exports = router