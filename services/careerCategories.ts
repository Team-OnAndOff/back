import httpStatus from 'http-status'
import { AppDataSource } from '../models/typeorm/data-source'
import { CareerCategory } from '../models/typeorm/entity/CareerCategory'
import { CareerCategoryBodyDTO } from '../models/typeorm/dto/CareerCategoryDTO'
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

  async getCareerCategoryById(id: number) {
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

  async updateCareerCategoryById(id: number, body: CareerCategoryBodyDTO) {
    const response = await this.repo.update({ id }, body)

    if (response.affected === 0) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '카테고리 데이터를 찾을 수 없습니다.',
      )
    }

    return await this.getCareerCategoryById(id)
  }

  async deleteCareerCategoryById(id: number) {
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
