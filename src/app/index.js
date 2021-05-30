/**
 * We want to start here so we can manage other infrastructure
 * database
 * express server
 */
module.exports = ({
  server,
  database,
  eventService,
  jobSchedulerService,
  logger
}) => {
  return {
    start: () =>
      Promise.resolve()
        .then(database.sequelize.authenticate())
        .then(eventService.initAppEvents())
        .then(eventService.initJobEvents())
        .then(jobSchedulerService.initJobScheduler())
        .then(server.start),
    logger
  }
}
