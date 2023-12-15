import httpStatus from 'http-status'
import { AppDataSource } from '../models/typeorm/data-source'
import { CareerCategory } from '../models/typeorm/entity/CareerCategory'
import {
  CareerCategoryBodyDTO,
  CareerCategoryParamsDTO,
} from '../models/typeorm/dto/CareerCategoryDTO'
import { ResponseDTO } from '../models/typeorm/dto/ResponseDTO'
import { ApiError } from '../utils/error'

class CareerCategoryService {
  private repo

  constructor() {
    this.repo = AppDataSource.getRepository(CareerCategory)
  }

  async getCareerCategories() {
    const careerCategories = await this.repo.find()
    return new ResponseDTO<CareerCategory[]>(
      httpStatus.OK,
      'success',
      careerCategories,
    )
  }

  async getCareerCategoryById(paramsDto: CareerCategoryParamsDTO) {
    const { id } = paramsDto
    const careerCategory = await this.repo.findOneById(id)
    if (!careerCategory) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '카테고리 데이터를 찾을 수 없습니다.',
      )
    }

    return new ResponseDTO<CareerCategory>(
      httpStatus.OK,
      'success',
      careerCategory,
    )
  }

  async createCareerCategory(bodyDto: CareerCategoryBodyDTO) {
    const careerCategory = await this.repo.save(bodyDto)
    return new ResponseDTO<CareerCategory>(
      httpStatus.OK,
      'success',
      careerCategory,
    )
  }

  async updateCareerCategory(
    paramsDto: CareerCategoryParamsDTO,
    bodyDto: CareerCategoryBodyDTO,
  ) {
    const { id } = paramsDto
    const response = await this.repo.update({ id }, bodyDto)

    if (response.affected === 0) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '카테고리 데이터를 찾을 수 없습니다.',
      )
    }

    return await this.getCareerCategoryById(paramsDto)
  }

  async deleteCareerCategory(paramsDto: CareerCategoryParamsDTO) {
    const { id } = paramsDto

    const response = await this.repo.delete(id)
    if (response.affected === 0) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '카테고리 데이터를 찾을 수 없습니다.',
      )
    }

    return new ResponseDTO<CareerCategory>(httpStatus.OK, 'success')
  }
}

export default new CareerCategoryService()
