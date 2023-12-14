import httpStatus from 'http-status'
import { logger } from '../config/logger'
import { AppDataSource } from '../models/typeorm/data-source'
import { CareerCategory } from '../models/typeorm/entity/CareerCategory'
import { SafeCategoryBody } from '../routes/api/careerCategories'
import { ApiError } from '../utils/error'

const getCareerCategories = async () => {
  const careerCategories = await AppDataSource.getRepository(
    CareerCategory,
  ).find({
    select: { id: true, name: true },
  })

  if (careerCategories.length === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      '카테고리 데이터가 존재하지 않습니다.',
    )
  }

  return careerCategories
}

const getCareerCategoryById = async (id: number) => {
  const careerCategory = await AppDataSource.getRepository(
    CareerCategory,
  ).findOne({
    where: { id },
    select: { id: true, name: true },
  })

  if (!careerCategory) {
    logger.error(`[pid=${id}] : ${careerCategory}`)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      '카테고리 데이터가 존재하지 않습니다.',
    )
  }

  return careerCategory
}

const createCareerCategory = async (category: SafeCategoryBody) => {
  const careerCategory = await AppDataSource.getRepository(CareerCategory)

  const careerCategoryObj = new CareerCategory()
  careerCategoryObj.name = category.name
  return careerCategory.save(careerCategoryObj)
}

const updateCareerCategory = async (id: number, category: SafeCategoryBody) => {
  const careerCategory = await AppDataSource.getRepository(CareerCategory)
  const response = await careerCategory.update({ id }, { name: category.name })

  if (response.affected === 0) {
    throw new ApiError(500, '수정할 데이터가 존재하지 않습니다.')
  }

  return await getCareerCategoryById(id)
}

const deleteCareerCategory = async (id: number) => {
  const careerCategory = await AppDataSource.getRepository(CareerCategory)
  const response = await careerCategory.delete(id)

  if (response.affected === 0) {
    throw new ApiError(500, '삭제할 데이터가 존재하지 않습니다.')
  }

  return response
}

export default {
  getCareerCategories,
  getCareerCategoryById,
  createCareerCategory,
  updateCareerCategory,
  deleteCareerCategory,
}
