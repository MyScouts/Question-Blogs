const Joi = require('@hapi/joi');

const postSchemas = {
    createPost: Joi.object().keys({
        content: Joi.string().required(),
        subject: Joi.string().required(),
        grade: Joi.number().integer().valid(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12).required(),
        level: Joi.number().required(),
        status: Joi.number().required(),
        price: Joi.number().required(),
        couponId: Joi.string().allow(null),
    }),
}

// module.exports = postSchema;
module.exports = postSchemas;