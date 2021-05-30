import statusMonitor from 'express-status-monitor'
import cors from 'cors'
import { json, urlencoded } from 'body-parser'
import compression from 'compression'
import { Router } from 'express'
import controller from './utils/create_controller'
import httpContext from 'express-cls-hooked'
import multipart from 'connect-multiparty'
module.exports = ({
  config,
  containerMiddleware,
  logger,
  database,
  loggerMiddleware,
  errorHandlerMiddleware,
  validatorMiddleware
}) => {
  const router = Router()
  if (config.env === 'development') {
    router.use(statusMonitor())
  }

  if (config.env !== 'test') {
    router.use(loggerMiddleware)
  }
  // Create Main Router
  const apiRouter = Router()

  // Register Middleware
  apiRouter
    .use(
      cors({
        origin: [config.clientEndPoint],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: [
          'Content-Type',
          'Authorization'
        ]
      })
    )
    .use(
      urlencoded({
        extended: false
      })
    )
    .use(multipart())
    .use(json())
    .use(compression())
    .use(httpContext.middleware)
    .use(containerMiddleware)

  apiRouter.use(validatorMiddleware())

  /**
   * User Controller
   */
  apiRouter.use(`/api/V1/users`, controller('user', 'user_controller'))

  router.use(`/`, apiRouter)

  // Register Error Handler
  router.use(errorHandlerMiddleware)

  return router
}
