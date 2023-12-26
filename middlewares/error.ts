import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { MongoAPIError, TypeORMError } from 'typeorm'

// const config = require('../config/config')

import httpStatus from 'http-status'
import { logger } from '../config/logger'
import { ApiError } from '../utils/error'

import dotenv from 'dotenv'

dotenv.config()

const MODE = process.env.NODE_MODE

export const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode ||
      error instanceof mongoose.Error ||
      error instanceof TypeORMError
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR
    const message = error.message || httpStatus[statusCode]
    error = new ApiError(statusCode, message, false, err.stack)
  }
  next(error)
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { statusCode, message } = err
  if (MODE === 'PROD' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
  }
  res.locals.errorMessage = err.message
  // 이 부분이 왜 필요한지 모르겠음
  // res.locals가 어떤 역할인지는 알겠는데
  // 왜 이 에러 메세지를 궂이 여기다 넣어놓는거지??
  // https://expressjs.com/en/api.html#res.locals

  const response = {
    code: statusCode,
    message,
    ...(MODE === 'DEV' && { stack: err.stack }),
  }
  if (MODE === 'DEV') {
    logger.error(err.stack)
  }

  res.status(statusCode).send(response)
}
