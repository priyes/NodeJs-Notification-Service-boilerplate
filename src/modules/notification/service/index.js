import {
  define
} from 'src/containerHelper'
module.exports = define('notificationService', ({
  notificationConfigRepository,
  logger,
  constants: {
    EVENT_TYPES: {
      NOTIFICATION_EVENT
    }
  },
  eventService: {
    publishAppEvent,
    subscribeToAppEvent
  }
}) => {
  /* -------------------------------------------------------------------------- */
  /*                               Private Methods                              */
  /* -------------------------------------------------------------------------- */

  const _publishNotificationToChannel = (listOfNotifications, data) => {
    return Promise.allSettled(listOfNotifications.map(async (notificationConfig) => {
      publishAppEvent(notificationConfig.channelName, data)
    }))
  }

  /* -------------------------------------------------------------------------- */
  /*                               Service Methods                              */
  /* -------------------------------------------------------------------------- */

  const sendNotification = async ({ eventName, data }) => {
    try {
      const { notificationName, notificationData } = data
      const listOfNotifications = notificationConfigRepository.getAllNotificationConfig({ notificationName })

      if (!listOfNotifications.length) return logger.warn(` No Notification Configured For notificationName: ${notificationName}`)

      return _publishNotificationToChannel(listOfNotifications, notificationData)
    } catch (error) {
      logger.error(` Error in ${eventName} :: data ${JSON.stringify(data)} `, error)
    }
  }

  return {
    sendNotification: subscribeToAppEvent(NOTIFICATION_EVENT, sendNotification)
  }
})
