import { Express } from 'express'
import { Server } from 'http'
import { app } from './app'
import mongoose from 'mongoose'
// const app = require('./app')
// const config = require('./config/config')
import { logger } from './config/logger'

import { AppDataSource } from './models/typeorm/data-source'

import dotenv from 'dotenv'

dotenv.config()

let server: Server
const mongodb_url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_LOCATION}/?retryWrites=true&w=majority`

const mongoose_connect = mongoose.connect(mongodb_url)
const typeorm_connect = AppDataSource.initialize()
const promises = []
promises.push(mongoose_connect)
promises.push(typeorm_connect)
Promise.all(promises)
  .then(() => {
    logger.info('Connected to MongoDB & MySQL')
    server = app.listen(process.env.APP_PORT, () => {
      logger.info(`Listening to port ${process.env.APP_PORT}`)
    })
  })
  .catch((e) => {
    logger.error('MongoDB Connection Failed')
    logger.error(e)
  })

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error: any) => {
  logger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
