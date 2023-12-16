import httpStatus from 'http-status'
import { AppDataSource } from '../models/typeorm/data-source'
import { CareerCategory } from '../models/typeorm/entity/CareerCategory'
import {
  CareerCategoryBodyDTO,
  CareerCategoryParamsDTO,
} from '../models/typeorm/dto/CareerCategoryDTO'
import { ApiError } from '../utils/error'

class CareerCategoryService {
  private repo

  constructor() {
    this.repo = AppDataSource.getRepository(CareerCategory)
  }

  async getCareerCategories() {
    const careerCategories = await this.repo.find()
    return careerCategories
  }

  async getCareerCategoryById(params: CareerCategoryParamsDTO) {
    const { id } = params
    const careerCategory = await this.repo.findOne({ where: { id } })

    if (!careerCategory) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '카테고리 데이터를 찾을 수 없습니다.',
      )
    }

    return careerCategory
  }

  async createCareerCategory(body: CareerCategoryBodyDTO) {
    const careerCategory = await this.repo.save(body)
    return careerCategory
  }

  async updateCareerCategory(
    params: CareerCategoryParamsDTO,
    body: CareerCategoryBodyDTO,
  ) {
    const { id } = params
    const response = await this.repo.update({ id }, body)

    if (response.affected === 0) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '카테고리 데이터를 찾을 수 없습니다.',
      )
    }

    return await this.getCareerCategoryById(params)
  }

  async deleteCareerCategory(params: CareerCategoryParamsDTO) {
    const { id } = params
    const response = await this.repo.delete(id)

    if (response.affected === 0) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '카테고리 데이터를 찾을 수 없습니다.',
      )
    }

    return response
  }
}

export default new CareerCategoryService()
