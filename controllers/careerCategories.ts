import httpStatus from 'http-status'
import { catchAsync } from '../utils/catchAsync'
import service from '../services/careerCategories'
import {
  CareerCategoryBodyDTO as BodyDTO,
  CareerCategoryParamsDTO as ParamsDTO,
} from '../models/typeorm/dto/CareerCategoryDTO'
import { CareerCategory } from '../models/typeorm/entity/CareerCategory'
import { createResponse } from '../utils/createResponse'
import RequestHandler from './requestHandler'

export default class CareerCategoryController extends RequestHandler {
  static getCareerCategories = catchAsync(async (req, res, next) => {
    const careerCategories = await service.getCareerCategories()
    res
      .status(httpStatus.OK)
      .json(createResponse<CareerCategory[]>(careerCategories))
  })

  static getCareerCategory = catchAsync(async (req, res, next) => {
    const params = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const { id } = params
    const careerCategory = await service.getCareerCategoryById(id)
    res
      .status(httpStatus.OK)
      .json(createResponse<CareerCategory>(careerCategory))
  })

  static createCareerCategory = catchAsync(async (req, res, next) => {
    const body = this.extractBody<BodyDTO>(req, BodyDTO)
    const careerCategory = await service.createCareerCategory(body)
    res
      .status(httpStatus.OK)
      .json(createResponse<CareerCategory>(careerCategory))
  })

  static updateCareerCategory = catchAsync(async (req, res, next) => {
    const params = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const body = this.extractBody<BodyDTO>(req, BodyDTO)
    const { id } = params
    const careerCategory = await service.updateCareerCategoryById(id, body)
    res
      .status(httpStatus.OK)
      .json(createResponse<CareerCategory>(careerCategory))
  })

  static deleteCareerCategory = catchAsync(async (req, res, next) => {
    const params = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const { id } = params
    await service.deleteCareerCategoryById(id)
    res.status(httpStatus.OK).json(createResponse<CareerCategory>())
  })
}
