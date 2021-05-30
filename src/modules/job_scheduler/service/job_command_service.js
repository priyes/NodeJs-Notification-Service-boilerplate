import { define } from 'src/containerHelper'
module.exports = define('jobCommandService', ({
  logger,
  eventService: {
    publishJobEvent,
    subscribeToJobEvent
  }
}) => {
  const sendCommand = async (eventCommand, params) => {
    try {
      await publishJobEvent(eventCommand, params)
    } catch (error) {
      logger.error(`${eventCommand} :: ERROR :: `, error)
    }
  }
  /**
   * Test Job Event
   * Uncomment after running migration
   */
  // subscribeToJobEvent('hello_world_event', async (eventName, data) => { console.log(eventName, data) })

  return {
    sendCommand
  }
})
