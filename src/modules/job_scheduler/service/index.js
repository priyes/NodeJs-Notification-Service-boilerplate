import {
  define
} from 'src/containerHelper'
import moment from 'moment'
const CronJob = require('cron').CronJob
const cronMap = new Map()
module.exports = define('jobSchedulerService', ({
  jobCommandService,
  logger,
  jobSchedulerRepository
}) => {
  const jobService = async function () {
    try {
      const allJobs = await jobSchedulerRepository.getAllJobs()
      if (allJobs.length > 0) {
        const promisesResult = await Promise.allSettled(allJobs.map(async job => {
          try {
            job = job.get({ plain: true })

            cronMap.has(job.jobName) &&
              moment(job.updated_at).diff(moment(cronMap.get(job.jobName).jobConfig.updated_at)) &&
              cronMap.get(job.jobName).jobCronInstance.stop() &&
              logger.info(`Cron Job stopped ${job.jobName}`)

            if ((!cronMap.has(job.jobName) || (cronMap.has(job.jobName) && !cronMap.get(job.jobName).jobCronInstance.running)) && job.isActive) {
              const parameters = job.parameters ? JSON.parse(job.parameters) : {}
              const jobCronInstance = new CronJob(job.pattern, () => jobCommandService.sendCommand(job.eventCommand, parameters))
              cronMap.set(job.jobName, {
                name: job.name,
                jobCronInstance: jobCronInstance,
                jobConfig: job
              })
              return jobCronInstance.start()
            }

            logger.info(`${job.jobName} is not running/Inactive`)
          } catch (error) {
            logger.error(` ERROR INIT JOB ${JSON.stringify(job)} !! ::`, error)
            throw error
          }
        }))
        return logger.info(`promisesResult :: ${JSON.stringify(promisesResult)}`)
      }
      logger.info(` NO JOBS SCHEDULED !`)
      return
    } catch (error) {
      logger.error(` ERROR INIT JOB SCHEDULER !! :: `, error)
    }
  }

  const initJobScheduler = async () => {
    logger.info('System Job Schedular')
    if (process.env.IS_SYSTEM_JOB_SCHEDULAR_ENABLED && process.env.IS_SYSTEM_JOB_SCHEDULAR_ENABLED === 'true') {
      const job1 = new CronJob('0 * * * * *', async () => {
        await jobService()
      })
      return job1.start()
    }
    logger.info(` JOBS SCHEDULER NOT ENABLED!`)
  }
  return {
    initJobScheduler
  }
})
