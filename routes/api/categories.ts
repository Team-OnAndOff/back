import { Router } from 'express'
import validate from '../../middlewares/validate'
import CategoryController from '../../controllers/categories'
import {
  CategoryBodyDTO as BodyDTO,
  CategoryParamsDTO as ParamsDTO,
} from '../../models/typeorm/dto/CategoryDTO'

const router = Router()

router.get('/', CategoryController.getCategories)

router.get(
  '/:categoryId',
  validate(ParamsDTO, 'params'),
  CategoryController.getCategory,
)

router.post('/', validate(BodyDTO), CategoryController.createCategory)

router.put(
  '/:categoryId',
  validate(ParamsDTO, 'params'),
  validate(BodyDTO),
  CategoryController.updateCategory,
)

router.delete(
  '/:categoryId',
  validate(ParamsDTO, 'params'),
  CategoryController.deleteCategory,
)

router.get('/:categoryId/subCategories', CategoryController.getSubCategories)

router.get(
  '/:categoryId/subCategories/:subCategoryId',
  validate(ParamsDTO, 'params'),
  CategoryController.getSubCategory,
)

router.post(
  '/:categoryId/subCategories',
  validate(BodyDTO),
  CategoryController.createSubCategory,
)

router.put(
  '/:categoryId/subCategories/:subCategoryId',
  validate(ParamsDTO, 'params'),
  validate(BodyDTO),
  CategoryController.updateSubCategory,
)

router.delete(
  '/:categoryId/subCategories/:subCategoryId',
  validate(ParamsDTO, 'params'),
  CategoryController.deleteSubCategory,
)

export default router
