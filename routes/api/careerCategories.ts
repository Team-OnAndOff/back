import { Router } from 'express'
import validate from '../../middlewares/validate'
import CareerCategoryController from '../../controllers/careerCategories'
import {
  CareerCategoryBodyDTO,
  CareerCategoryParamsDTO,
} from '../../models/typeorm/dto/CareerCategoryDTO'

const router = Router()

router.get('/', CareerCategoryController.getCareerCategories)

router.get(
  '/:id',
  validate(CareerCategoryParamsDTO, 'params'),
  CareerCategoryController.getCareerCategory,
)

router.post(
  '/',
  validate(CareerCategoryBodyDTO),
  CareerCategoryController.createCareerCategory,
)

router.put(
  '/:id',
  validate(CareerCategoryParamsDTO, 'params'),
  validate(CareerCategoryBodyDTO),
  CareerCategoryController.updateCareerCategory,
)

router.delete(
  '/:id',
  validate(CareerCategoryParamsDTO, 'params'),
  CareerCategoryController.deleteCareerCategory,
)

export default router
