import httpStatus from 'http-status'
import { catchAsync } from '../utils/catchAsync'
import service from '../services/categories'
import {
  CategoryBodyDTO as BodyDTO,
  CategoryParamsDTO as ParamsDTO,
} from '../models/typeorm/dto/CategoryDTO'
import { Category } from '../models/typeorm/entity/Category'
import { SubCategory } from '../models/typeorm/entity/SubCategory'
import { createResponse } from '../utils/createResponse'
import RequestHandler from './requestHandler'

export default class CategoryController extends RequestHandler {
  static getCategories = catchAsync(async (req, res, next) => {
    const categories = await service.getCategories()
    res.status(httpStatus.OK).json(createResponse<Category[]>(categories))
  })

  static getCategory = catchAsync(async (req, res, next) => {
    const params = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const { categoryId } = params
    const category = await service.getCategoryByCategoryId(categoryId)
    res.status(httpStatus.OK).json(createResponse<Category>(category))
  })

  static createCategory = catchAsync(async (req, res, next) => {
    const body = this.extractBody<BodyDTO>(req, BodyDTO)
    const category = await service.createCategory(body)
    res.status(httpStatus.OK).json(createResponse<Category>(category))
  })

  static updateCategory = catchAsync(async (req, res, next) => {
    const params = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const body = this.extractBody<BodyDTO>(req, BodyDTO)
    const { categoryId } = params
    const category = await service.updateCategoryByCategoryId(categoryId, body)
    res.status(httpStatus.OK).json(createResponse<Category>(category))
  })

  static deleteCategory = catchAsync(async (req, res, next) => {
    const params = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const { categoryId } = params
    await service.deleteCategoryByCategoryId(categoryId)
    res.status(httpStatus.OK).json(createResponse<Category>())
  })

  static getSubCategories = catchAsync(async (req, res, next) => {
    const params = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const { categoryId } = params
    const subCategories = await service.getSubCategoriesByCategoryId(categoryId)
    res.status(httpStatus.OK).json(createResponse<SubCategory[]>(subCategories))
  })

  static createSubCategory = catchAsync(async (req, res, next) => {
    const params = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const body = this.extractBody<BodyDTO>(req, BodyDTO)
    const { categoryId } = params
    const category = await service.createSubCategoryByCategoryId(
      categoryId,
      body,
    )
    res.status(httpStatus.OK).json(createResponse<SubCategory>(category))
  })

  static getSubCategory = catchAsync(async (req, res, next) => {
    const params = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const { categoryId, subCategoryId } = params
    const category = await service.getSubCategoryById(categoryId, subCategoryId)
    res.status(httpStatus.OK).json(createResponse<SubCategory>(category))
  })

  static updateSubCategory = catchAsync(async (req, res, next) => {
    const params = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const body = this.extractBody<BodyDTO>(req, BodyDTO)
    const { categoryId, subCategoryId } = params
    const category = await service.updateSubCategoryById(
      categoryId,
      subCategoryId,
      body,
    )
    res.status(httpStatus.OK).json(createResponse<SubCategory>(category))
  })

  static deleteSubCategory = catchAsync(async (req, res, next) => {
    const params = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const { subCategoryId } = params
    await service.deleteSubCategoryById(subCategoryId)
    res.status(httpStatus.OK).json(createResponse<SubCategory>())
  })
}
