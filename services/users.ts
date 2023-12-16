import httpStatus from 'http-status'
import { AppDataSource } from '../models/typeorm/data-source'
import { User } from '../models/typeorm/entity/User'
import {
  CareerCategoryBodyDTO,
  CareerCategoryParamsDTO,
} from '../models/typeorm/dto/CareerCategoryDTO'
import { ResponseDTO } from '../models/typeorm/dto/ResponseDTO'
import { ApiError } from '../utils/error'
import { createUserDTO } from '../models/typeorm/dto/UserDTO'

class UserService {
  private repo

  constructor() {
    this.repo = AppDataSource.getRepository(User)
  }
  async findOneById(userId: number): Promise<User | null> {
    const user = await this.repo.findOne({ where: { id: userId } })
    return user
  }
  async findOneBySocialId(socialId: string): Promise<User | null> {
    const user = await this.repo.findOne({ where: { socialId } })
    return user
  }
  async createUser(dto: createUserDTO) {
    const user = await this.repo.save({ ...dto })
    return user
  }
}

export default new UserService()
