import userSchemas from './user_schema.js'
const schema = {
  post: {
    '/V1/users': {
      baseSchema: userSchemas.createUser,
      authRequired: false
    }
  }

  // put: {

  // },
  // get: {

  // }
}

module.exports = schema
