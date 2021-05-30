import Joi from '@hapi/joi'

module.exports = {
  createUser: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    dialCode: Joi.string().required(),
    mobile: Joi.string().required(),
    countryCode: Joi.string().required()
  })
}
