import { Router } from 'express'
import { logger } from '../config/logger'
const router = Router()

import productsRouter from './api/prodocts'
import careerCategoryRouter from './api/careerCategories'

logger.info('API 라우터 올라옴')

export const apiRouter = router
  .use('/products', productsRouter)
  .use('/careerCategories', careerCategoryRouter)