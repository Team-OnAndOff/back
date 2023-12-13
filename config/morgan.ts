import morgan from 'morgan'
import { Request, Response, NextFunction } from 'express'
// const config = require('./config')
// const logger = require('./logger')
import { logger } from './logger'
import dotenv from 'dotenv'

dotenv.config()

morgan.token(
  'message',
  (req: Request, res: Response) => res.locals.errorMessage || '',
)

const getIpFormat = () =>
  process.env.NODE_MODE === 'PROD' ? ':remote-addr - ' : ''
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`

export const successHandler = morgan(successResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
})

export const errorHandler = morgan(errorResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
})
