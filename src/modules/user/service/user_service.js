import {
  define
} from 'src/containerHelper'
module.exports = define('userService', ({
  userRepository,
  notificationService,
  emailNotificationService,
  constants: {
    events: {
      user: {
        USER_REGISTERED,
        USER_UPDATED
      }
    }
  },
  notificationGatewayService: {
    sendNotificationCommand
  }
}) => {
  /* -------------------------------------------------------------------------- */
  /*                               Private Methods                              */
  /* -------------------------------------------------------------------------- */

  const _publishUserRegisteredEvent = userEntity => sendNotificationCommand(USER_REGISTERED, userEntity)
  const _publishUserUpdatedEvent = userEntity => sendNotificationCommand(USER_UPDATED, userEntity)

  /* -------------------------------------------------------------------------- */
  /*                               User Service Methods                         */
  /* -------------------------------------------------------------------------- */

  const createUser = async userEntity => {
    const response = await userRepository.createUser(userEntity)
    await _publishUserRegisteredEvent(response)
    return response
  }

  const updateUser = async (userEntity, id) => {
    const response = await userRepository.updateUser(userEntity, id)
    await _publishUserUpdatedEvent(response)
    return response
  }

  return {
    createUser,
    updateUser
  }
})
