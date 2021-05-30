import {
  define
} from 'src/containerHelper'
import R from 'ramda'
module.exports = define('notificationGatewayService', ({
  CustomError,
  eventService: {
    publishAppEvent
  },
  constants
}) => {
  /* -------------------------------------------------------------------------- *
  /*                               Error Wrappers                               */
  /* -------------------------------------------------------------------------- */

  const _getInvalidNotificationName = _ => new CustomError(constants.RUNTIME_ERROR.code, constants.RUNTIME_ERROR.status, 'Invalid Notification Name')
  const _getInvalidNotificationData = _ => new CustomError(constants.RUNTIME_ERROR.code, constants.RUNTIME_ERROR.status, 'Data is empty')
  const _getInvalidTriggerType = _ => new CustomError(constants.RUNTIME_ERROR.code, constants.RUNTIME_ERROR.status, 'Invalid Trigger Type')

  /* -------------------------------------------------------------------------- */
  /*                               Private Methods                              */
  /* -------------------------------------------------------------------------- */

  const _validateNotificationCommand = async (notificationName, data, triggerType = 'EVENT') => {
    if (!notificationName) throw _getInvalidNotificationName()
    if (R.isEmpty(data)) throw _getInvalidNotificationData()
    if (!triggerType) throw _getInvalidTriggerType()
  }

  const _publishNotificationCommand = async (data) => publishAppEvent(constants.EVENT_TYPES.NOTIFICATION_EVENT, data)

  /* -------------------------------------------------------------------------- */
  /*                               Service Methods                              */
  /* -------------------------------------------------------------------------- */

  /**
   * @param  {string} notificationCommand
   * @param  {object} data
   * @param  {string} triggerType
   */
  const sendNotificationCommand = async (notificationName, data = {}, triggerType = 'EVENT') => {
    _validateNotificationCommand(notificationName, data, triggerType)

    return _publishNotificationCommand({
      notificationName,
      notificationData: data,
      triggerType
    })
  }

  return {
    sendNotificationCommand
  }
})
