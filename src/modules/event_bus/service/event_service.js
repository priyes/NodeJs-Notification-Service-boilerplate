import { define } from 'src/containerHelper'
import httpContext from 'express-cls-hooked'
const uuidv4 = require('uuid/v4')
module.exports = define('eventService', ({
  logger,
  eventLogRepository: {
    createEventLog,
    updateEventLog
  },
  eventQueueService: {
    registerPoolingWIthExternalQueue,
    sendEventToExternalQueue
  },
  CustomEvent,
  config: {
    AWS,
    IS_EVENT_SERVICE_ENABLED,
    IS_JOB_EVENT_SERVICE_ENABLED
  },
  constants: {
    EVENT_TYPES
  }
}) => {
  /* -------------------------------------------------------------------------- */
  /*                              Helper Functions                              */
  /* -------------------------------------------------------------------------- */

  const forwardToExternalQueue = async (queueName, eventName, data, opts) => sendEventToExternalQueue(queueName, eventName, data, opts)

  const _saveEvent = async ({ eventName, eventType, eventData, eventDetails }) => {
    const resultSet = await createEventLog({
      eventName,
      eventType,
      eventId: eventData.context.event_id,
      eventData: JSON.stringify(eventData),
      eventDetails: JSON.stringify(eventDetails)
    })
    return resultSet
  }

  const updateEventStatus = async (eventId, isSuccess, errorDetails) => {
    if (!eventId) return false
    const eventEntity = {
      isSuccess
    }
    errorDetails && (eventEntity.errorDetails = JSON.stringify(errorDetails))
    return updateEventLog(eventEntity, eventId)
  }
  const _setContext = (eventName, data) => {
    httpContext.set('event_name', eventName)
    const eventId = uuidv4()
    httpContext.set('event_id', eventId)
    const context = {
      user: httpContext.get('currentuser'),
      request_id: httpContext.get('request_id'),
      event_id: eventId,
      service_name: httpContext.get('serviceKey'),
      function_name: httpContext.get('functionName'),
      api_name: httpContext.get('path'),
      client_ip: httpContext.get('ip_addr'),
      event_name: eventName
    }
    data.context = context
  }

  /* -------------------------------------------------------------------------- */
  /*                             Custom Event Emitter Wrappers                  */
  /* -------------------------------------------------------------------------- */

  /**
   *  In-App Custom Event
   */
  const appEventInstanceWrapper = (() => {
    let _appEventInstance = null
    return ({
      getEventInstance: () => {
        if (_appEventInstance) { return _appEventInstance }
        _appEventInstance = new CustomEvent()
        return _appEventInstance
      },
      getQueueName: () => AWS.SQS.APP_EVENT_SQS_NAME,
      getEventType: () => EVENT_TYPES.IN_APP_EVENT
    })
  })()

  /**
   *  Job Events Custom Event
   */
  const jobEventInstanceWrapper = (() => {
    let _jobEventInstance = null
    return ({
      getEventInstance: () => {
        if (_jobEventInstance) { return _jobEventInstance }
        _jobEventInstance = new CustomEvent()
        return _jobEventInstance
      },
      getQueueName: () => AWS?.SQS?.JOB_SCHEDULER_EVENT_QUEUE,
      getEventType: () => EVENT_TYPES?.JOB_EVENT
    })
  })()

  /* -------------------------------------------------------------------------- */
  /*                               Service Methods                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Generic Subscribe Event Function
   * @param  {eventName[]} eventNameOrEventArray
   * @param  {callback} fn
   * @param  {config} opts
   */
  const subscribeEvent = async function (eventNameOrEventArray, fn, opts) {
    const eventInstance = this.getEventInstance()
    const eventNameArray = Array.isArray(eventNameOrEventArray) ? eventNameOrEventArray : [eventNameOrEventArray]
    if (eventNameArray && eventNameArray.length) {
      Array(...eventNameArray).forEach(async eventName => {
        const handlerOpt = {
          apply: async (...args) => {
            const result = await Reflect.apply(...args)
              .catch(e => {
                logger.info(`eventName :: ${eventName}, args :: ${args} Error:: `, e)
                throw e
              })
            await eventInstance.emit(`${eventName}_DONE`)
            return result
          }
        }
        const pFn = new Proxy(fn, handlerOpt)
        await eventInstance.subscribeEvent(eventName, data => pFn({ eventName, data })).catch(e => {
          logger.info(`Failed to subscribe eventName :: ${eventName}, Error ::`, e)
        })
      })
    }
    return fn
  }

  /**
   * Generic Publish Event Function
   * @param  {} eventName
   * @param  {} data
   * @param  {} opts
   */
  const publishEvent = async function (eventName, data, opts) {
    _setContext(eventName, data)
    const eventInstance = this.getEventInstance()
    const eventType = this.getEventType()
    const resultSet = await _saveEvent({ eventName, eventType, eventData: data, eventDetails: opts })
    logger.info(`Publishing Event :: ${eventName}, Type:: ${this.getEventType}, Data: ${JSON.stringify(data)}, opts: ${opts}`)
    if (opts?.isInternalEvent || !this.getQueueName()) { return eventInstance.publishEvent(eventName, data) }
    const messageReceipt = await forwardToExternalQueue(this.getQueueName(), eventName, data, opts)
    return { messageReceipt, eventId: resultSet?.eventId }
  }

  /**
   * Bind Subscribe Event to AppEvent
   */
  const subscribeToAppEvent = subscribeEvent.bind(appEventInstanceWrapper)

  /**
   * Bind Subscribe Event to JobEvent
   */
  const subscribeToJobEvent = subscribeEvent.bind(jobEventInstanceWrapper)

  /**
   * Bind Publish Event to AppEvent
   */
  const publishAppEvent = publishEvent.bind(appEventInstanceWrapper)
  /**
   * Bind Publish Event to JobEvent
   */
  const publishJobEvent = publishEvent.bind(jobEventInstanceWrapper)

  const executeCommandFromJobQueue = async ({ eventName, data, opts }) => {
    const eventInstance = jobEventInstanceWrapper.getEventInstance()
    if (opts?.executeAllSync) {
      const results = []
      const ListOfListeners = eventInstance.rawListeners(eventName)
      if (ListOfListeners && ListOfListeners.length) {
        for await (const listenerWrapper of ListOfListeners) {
          const result = await listenerWrapper({ eventName, data })
            .catch(async err => {
              logger.error(`${ListOfListeners.length}/${ListOfListeners.indexOf(listenerWrapper) + 1} :: jobEvent eventName ${eventName}, data :: ${JSON.stringify(data)}, Exec Sync Failed with :: fnName :: ${listenerWrapper.name || null} Error :: `, err)
              await updateEventStatus(data?.context?.event_id, false, err)
              throw err
            })
          results.push(result)
        }
        await updateEventStatus(data?.context?.event_id, true)
        return results
      } else {
        logger.warn(`No Listener Registered For ${eventName} in jobEvent`)
        await updateEventStatus(data?.context?.event_id, true)
        return true
      }
    }
    return eventInstance.publishEvent(`${eventName}`, data)
  }
  const executeCommandFromAppEventQueue = async ({ eventName, data, opts }) => {
    const eventInstance = appEventInstanceWrapper.getEventInstance()
    if (opts?.executeAllSync) {
      const results = []
      const ListOfListeners = eventInstance.rawListeners(eventName)
      if (ListOfListeners && ListOfListeners.length) {
        for await (const listenerWrapper of ListOfListeners) {
          const result = await listenerWrapper({ eventName, data })
            .catch(async err => {
              logger.error(`${ListOfListeners.length}/${ListOfListeners.indexOf(listenerWrapper) + 1} :: AppEvent eventName ${eventName}, data :: ${JSON.stringify(data)}, Exec Sync Failed with :: fnName :: ${listenerWrapper.name || null} Error :: `, err)
              await updateEventStatus(data?.context?.event_id, false, err)
              throw err
            })
          await updateEventStatus(data?.context?.event_id, true)
          logger.info(` Successfully Consumed ${eventName}`)
          results.push(result)
        }
        return results
      } else {
        logger.warn(`No Listener Registered For ${eventName} App Event`)
      }
    }
    return eventInstance.publishEvent(`${eventName}`, data)
  }

  /**
   * Initialize Event Service
   */
  const initAppEvents = async () => {
    if (IS_EVENT_SERVICE_ENABLED && IS_EVENT_SERVICE_ENABLED === 'true') {
      return registerPoolingWIthExternalQueue(executeCommandFromAppEventQueue, appEventInstanceWrapper.getEventInstance())
    }
  }
  const initJobEvents = async () => {
    if (IS_JOB_EVENT_SERVICE_ENABLED && IS_JOB_EVENT_SERVICE_ENABLED === 'true') {
      return registerPoolingWIthExternalQueue(executeCommandFromJobQueue, jobEventInstanceWrapper.getEventInstance())
    }
  }

  return {
    subscribeToAppEvent,
    subscribeToJobEvent,
    publishAppEvent,
    publishJobEvent,
    initAppEvents,
    initJobEvents
  }
})
