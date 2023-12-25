import httpStatus from 'http-status'
import { Repository } from 'typeorm'
import { AppDataSource } from '../models/typeorm/data-source'
import { Category } from '../models/typeorm/entity/Category'
import { SubCategory } from '../models/typeorm/entity/SubCategory'
import { CategoryBodyDTO } from '../models/typeorm/dto/CategoryDTO'
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

  async getCategoryByCategoryId(categoryId: number) {
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

  async updateCategoryByCategoryId(categoryId: number, body: CategoryBodyDTO) {
    const response = await this.categoryRepo.update({ id: categoryId }, body)

    if (response.affected === 0) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '카테고리 데이터를 찾을 수 없습니다.',
      )
    }

    return await this.getCategoryByCategoryId(categoryId)
  }

  async deleteCategoryByCategoryId(categoryId: number) {
    const response = await this.categoryRepo.delete(categoryId)

    if (response.affected === 0) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '카테고리 데이터를 찾을 수 없습니다.',
      )
    }

    return response
  }

  async getSubCategoriesByCategoryId(categoryId: number) {
    const subCategories = await this.subCategoryRepo
      .createQueryBuilder('subCategory')
      .where('subCategory.parentId = :categoryId', { categoryId })
      .getMany()

    return subCategories
  }

  async createSubCategoryByCategoryId(
    categoryId: number,
    body: CategoryBodyDTO,
  ) {
    const category = await this.getCategoryByCategoryId(categoryId)
    const { parentId, ...subCategory } = await this.subCategoryRepo.save({
      ...body,
      parentId: category,
    })

    return subCategory
  }

  async getSubCategoryById(categoryId: number, subCategoryId: number) {
    const category = await this.getCategoryByCategoryId(categoryId)
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

  async updateSubCategoryById(
    categoryId: number,
    subCategoryId: number,
    body: CategoryBodyDTO,
  ) {
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

    return await this.getSubCategoryById(categoryId, subCategoryId)
  }

  async deleteSubCategoryById(subCategoryId: number) {
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
