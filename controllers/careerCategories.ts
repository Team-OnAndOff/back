import httpStatus from 'http-status'
import { catchAsync } from '../utils/catchAsync'
import careerCategoryService from '../services/careerCategories'

export const getCareerCategories = catchAsync(async (req, res, next) => {
  const careerCategories = await careerCategoryService.getCareerCategories()
  res.status(httpStatus.OK).json(careerCategories)
})

export const getCareerCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const careerCategory = await careerCategoryService.getCareerCategoryById(
    Number(id),
  )
  res.status(httpStatus.OK).json(careerCategory)
})
export const createCareerCategory = catchAsync(async (req, res, next) => {
  const careerCategory = await careerCategoryService.createCareerCategory(
    req.body,
  )
  res.status(httpStatus.OK).json(careerCategory)
})

export const updateCareerCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const careerCategory = await careerCategoryService.updateCareerCategory(
    Number(id),
    req.body,
  )
  res.status(httpStatus.OK).json(careerCategory)
})

export const deleteCareerCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const careerCategory = await careerCategoryService.deleteCareerCategory(
    Number(id),
  )
  res.status(httpStatus.OK).json(careerCategory)
})
