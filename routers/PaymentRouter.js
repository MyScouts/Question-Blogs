const router = require("express-promise-router")()
const passport = require('passport')
const passportConfig = require('../middleware/passport');
const paymentController = require("../controllers/paymentController");
const { validationBody, validationParams, baseSchema } = require("../validator");
const paymentSchema = require("../validator/payment");


// 
router.route('/get-all')
    .get(
        passport.authenticate('jwt', { session: false }),
        paymentController.paymentsMethod
    )

router.route("/")
    .post(
        passport.authenticate('jwt', { session: false }),
        validationBody(paymentSchema.newPayment),
        paymentController.newPaymentMethod
    )

router.route('/:paymentId')
    .put(
        passport.authenticate('jwt', { session: false }),
        validationParams(baseSchema.idSchema, "paymentId"),
        validationBody(paymentSchema.newPayment), paymentController.updatePaymentMethod
    )
    .delete(
        passport.authenticate('jwt', { session: false }),
        validationParams(baseSchema.idSchema, "paymentId"),
        paymentController.deletePaymentMethod
    )

router.route('/history')
    .get(
        passport.authenticate('jwt', { session: false }),
        paymentController.paymentHistory
    )

// module.exports = router
module.exports = router