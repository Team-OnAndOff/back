import { Router } from 'express'
import validate from '../../middlewares/validate'
import CareerCategoryController from '../../controllers/careerCategories'
import {
  CareerCategoryBodyDTO as BodyDTO,
  CareerCategoryParamsDTO as ParamsDTO,
} from '../../models/typeorm/dto/CareerCategoryDTO'

const router = Router()

router.get('/', CareerCategoryController.getCareerCategories)

router.get(
  '/:id',
  validate(ParamsDTO, 'params'),
  CareerCategoryController.getCareerCategory,
)

router.post(
  '/',
  validate(BodyDTO),
  CareerCategoryController.createCareerCategory,
)

router.put(
  '/:id',
  validate(ParamsDTO, 'params'),
  validate(BodyDTO),
  CareerCategoryController.updateCareerCategory,
)

router.delete(
  '/:id',
  validate(ParamsDTO, 'params'),
  CareerCategoryController.deleteCareerCategory,
)

export default router
