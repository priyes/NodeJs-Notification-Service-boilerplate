import { define } from 'src/containerHelper'

module.exports = define('eventQueueService', ({
  logger,
  awsService
}) => {
  /**
   * @param  {function} eventCommandExecuter
   * @param  {object} config
   */
  const registerPoolingWIthExternalQueue = async (eventCommandExecuter, config) => awsService.registerSQSPooling(eventCommandExecuter, config)

  /**
   * @param  {string} queueName
   * @param  {string} eventName
   * @param  {object} data
   * @param  {object} opts
   */
  const sendEventToExternalQueue = async (queueName, eventName, data, opts) => awsService.sendToQueue(queueName, { eventName, data }, opts)

  return {
    registerPoolingWIthExternalQueue,
    sendEventToExternalQueue
  }
})
