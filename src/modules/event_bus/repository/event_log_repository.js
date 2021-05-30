import {
  define
} from 'src/containerHelper'

module.exports = define('eventLogRepository', ({
  database
}) => {
  const EventLog = database['event_log']
  const getAllEventLogs = async () => EventLog.findAll({
    where: {
      attributes: ['id', 'eventName', 'eventName', 'eventDeatils', 'eventData']
    }
  })
  const getLogByEventName = async name => EventLog.findAll({
    where: {
      name
    }
  })
  const createEventLog = async eventEntity => EventLog.create(eventEntity)
  const updateEventLog = async (eventEntity, id) => EventLog.update(eventEntity, {
    where: {
      id
    }
  })
  return {
    getAllEventLogs,
    getLogByEventName,
    createEventLog,
    updateEventLog
  }
})
