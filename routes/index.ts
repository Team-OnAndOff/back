import { Router } from 'express'
import { logger } from '../config/logger'
const router = Router()

import categoryRouter from './api/categories'
import careerCategoryRouter from './api/careerCategories'
import authRouter from './api/auth'

logger.info('API 라우터 올라옴')

export const apiRouter = router
  .use('/categories', categoryRouter)
  .use('/careerCategories', careerCategoryRouter)
  .use('/auth', authRouter)
