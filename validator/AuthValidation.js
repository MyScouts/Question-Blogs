let Joi = require('@hapi/joi')
// conhtent
let authSchemas = {
    signUp: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        phoneNumber: Joi.string().min(10).max(10).regex(/[{0,1}[0-9]{9}]*$/),
        roles: Joi.string().default('student').valid('student', 'teacher')
    }),

    signIn: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
    }),

    changePassword: Joi.object().keys({
        oldPassword: Joi.string().min(8).required(),
        newPassword: Joi.string().min(8).required(),
        confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required(),
    }),
}

module.exports = authSchemas