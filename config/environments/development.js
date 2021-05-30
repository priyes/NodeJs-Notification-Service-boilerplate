module.exports = {
  version: process.env.APP_VERSION,
  timezone: process.env.TIMEZONE,
  port: process.env.PORT,
  logging: {
    maxsize: 100 * 1024, // 100mb
    maxFiles: 2,
    colorize: false
  },
  authSecret: process.env.SECRET,
  authSession: {
    session: false
  },
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  AWS: {
    SQS: {
      APP_EVENT_SQS_NAME: process.env.APP_EVENT_SQS_NAME,
      JOB_SCHEDULER_EVENT_QUEUE: process.env.JOB_SCHEDULER_EVENT_QUEUE
    }
  }
}
