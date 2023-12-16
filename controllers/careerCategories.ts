import { Request } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../utils/catchAsync'
import service from '../services/careerCategories'
import {
  CareerCategoryBodyDTO,
  CareerCategoryParamsDTO,
  CareerCategoryRequestParams,
} from '../models/typeorm/dto/CareerCategoryDTO'
import { CareerCategory } from '../models/typeorm/entity/CareerCategory'
import { createResponse } from '../utils/createResponse'

export default class CareerCategoryController {
  private static extractParams(req: Request): CareerCategoryParamsDTO {
    const params = req.params as unknown as CareerCategoryRequestParams
    return new CareerCategoryParamsDTO(params)
  }

  private static extractBody(req: Request): CareerCategoryBodyDTO {
    return new CareerCategoryBodyDTO(req.body)
  }

  static getCareerCategories = catchAsync(async (req, res, next) => {
    const careerCategories = await service.getCareerCategories()
    res
      .status(httpStatus.OK)
      .json(createResponse<CareerCategory[]>(careerCategories))
  })

  static getCareerCategory = catchAsync(async (req, res, next) => {
    const params = CareerCategoryController.extractParams(req)
    const careerCategory = await service.getCareerCategoryById(params)
    res
      .status(httpStatus.OK)
      .json(createResponse<CareerCategory>(careerCategory))
  })

  static createCareerCategory = catchAsync(async (req, res, next) => {
    const body = CareerCategoryController.extractBody(req)
    const careerCategory = await service.createCareerCategory(body)
    res
      .status(httpStatus.OK)
      .json(createResponse<CareerCategory>(careerCategory))
  })

  static updateCareerCategory = catchAsync(async (req, res, next) => {
    const params = CareerCategoryController.extractParams(req)
    const body = CareerCategoryController.extractBody(req)
    const careerCategory = await service.updateCareerCategory(params, body)
    res
      .status(httpStatus.OK)
      .json(createResponse<CareerCategory>(careerCategory))
  })

  static deleteCareerCategory = catchAsync(async (req, res, next) => {
    const params = CareerCategoryController.extractParams(req)
    await service.deleteCareerCategory(params)
    res.status(httpStatus.OK).json(createResponse<CareerCategory>())
  })
}
