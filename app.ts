import express, { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import createMemoryStore from 'memorystore'
import FileStore from 'session-file-store'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import path from 'path'
import flash from 'connect-flash'
import { passport, setOauthStrategies } from './config/passport'

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

const swaggerSpec = YAML.load(path.join(__dirname, './swagger.yaml'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// app.use(express.static(__dirname + "/front/dist"));
// app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname, 'views'))

// 라우터 설정

app.use(morgan.successHandler)
app.use(morgan.errorHandler)

app.use(express.json())
app.use(cors())
app.use(cookieParser())

const checkPeriod = 24 * 60 * 60 * 1000
// const MemoryStore = createMemoryStore(session)
// const memoryStore = new MemoryStore({ checkPeriod })

app.use(
  session({
    secret: '!@E@E$#T4twerwf@#%ew^&rrrr',
    // store: memoryStore,
    store: new (FileStore(session))({
      path: path.join(__dirname, 'sessions'),
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: checkPeriod },
    name: 'SESSIONID',
  }),
)

app.use(passport.initialize())
app.use(passport.session())

setOauthStrategies(app)

app.use(flash())
app.use('/api', apiRouter)

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

app.use(error.errorConverter)
app.use(error.errorHandler)
