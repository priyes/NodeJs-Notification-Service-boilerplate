const { Router } = require('express')
const Status = require('http-status')
const container = require('../../../container')

module.exports = () => {
  const router = Router()
  const { userService, userContextMiddleware, logger, response: { Success } } = container.cradle

  router.post('/', userContextMiddleware, async (req, res, next) => {
    try {
      const { body } = req
      logger.info(`Create User :: ${JSON.stringify(body)}`)
      const user = await userService.createUser(body)
      res.status(Status.OK).json(await Success(user))
    } catch (e) {
      next(e)
    }
  })

  return router
}
