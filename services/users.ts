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
import { s3Delete, s3Upload } from '../utils/s3'
import { ImageDTO } from '../models/typeorm/dto/ImageDTO'
import { logger } from '../config/logger'
import { Image } from '../models/typeorm/entity/Image'
import { Multer } from 'multer'
import { EventApply } from '../models/typeorm/entity/EventApply'

import {
  EVENT_APPLY_FLAG,
  EVENT_APPLY_STATUS,
  EVENT_ORDER,
  EVENT_SORT,
} from '../types'
import { EventLike } from '../models/typeorm/entity/EventLike'
import { Category } from '../models/typeorm/entity/Category'
import { SubCategory } from '../models/typeorm/entity/SubCategory'

class UserService {
  private repo
  private assessRepo
  private eventRepo
  private eventApplyRepo
  private eventLikeRepo
  private categoryRepy
  private subCategoryRepo
  private imageRepo
  constructor() {
    this.repo = AppDataSource.getRepository(User)
    this.assessRepo = AppDataSource.getRepository(UserAssess)
    this.eventRepo = AppDataSource.getRepository(Event)
    this.eventRepo = AppDataSource.getRepository(Event)
    this.eventApplyRepo = AppDataSource.getRepository(EventApply)
    this.eventLikeRepo = AppDataSource.getRepository(EventLike)
    this.categoryRepy = AppDataSource.getRepository(Category)
    this.subCategoryRepo = AppDataSource.getRepository(SubCategory)
    this.imageRepo = AppDataSource.getRepository(Image)
  }
  async findOneById(userId: number): Promise<User | null> {
    const user = await this.repo.findOne({
      where: { id: userId },
      relations: ['image'],
    })
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
  async saveImage(filePath: string, filename: string, size: number) {
    const targetImage = new Image()
    targetImage.filename = filename
    targetImage.size = size
    targetImage.uploadPath = filePath
    const result = await this.imageRepo.save(targetImage)
    return result
  }

  async updateUserForImage(userId: number, image: Image) {
    const upload = await this.imageRepo.save(image)
    const result = await this.repo.update({ id: userId }, { image: upload })
    console.log(result)
    return result
  }

  async updateUser(dto: UpdateUserDTO) {
    let upload: ImageDTO
    return await AppDataSource.transaction(async (manager) => {
      let { image, ...dtoExceptImage } = dto
      const txUserRepo = manager.getRepository(User)
      const target = await txUserRepo.findOne({
        where: { id: dto.id },
        relations: ['image'],
      })
      if (!target) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          '해당 아이디를 가진 유저가 존재하지 않습니다.',
        )
      }
      await txUserRepo.update({ id: dto.id }, dtoExceptImage)
      const txImageRepo = manager.getRepository(Image)

      if (dto.image) {
        const imageDto = new ImageDTO(dto.image)
        const targetImage = new Image()
        upload = await s3Upload(imageDto, 'users')
        targetImage.filename = upload.filename
        targetImage.size = upload.size
        targetImage.uploadPath = upload.destination
        const rImage = await txImageRepo.save(targetImage)
        await txUserRepo.update({ id: dto.id }, { image: rImage })
      }

      const user = await txUserRepo.findOne({
        where: { id: dto.id },
        relations: ['image'],
      })
      return user
    }).catch(async (err) => {
      if (upload) {
        try {
          await s3Delete(upload.filename)
        } catch (err) {
          logger.error(`이미지 삭제 실패!! ${upload.filename}`, err)
        }
      }
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err)
    })
  }

  async checkIfAssessExists(
    reporterId: number,
    attendeeId: number,
    eventId: number,
  ) {
    const reporter = await this.findOneById(reporterId)
    const attendee = await this.findOneById(attendeeId)
    const event = await this.eventRepo.findOne({ where: { id: eventId } })
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, '이벤트 정보가 잘못되었습니다.')
    }
    if (!attendee) {
      throw new ApiError(httpStatus.NOT_FOUND, '참가자 정보가 잘못되었습니다.')
    }
    if (!reporter) {
      throw new ApiError(httpStatus.NOT_FOUND, '리포터 정보가 잘못되었습니다.')
    }
    const result = await this.assessRepo
      .createQueryBuilder('ua')
      .andWhere('ua.reporterId = :reporterId', { reporterId: reporterId })
      .andWhere('ua.attendee = :attendeeId', { attendee: attendeeId })
      .andWhere('ua.event = :eventId', { eventId: eventId })
      .select([
        'ua.id',
        'ua.score',
        'ua.description',
        'ua.createdAt',
        'ua.updatedAt',
      ])
      .getOne()
    if (result) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        '해당 그룹의 유저에 대해서 이미 평가가 진행되었습니다.',
      )
    }
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
    const previous = await this.assessRepo
      .createQueryBuilder('ua')
      .andWhere('ua.reporterId = :reporterId', { reporterId: dto.reporterId })
      .andWhere('ua.attendeeId = :attendeeId', { attendeeId: dto.attendeeId })
      .andWhere('ua.eventId = :eventId', { eventId: dto.eventId })
      .select([
        'ua.id',
        'ua.score',
        'ua.description',
        'ua.createdAt',
        'ua.updatedAt',
      ])
      .getOne()
    if (previous) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        '해당 그룹의 유저에 대해서 이미 평가가 진행되었습니다.',
      )
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

  async getAssessingList(userId: number, eventId?: number | null) {
    let query = await this.assessRepo
      .createQueryBuilder('ua')
      .andWhere('ua.reporterId = :reporterId', { reporterId: userId })

    if (eventId !== null) {
      query = query.andWhere('ua.eventId = :eventId', {
        eventId,
      })
    }

    const result = query
      .leftJoinAndSelect('ua.reporterId', 'r')
      .leftJoinAndSelect('r.image', 'rimage')
      .leftJoinAndSelect('ua.attendeeId', 'a')
      .leftJoinAndSelect('a.image', 'aimage')
      .select([
        'ua.id',
        'ua.score',
        'ua.description',
        'ua.createdAt',
        'ua.updatedAt',
        'r.id',
        'r.username',
        'rimage',
        'a.id',
        'a.username',
        'aimage',
      ])
      .getMany()
    return result
  }
  async getAssessedList(userId: number) {
    const result = await this.assessRepo
      .createQueryBuilder('ua')
      .andWhere('ua.attendeeId = :attendeeId', { attendeeId: userId })
      .leftJoinAndSelect('ua.reporterId', 'r')
      .leftJoinAndSelect('r.image', 'rimage')
      .leftJoinAndSelect('ua.attendeeId', 'a')
      .leftJoinAndSelect('a.image', 'aimage')
      .select([
        'ua.id',
        'ua.score',
        'ua.description',
        'ua.createdAt',
        'ua.updatedAt',
        'r.id',
        'r.username',
        'rimage',
        'a.id',
        'a.username',
        'aimage',
      ])
      .getMany()

    return result
  }
  async getUserAppliedEvents(userId: number, status: EVENT_APPLY_STATUS) {
    const result = await this.eventApplyRepo
      .createQueryBuilder('ea')
      .andWhere('ea.userId = :userId', { userId })
      .andWhere('ea.status = :status', { status })
      .leftJoinAndSelect('ea.event', 'event')
      .innerJoinAndSelect('event.user', 'user')
      .innerJoinAndSelect('user.image', 'userImage')
      .innerJoinAndSelect('event.category', 'subCategory')
      .innerJoinAndSelect('subCategory.parentId', 'category')
      .innerJoinAndSelect('event.image', 'image')
      .leftJoinAndSelect('event.address', 'address')
      .leftJoinAndSelect('event.hashTags', 'hashtag')
      .leftJoinAndSelect('event.likes', 'likes')
      .leftJoinAndSelect('event.careerCategories', 'careerCategories')
      .leftJoinAndSelect('likes.user', 'eventLikesUser')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(eventLikes.id)', 'count')
          .from(EventLike, 'eventLikes')
          .where('eventLikes.eventId = event.id')
      }, 'eventLikes')
      .select([
        'ea.id',
        'event',
        'user',
        'userImage',
        'subCategory',
        'category',
        'image',
        'address',
        'hashtag',
        'likes',
        'careerCategories',
        'eventLikesUser',
      ])
      .getMany()
    return result
  }
  async getUserMadeEvents(userId: number) {
    const result = await this.eventRepo
      .createQueryBuilder('event')

      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('user.image', 'userImage')

      .innerJoinAndSelect('event.category', 'subCategory')
      .innerJoinAndSelect('subCategory.parentId', 'category')
      .innerJoinAndSelect('event.image', 'image')

      .leftJoinAndSelect('event.address', 'address')
      .leftJoinAndSelect('event.hashTags', 'hashtag')
      .leftJoinAndSelect('event.likes', 'likes')
      .leftJoinAndSelect('event.careerCategories', 'careerCategories')
      .leftJoinAndSelect('likes.user', 'eventLikesUser')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(eventLikes.id)', 'count')
          .from(EventLike, 'eventLikes')
          .where('eventLikes.eventId = event.id')
      }, 'eventLikes')
      .andWhere('event.userId = :userId', { userId })
      .select([
        'event',
        'user',
        'userImage',
        'subCategory',
        'category',
        'image',
        'address',
        'hashtag',
        'likes',
        'careerCategories',
        'eventLikesUser',
      ])
      .getMany()

    return result.map((event) => {
      return {
        event,
      }
    })
  }
  async getUserLikedEvents(userId: number) {
    const result = await this.eventLikeRepo
      .createQueryBuilder('el')
      .andWhere('el.userId = :userId', { userId })
      .leftJoinAndSelect('el.event', 'event')
      .innerJoinAndSelect('event.user', 'user')
      .innerJoinAndSelect('user.image', 'userImage')
      .innerJoinAndSelect('event.category', 'subCategory')
      .innerJoinAndSelect('subCategory.parentId', 'category')
      .innerJoinAndSelect('event.image', 'image')
      .leftJoinAndSelect('event.address', 'address')
      .leftJoinAndSelect('event.hashTags', 'hashtag')
      .leftJoinAndSelect('event.likes', 'likes')
      .leftJoinAndSelect('event.careerCategories', 'careerCategories')
      .leftJoinAndSelect('likes.user', 'eventLikesUser')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(eventLikes.id)', 'count')
          .from(EventLike, 'eventLikes')
          .where('eventLikes.eventId = event.id')
      }, 'eventLikes')
      .select([
        'el.id',
        'event',
        'user',
        'userImage',
        'subCategory',
        'category',
        'image',
        'address',
        'hashtag',
        'likes',
        'careerCategories',
        'eventLikesUser',
      ])
      .getMany()
    return result
  }
  async getUserAppliedEventsCount(userId: number, eventType: number) {
    // eventType : 1 크루, 2 챌린지
    const result = await this.eventApplyRepo
      .createQueryBuilder('ea')
      .leftJoinAndSelect('ea.event', 'ev')
      .leftJoinAndSelect('ev.category', 'subcat')
      .leftJoinAndSelect('subcat.parentId', 'parentcat')
      .andWhere('ea.userId = :userId', { userId })
      .andWhere('ea.status = :status', { status: 3 })
      .andWhere('parentcat.id = :pid', { pid: eventType })
      .select(['COUNT(ev.id) as count'])
      .getRawOne()
    return result
  }
  async getUserMadeEventsCount(userId: number) {
    const result = await this.eventRepo
      .createQueryBuilder('event')
      .andWhere('event.userId = :userId', { userId })
      .select(['COUNT(event.id) as count'])
      .getRawOne()
    return result
  }
}

export default new UserService()
