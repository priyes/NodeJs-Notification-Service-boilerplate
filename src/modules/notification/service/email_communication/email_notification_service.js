import {
  define
} from 'src/containerHelper'
module.exports = define('emailNotificationService', ({
  dummyEmailServiceProvider,
  logger,
  constants: {
    NOTIFICATION_TYPES: {
      EMAIL_NOTIFICATION
    },
    RUNTIME_ERROR
  },
  eventService: {
    publishAppEvent,
    subscribeToAppEvent
  }
}) => {
  /* -------------------------------------------------------------------------- */
  /*                               Service Methods                              */
  /* -------------------------------------------------------------------------- */

  const sendEmailNotification = async ({ eventName, data }) => {
    try {
      const { notificationData } = data
      // TODO: Handle Multiple Email service Provider in switch case eg. by country code in data
      const response = await dummyEmailServiceProvider.sendEmail(notificationData)
      return response
    } catch (error) {
      logger.error(` Error in ${eventName} :: data ${JSON.stringify(data)} `, error)
    }
  }

  return {
    sendNotification: subscribeToAppEvent(EMAIL_NOTIFICATION, sendEmailNotification)
  }
})
