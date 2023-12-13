import { Router } from 'express'
import { validateRequest } from 'zod-express-middleware'
import { z } from 'zod'
import { getProduct } from '../../controllers/products'

// const multer = require('multer')
// const upload = multer()

const router = Router()
router.get(
  '/:id',
  validateRequest({
    params: z.object({
      id: z.string(),
    }),
  }),
  getProduct,
)

export default router
