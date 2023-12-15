import { Router } from 'express'
import validate from '../../middlewares/validate'
import CategoryController from '../../controllers/categories'
import {
  CategoryBodyDTO,
  CategoryParamsDTO,
} from '../../models/typeorm/dto/CategoryDTO'

const router = Router()

router.get('/', CategoryController.getCategories)

router.get(
  '/:categoryId',
  validate(CategoryParamsDTO, 'params'),
  CategoryController.getCategory,
)

router.post('/', validate(CategoryBodyDTO), CategoryController.createCategory)

router.put(
  '/:categoryId',
  validate(CategoryParamsDTO, 'params'),
  validate(CategoryBodyDTO),
  CategoryController.updateCategory,
)

router.delete(
  '/:categoryId',
  validate(CategoryParamsDTO, 'params'),
  CategoryController.deleteCategory,
)

router.get('/:categoryId/subCategories', CategoryController.getSubCategories)

router.get(
  '/:categoryId/subCategories/:subCategoryId',
  validate(CategoryParamsDTO, 'params'),
  CategoryController.getSubCategory,
)

router.post(
  '/:categoryId/subCategories',
  validate(CategoryBodyDTO),
  CategoryController.createSubCategory,
)

router.put(
  '/:categoryId/subCategories/:subCategoryId',
  validate(CategoryParamsDTO, 'params'),
  validate(CategoryBodyDTO),
  CategoryController.updateSubCategory,
)

router.delete(
  '/:categoryId/subCategories/:subCategoryId',
  validate(CategoryParamsDTO, 'params'),
  CategoryController.deleteSubCategory,
)

export default router
