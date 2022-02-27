let Joi = require('@hapi/joi')


const paymentSchema = {
    newPayment: Joi.object().keys({
        cardExpiration: Joi.string().required().regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/),
        cardNumber: Joi.string().required().regex(/^[0-9]{16}$/),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        method: Joi.string().required(),
        securityCode: Joi.string().required().regex(/^[0-9]{3}$/),
    }),
}

module.exports = paymentSchema