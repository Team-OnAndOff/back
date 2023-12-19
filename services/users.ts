import httpStatus from 'http-status'
import { AppDataSource } from '../models/typeorm/data-source'
import { User } from '../models/typeorm/entity/User'
import {
  CareerCategoryBodyDTO,
  CareerCategoryParamsDTO,
} from '../models/typeorm/dto/CareerCategoryDTO'
import { ResponseDTO } from '../models/typeorm/dto/ResponseDTO'
import { ApiError } from '../utils/error'
import {
  CreateUserDTO,
  PostAssessDTO,
  UpdateUserDTO,
  UpdateAssessDTO,
} from '../models/typeorm/dto/UserDTO'
import { UserAssess } from '../models/typeorm/entity/UserAssess'
import { Event } from '../models/typeorm/entity/Event'

class UserService {
  private repo
  private assessRepo
  private eventRepo

  constructor() {
    this.repo = AppDataSource.getRepository(User)
    this.assessRepo = AppDataSource.getRepository(UserAssess)
    this.eventRepo = AppDataSource.getRepository(Event)
  }
  async findOneById(userId: number): Promise<User | null> {
    const user = await this.repo.findOne({ where: { id: userId } })
    return user
  }
  async findOneBySocialId(socialId: string): Promise<User | null> {
    const user = await this.repo.findOne({ where: { socialId } })
    return user
  }
  async createUser(dto: CreateUserDTO) {
    const user = await this.repo.save({ ...dto })
    return user
  }
  async updateUser(dto: UpdateUserDTO) {
    const result = await this.repo.update({ id: dto.id }, { ...dto })
    const user = await this.findOneById(dto.id)
    return user
  }
  async createAssess(dto: PostAssessDTO) {
    const reporter = await this.findOneById(dto.reporterId)
    const attendee = await this.findOneById(dto.attendeeId)
    const event = await this.eventRepo.findOne({ where: { id: dto.eventId } })
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, '이벤트 정보가 잘못되었습니다.')
    }
    if (!attendee) {
      throw new ApiError(httpStatus.NOT_FOUND, '참가자 정보가 잘못되었습니다.')
    }
    if (!reporter) {
      throw new ApiError(httpStatus.NOT_FOUND, '리포터 정보가 잘못되었습니다.')
    }
    const assess = this.assessRepo.create({
      eventId: event,
      reporterId: reporter,
      attendeeId: attendee,
      score: dto.score,
      description: dto.description ? dto.description : '',
    })
    const result = await this.assessRepo.save(assess)
    return result
  }
  async updateAssess(dto: UpdateAssessDTO) {
    const { assessId, userId, ...rest } = dto
    const result = await this.assessRepo.update(
      { id: assessId },
      { score: dto.score, description: dto.description },
    )
    const target = await this.assessRepo.findOne({ where: { id: assessId } })
    return target
  }

  async deleteAssess(assessId: number) {
    // const target = await this.assessRepo.findOne({
    //   where: { id: aid },
    // })
    const result = await this.assessRepo.delete({ id: assessId })
    return result
  }

  async checkIfAssessIsMine(assessId: number, userId: number) {
    const assess = await this.assessRepo.findOne({
      where: { id: assessId },
      relations: ['reporterId'],
    })
    if (!assess) {
      throw new ApiError(httpStatus.NOT_FOUND, '존재하지 않는 평가입니다.')
    }
    const user = await this.findOneById(userId)
    if (assess.reporterId.id !== userId) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        '본인이 작성한 평가가 아닙니다.',
      )
    }
  }

  async getAssessingList(userId: number) {
    // const target = await this.assessRepo.findOne({
    //   where: { id: aid },
    // })
    const user = await this.repo.findOne({ where: { id: userId } })
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, '')
    }
    const result = await this.assessRepo.find({ where: { reporterId: user } })
    return result
  }
  async getAssessedList(userId: number) {
    // const target = await this.assessRepo.findOne({
    //   where: { id: aid },
    // })
    const user = await this.repo.findOne({ where: { id: userId } })
    if (!user) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        '평가 대상자는 존재하지 않는 유저입니다.',
      )
    }
    const result = await this.assessRepo.find({ where: { attendeeId: user } })
    return result
  }
}

export default new UserService()
