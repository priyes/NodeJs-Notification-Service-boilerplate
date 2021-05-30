import {
  define
} from 'src/containerHelper'

module.exports = define('notificationConfigRepository', ({
  database
}) => {
  const notificationConfig = database['notification_config']

  const getAllNotificationConfig = async whereClause => notificationConfig.findAll({
    where: { isActive: 1, ...whereClause }
  })

  const createNotificationConfig = async notificationConfigEntity => notificationConfig.create(notificationConfigEntity)

  const updateNotificationConfig = async (notificationConfigEntity, id) => notificationConfig.update(notificationConfigEntity, {
    where: {
      id
    }
  })

  return {
    getAllNotificationConfig,
    createNotificationConfig,
    updateNotificationConfig
  }
})
