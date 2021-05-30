import { errorCodes } from './error_codes'
const events = require('./event_list')

const environments = {
  DEVELOPMENT: 'development',
  TEST: 'test',
  PRODUCTION: 'production'
}

const HASH_ROUND = 10
const TOKEN_EXPIRATION = '7d' // 86400 // expires in 24 hours

const EVENT_TYPES = {
  IN_APP_EVENT: 'APP_EVENT',
  JOB_EVENT: 'JOB_EVENT',
  NOTIFICATION_EVENT: 'NOTIFICATION_EVENT'
}

const NOTIFICATION_TYPES = {
  EMAIL_NOTIFICATION: 'EMAIL_NOTIFICATION',
  SMS_NOTIFICATION: 'EMAIL_NOTIFICATION'
}
module.exports = {
  events,
  ...errorCodes,
  ...environments,
  HASH_ROUND,
  TOKEN_EXPIRATION,
  EVENT_TYPES,
  NOTIFICATION_TYPES
 
}
