import httpStatus from 'http-status'
import { catchAsync } from '../utils/catchAsync'
import service from '../services/careerCategories'
import {
  CareerCategoryBodyDTO,
  CareerCategoryParamsDTO,
  CareerCategoryRequestParams,
} from '../models/typeorm/dto/CareerCategoryDTO'

export default class CareerCategoryController {
  static getCareerCategories = catchAsync(async (req, res, next) => {
    const careerCategories = await service.getCareerCategories()
    res.status(httpStatus.OK).json(careerCategories)
  })

  static getCareerCategory = catchAsync(async (req, res, next) => {
    const params = req.params as unknown as CareerCategoryRequestParams
    const paramsDto = new CareerCategoryParamsDTO(params)

    const careerCategory = await service.getCareerCategoryById(paramsDto)
    res.status(httpStatus.OK).json(careerCategory)
  })

  static createCareerCategory = catchAsync(async (req, res, next) => {
    const bodyDto = new CareerCategoryBodyDTO(req.body)

    const careerCategory = await service.createCareerCategory(bodyDto)
    res.status(httpStatus.OK).json(careerCategory)
  })

  static updateCareerCategory = catchAsync(async (req, res, next) => {
    const params = req.params as unknown as CareerCategoryRequestParams
    const paramsDto = new CareerCategoryParamsDTO(params)
    const bodyDto = new CareerCategoryBodyDTO(req.body)

    const careerCategory = await service.updateCareerCategory(
      paramsDto,
      bodyDto,
    )
    res.status(httpStatus.OK).json(careerCategory)
  })

  static deleteCareerCategory = catchAsync(async (req, res, next) => {
    const params = req.params as unknown as CareerCategoryRequestParams
    const paramsDto = new CareerCategoryParamsDTO(params)

    const careerCategory = await service.deleteCareerCategory(paramsDto)
    res.status(httpStatus.OK).json(careerCategory)
  })
}
