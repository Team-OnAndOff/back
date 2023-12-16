import { Request } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../utils/catchAsync'
import service from '../services/categories'
import {
  CategoryBodyDTO,
  CategoryParamsDTO,
  CategoryRequestParams,
} from '../models/typeorm/dto/CategoryDTO'
import { Category } from '../models/typeorm/entity/Category'
import { SubCategory } from '../models/typeorm/entity/SubCategory'
import { createResponse } from '../utils/createResponse'

export default class CategoryController {
  private static extractParams(req: Request): CategoryParamsDTO {
    const params = req.params as unknown as CategoryRequestParams
    return new CategoryParamsDTO(params)
  }

  private static extractBody(req: Request): CategoryBodyDTO {
    return new CategoryBodyDTO(req.body)
  }

  static getCategories = catchAsync(async (req, res, next) => {
    const categories = await service.getCategories()
    res.status(httpStatus.OK).json(createResponse<Category[]>(categories))
  })

  static getCategory = catchAsync(async (req, res, next) => {
    const params = CategoryController.extractParams(req)
    const category = await service.getCategory(params)
    res.status(httpStatus.OK).json(createResponse<Category>(category))
  })

  static createCategory = catchAsync(async (req, res, next) => {
    const body = CategoryController.extractBody(req)
    const category = await service.createCategory(body)
    res.status(httpStatus.OK).json(createResponse<Category>(category))
  })

  static updateCategory = catchAsync(async (req, res, next) => {
    const params = CategoryController.extractParams(req)
    const body = CategoryController.extractBody(req)
    const category = await service.updateCategory(params, body)
    res.status(httpStatus.OK).json(createResponse<Category>(category))
  })

  static deleteCategory = catchAsync(async (req, res, next) => {
    const params = CategoryController.extractParams(req)
    await service.deleteCategory(params)
    res.status(httpStatus.OK).json(createResponse<Category>())
  })

  static getSubCategories = catchAsync(async (req, res, next) => {
    const params = CategoryController.extractParams(req)
    const subCategories = await service.getSubCategoriesByCategoryId(params)
    res.status(httpStatus.OK).json(createResponse<SubCategory[]>(subCategories))
  })

  static createSubCategory = catchAsync(async (req, res, next) => {
    const params = CategoryController.extractParams(req)
    const body = CategoryController.extractBody(req)
    const category = await service.createSubCategory(params, body)
    res.status(httpStatus.OK).json(createResponse<SubCategory>(category))
  })

  static getSubCategory = catchAsync(async (req, res, next) => {
    const params = CategoryController.extractParams(req)
    const category = await service.getSubCategory(params)
    res.status(httpStatus.OK).json(createResponse<SubCategory>(category))
  })

  static updateSubCategory = catchAsync(async (req, res, next) => {
    const params = CategoryController.extractParams(req)
    const body = CategoryController.extractBody(req)
    const category = await service.updateSubCategory(params, body)
    res.status(httpStatus.OK).json(createResponse<SubCategory>(category))
  })

  static deleteSubCategory = catchAsync(async (req, res, next) => {
    const params = CategoryController.extractParams(req)
    await service.deleteSubCategory(params)
    res.status(httpStatus.OK).json(createResponse<SubCategory>())
  })
}
