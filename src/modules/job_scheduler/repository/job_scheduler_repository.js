import {
  define
} from 'src/containerHelper'

module.exports = define('jobSchedulerRepository', ({
  database
}) => {
  const CronJob = database['job_scheduler']

  const create = async cronObject => CronJob.create(cronObject)

  const update = async (cronObject, id) =>
    CronJob.update(cronObject, {
      where: {
        id
      }
    })

  const findByJobName = async name => CronJob.findOne({
    where: {
      name
    }
  })

  const findById = async id => CronJob.findOne({
    where: {
      id
    }
  })

  const getAllJobs = async () => CronJob.findAll({
    where: {
      isActive: true
    },
    attributes: ['id', 'jobName', 'pattern', 'eventCommand', 'isActive', 'parameters', 'updated_at']
  })

  return {
    findByJobName,
    findById,
    getAllJobs,
    create,
    update
  }
})
