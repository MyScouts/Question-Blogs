const Joi = require('@hapi/joi')

const validationBody = (schema) => {
    return (req, res, next) => {
        let validatorResult = schema.validate(req.body)
        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error.details[0].message)
        } else {
            if (!req.value) req.value = {}
            if (!req.value['body']) req.value.body = {}

            req.value.body = validatorResult.value
            next()
        }
    }
}

const validationParams = (schema, name) => {
    return (req, res, next) => {
        let validatorResult = schema.validate({ params: req.params[name] })
        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error.details[0].message)
        } else {
            if (!req.value) req.value = {}
            if (!req.value['params']) req.value.params = {}
            req.value.params[name] = req.params[name]
            next()
        }
    }
}

const validationQuery = (schema, name) => {
    return (req, res, next) => {
        let validatorResult = schema.validate({ query: req.query[name] })
        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error.details[0].message)
        } else {
            if (!req.value) req.value = {}
            if (!req.value['query']) req.value.query = {}

            req.value.query[name] = req.query[name]
            next()
        }
    }
}
const baseSchema = {
    idSchema: Joi.object().keys({
        params: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    page: Joi.object().keys({
        query: Joi.number().integer().min(1).required(),
    }),
    pageSize: Joi.object().keys({
        query: Joi.number().integer().min(1).required(),
    }),
}


module.exports = {
    validationBody,
    validationParams,
    validationQuery,
    baseSchema
}