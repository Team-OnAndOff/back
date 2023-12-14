import { Router } from 'express'
import { validateRequest } from 'zod-express-middleware'
import z from 'zod'
import {
  getCareerCategories,
  getCareerCategory,
  createCareerCategory,
  updateCareerCategory,
  deleteCareerCategory,
} from '../../controllers/careerCategories'

const router = Router()

const careerCategoryParams = z.object({ id: z.string() })
const careerCategoryBody = z.object({ name: z.string() })

export type SafeCategoryParams = z.infer<typeof careerCategoryParams>
export type SafeCategoryBody = z.infer<typeof careerCategoryBody>

router.get('/', getCareerCategories)

router.get(
  '/:id',
  validateRequest({ params: careerCategoryParams.strict() }),
  getCareerCategory,
)

router.post(
  '/',
  validateRequest({ body: careerCategoryBody.strict() }),
  createCareerCategory,
)

router.put(
  '/:id',
  validateRequest({
    params: careerCategoryParams.strict(),
    body: careerCategoryBody.strict(),
  }),
  updateCareerCategory,
)

router.delete(
  '/:id',
  validateRequest({ params: careerCategoryParams.strict() }),
  deleteCareerCategory,
)

export default router
