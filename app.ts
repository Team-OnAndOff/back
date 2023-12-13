import express, { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'

import { apiRouter } from './routes/index'

// import path from 'path'
// const path = require('path')

// const config = require('./config/config')
import { logger } from './config/logger'

import * as morgan from './config/morgan'

import httpStatus from 'http-status'

import * as error from './middlewares/error'
import { ApiError } from './utils/error'
import cors from 'cors'

export const app = express()

logger.info('hello0')
// app.use(express.static(__dirname + "/front/dist"));
// app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname, 'views'))

// 라우터 설정

app.use(morgan.successHandler)
app.use(morgan.errorHandler)

app.use(express.json())
// app.use(cors({ origin: 'http://localhost:5002' }))
app.use(cookieParser())
app.use('/api', apiRouter)

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

app.use(error.errorConverter)
app.use(error.errorHandler)
