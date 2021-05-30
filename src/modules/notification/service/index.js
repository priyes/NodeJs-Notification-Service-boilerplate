import {
  define
} from 'src/containerHelper'
module.exports = define('notificationService', ({
  notificationConfigRepository,
  logger,
  constants: {
    EVENT_TYPES: {
      NOTIFICATION_EVENT
    },
    NOTIFICATION_CHANNELS: {
      EMAIL,
      SMS
    },
    NOTIFICATION_TYPES: {
      EMAIL_NOTIFICATION,
      SMS_NOTIFICATION
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

  const _mapChannelToNotificationEvent = channelName => {
    switch (channelName) {
      case EMAIL:
        return EMAIL_NOTIFICATION
      case SMS:
        return SMS_NOTIFICATION
      default:
        return null
    }
  }

  const _publishNotificationToChannel = async (listOfNotifications, data) => {
    return Promise.allSettled(listOfNotifications.map(async notificationConfig => {
      const notificationEventName = _mapChannelToNotificationEvent(notificationConfig.notificationChannel)
      notificationEventName && await publishAppEvent(notificationEventName, data)
    }))
  }

  /* -------------------------------------------------------------------------- */
  /*                               Service Methods                              */
  /* -------------------------------------------------------------------------- */

  const sendNotification = async ({ eventName, data }) => {
    try {
      const { notificationName, notificationData } = data
      const listOfNotifications = await notificationConfigRepository.getAllNotificationConfig({ notificationName })
      if (!listOfNotifications.length) return logger.warn(` No Notification Configured For notificationName: ${notificationName}`)
      await _publishNotificationToChannel(listOfNotifications, notificationData)
    } catch (error) {
      logger.error(` Error in ${eventName} :: data ${JSON.stringify(data)} `, error)
    }
  }
  // sendNotification({ eventName: 'USER_REGISTERED', data: { } })
  return {
    sendNotification: subscribeToAppEvent(NOTIFICATION_EVENT, sendNotification)
  }
})
