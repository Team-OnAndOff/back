import httpStatus from 'http-status'
import { Repository } from 'typeorm'
import { AppDataSource } from '../models/typeorm/data-source'
import { Category } from '../models/typeorm/entity/Category'
import { SubCategory } from '../models/typeorm/entity/SubCategory'
import {
  CategoryBodyDTO,
  CategoryParamsDTO,
} from '../models/typeorm/dto/CategoryDTO'
import { ApiError } from '../utils/error'

class CategoryService {
  private categoryRepo: Repository<Category>
  private subCategoryRepo: Repository<SubCategory>

  constructor() {
    this.categoryRepo = AppDataSource.getRepository(Category)
    this.subCategoryRepo = AppDataSource.getRepository(SubCategory)
  }

  async getCategories() {
    const categories = await this.categoryRepo
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.subCategories', 'subCategory')
      .getMany()

    return categories
  }

  async getCategory(params: CategoryParamsDTO) {
    const { categoryId } = params
    const category = await this.categoryRepo
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.subCategories', 'subCategory')
      .where('category.id = :categoryId', { categoryId })
      .getOne()

    if (!category) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '카테고리 데이터를 찾을 수 없습니다.',
      )
    }

    return category
  }

  async createCategory(body: CategoryBodyDTO) {
    const category = await this.categoryRepo.save(body)
    return category
  }

  async updateCategory(params: CategoryParamsDTO, body: CategoryBodyDTO) {
    const { categoryId } = params
    const response = await this.categoryRepo.update({ id: categoryId }, body)

    if (response.affected === 0) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '카테고리 데이터를 찾을 수 없습니다.',
      )
    }

    return await this.getCategory(params)
  }

  async deleteCategory(params: CategoryParamsDTO) {
    const { categoryId } = params
    const response = await this.categoryRepo.delete(categoryId)

    if (response.affected === 0) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '카테고리 데이터를 찾을 수 없습니다.',
      )
    }

    return response
  }

  async getSubCategoriesByCategoryId(params: CategoryParamsDTO) {
    const { categoryId } = params
    const subCategories = await this.subCategoryRepo
      .createQueryBuilder('subCategory')
      .where('subCategory.parentId = :categoryId', { categoryId })
      .getMany()

    return subCategories
  }

  async createSubCategory(params: CategoryParamsDTO, body: CategoryBodyDTO) {
    const category = await this.getCategory(params)
    const { parentId, ...subCategory } = await this.subCategoryRepo.save({
      ...body,
      parentId: category,
    })

    return subCategory
  }

  async getSubCategory(params: CategoryParamsDTO) {
    const { subCategoryId } = params
    const category = await this.getCategory(params)
    const subCategory = await this.subCategoryRepo.findOne({
      where: { id: subCategoryId, parentId: category },
    })

    if (!subCategory) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '카테고리 데이터를 찾을 수 없습니다.',
      )
    }

    return subCategory
  }

  async updateSubCategory(params: CategoryParamsDTO, body: CategoryBodyDTO) {
    const { subCategoryId } = params
    const response = await this.subCategoryRepo.update(
      { id: subCategoryId },
      body,
    )

    if (response.affected === 0) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '카테고리 데이터를 찾을 수 없습니다.',
      )
    }

    return await this.getSubCategory(params)
  }

  async deleteSubCategory(params: CategoryParamsDTO) {
    const { subCategoryId } = params

    const response = await this.subCategoryRepo.delete(subCategoryId)
    if (response.affected === 0) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '카테고리 데이터를 찾을 수 없습니다.',
      )
    }

    return response
  }
}

export default new CategoryService()
