import {
  createContainer,
  asFunction,
  asValue,
  Lifetime,
  InjectionMode
} from 'awilix'
import { scopePerRequest } from 'awilix-express'

import app from './app'
import server from './interfaces/http/server'
import router from './interfaces/http/router'
import auth from './interfaces/http/auth'
import config from '../config'
import logger from './infra/logging'
import database from './infra/database'
import redis from './infra/caching'
import jwt from './infra/jwt'
import response from './infra/support/response'
import healthCheckService from './infra/health-check'
import axiosWrapper from './infra/support/axios_wrapper'
import constants from './constants'
import CustomError from './infra/error'
import transactionDecorator from './infra/transaction'
import sessionHook from './infra/hook'
import md5 from './infra/md5'
import passwordEncryption from './infra/encryption'
import loggerMiddleware from './interfaces/http/middlewares/http_logger'
import errorHandlerMiddleware from './interfaces/http/middlewares/error_handler'
import authorizeHandlerMiddleware from './interfaces/http/middlewares/authorize_handler'
import validatorMiddleware from './interfaces/http/middlewares/validators'
import userContextMiddleware from './interfaces/http/middlewares/usercontext_handler'
import CustomEvent from './modules/event_bus/service/custom_event_class'
import awsService from './infra/aws'

const container = createContainer({
  injectionMode: InjectionMode.PROXY
})

// System
container
  .register({
    app: asFunction(app).singleton(),
    server: asFunction(server).singleton()
  })
  .register({
    router: asFunction(router).singleton(),
    logger: asFunction(logger).singleton()
  })
  .register({
    config: asValue(config),
    constants: asValue(constants)
  })

// Middlewares
container
  .register({
    loggerMiddleware: asFunction(loggerMiddleware).singleton()
  })
  .register({
    containerMiddleware: asValue(scopePerRequest(container)),
    errorHandlerMiddleware: asFunction(errorHandlerMiddleware),
    authorizeMiddleware: asFunction(authorizeHandlerMiddleware).singleton()
  })
  .register({
    validatorMiddleware: asFunction(validatorMiddleware).singleton(),
    userContextMiddleware: asFunction(userContextMiddleware).singleton()
  })

// Database
container.register({
  database: asFunction(database).singleton(),
  redisClient: asFunction(redis).singleton()
})

// Infra
container.register({
  auth: asFunction(auth).singleton(),
  jwt: asFunction(jwt).singleton(),
  response: asFunction(response).singleton(),
  healthCheckService: asFunction(healthCheckService).singleton(),
  axiosWrapper: asFunction(axiosWrapper).singleton(),
  CustomError: asFunction(CustomError).singleton(),
  CustomEvent: asFunction(CustomEvent).singleton(),
  awsService: asFunction(awsService).singleton(),
  md5: asFunction(md5).singleton(),
  passwordEncryption: asFunction(passwordEncryption).singleton(),
  transactionDecorator: asFunction(transactionDecorator).singleton(),
  sessionHook: asFunction(sessionHook).singleton()
})

container.loadModules(['modules/**/repository/*.js'], {
  resolverOptions: {
    register: asFunction,
    lifetime: Lifetime.SINGLETON
  },
  cwd: __dirname
})

container.loadModules(['modules/**/service/*.js'], {
  resolverOptions: {
    register: asFunction,
    lifetime: Lifetime.SINGLETON
  },
  cwd: __dirname
})
module.exports = container
