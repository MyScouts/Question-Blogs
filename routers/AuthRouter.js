const router = require('express-promise-router')()
const passport = require('passport')
const AuthController = require('../controllers/AuthController')
const passportConfig = require('../middleware/passport')
const { validationBody } = require('../validator')
const authSchemas = require('../validator/AuthValidation')

//
router.route('/register')
    .post(validationBody(authSchemas.signUp), AuthController.registerMethod)

router.route('/login')
    .post(validationBody(authSchemas.signIn), AuthController.loginMethod)

module.exports = router