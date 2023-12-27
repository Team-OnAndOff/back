import { Router } from 'express'
import { logger } from '../config/logger'
const router = Router()

import eventRouter from './api/events'
import reportsEventRouter from './api/reportEvents'
import categoryRouter from './api/categories'
import careerCategoryRouter from './api/careerCategories'
import authRouter from './api/auth'
import userRouter from './api/users'
import reportsUserRouter from './api/reportUsers'
import chatRouter from './api/chat'

logger.info('API 라우터 올라옴')

export const apiRouter = router
  .use('/events', eventRouter)
  .use('/reports-event', reportsEventRouter)
  .use('/categories', categoryRouter)
  .use('/careerCategories', careerCategoryRouter)
  .use('/auth', authRouter)
  .use('/users', userRouter)
  .use('/reports-user', reportsUserRouter)
  .use('/chat', chatRouter)
