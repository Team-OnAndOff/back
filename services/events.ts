import httpStatus from 'http-status'
import { AppDataSource } from '../models/typeorm/data-source'
import { Event } from '../models/typeorm/entity/Event'
import { EventBodyDTO, EventQueryDTO } from '../models/typeorm/dto/EventDTO'
import { ApiError } from '../utils/error'
import { ImageDTO } from '../models/typeorm/dto/ImageDTO'
import { s3Delete, s3Upload } from '../utils/s3'
import UserService from '../services/users'
import CategoryService from '../services/categories'
import CareerCategoryService from '../services/careerCategories'
import { Image } from '../models/typeorm/entity/Image'
import { EventAddress } from '../models/typeorm/entity/EventAddress'
import { CareerCategory } from '../models/typeorm/entity/CareerCategory'
import { EventHashTag } from '../models/typeorm/entity/EventHashTag'
import { EventLikeBodyDTO } from '../models/typeorm/dto/EventLIkeDTO'
import { EventLike } from '../models/typeorm/entity/EventLike'
import {
  EventApplyBodyDTO,
  EventApplyUpdateBodyDTO,
} from '../models/typeorm/dto/EventAppliesDTO'
import { EventApply } from '../models/typeorm/entity/EventApply'
import { EVENT_APPLY_FLAG, EVENT_APPLY_STATUS } from '../types'

class EventService {
  private readonly eventRepo
  private readonly eventLikeRepo
  private readonly eventApplyRepo

  constructor() {
    this.eventRepo = AppDataSource.getRepository(Event)
    this.eventLikeRepo = AppDataSource.getRepository(EventLike)
    this.eventApplyRepo = AppDataSource.getRepository(EventApply)
  }

  getQueryBuilder = () => {
    return this.eventRepo
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('user.image', 'userImage')
      .innerJoinAndSelect('event.category', 'subCategory')
      .innerJoinAndSelect('subCategory.parentId', 'category')
      .leftJoinAndSelect('event.image', 'image')
      .leftJoinAndSelect('event.address', 'address')
      .leftJoinAndSelect('event.hashTags', 'hashtag')
      .loadRelationCountAndMap('event.likes', 'event.likes')
  }

  getAppliesQueryBuilder = () => {
    return this.eventApplyRepo
      .createQueryBuilder('eventApply')
      .innerJoinAndSelect('eventApply.user', 'user')
      .leftJoinAndSelect('user.image', 'userImage')
  }

  async getEvents(query: EventQueryDTO) {
    const { categoryId, subCategoryId } = query
    const queryBuilder = this.getQueryBuilder()

    if (categoryId) {
      queryBuilder.where('category.id = :categoryId', {
        categoryId: categoryId,
      })
    }

    if (subCategoryId) {
      queryBuilder.andWhere('subCategory.id = :subCategoryId', {
        subCategoryId: subCategoryId,
      })
    }

    const events = await queryBuilder.getMany()

    return events
  }

  async getEventById(eventId: number) {
    const event = await this.getQueryBuilder()
      .where('event.id = :eventId', { eventId })
      .getOne()

    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, '모임 정보를 찾을 수 없습니다.')
    }

    return event
  }

  async createEvent(body: EventBodyDTO, file: ImageDTO) {
    const currentDate = new Date()
    const user = await UserService.findOneById(body.userId)
    const category = await CategoryService.getSubCategoryById(
      body.categoryId,
      body.subCategoryId,
    )

    if (!user) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        '유저가 존재하지 않음',
      )
    }

    const upload = await s3Upload(file)
    try {
      const event = new Event()
      event.user = user
      event.category = category
      event.title = body.title
      event.content = body.content
      event.recruitment = body.recruitment
      event.question = body.question
      event.online = body.online
      event.challengeStartDate = body.challengeStartDate
      event.challengeEndDate = body.challengeEndDate

      const hashTags: EventHashTag[] = []
      if (body.hashTag) {
        for (let i = 0; i < body.hashTag.length; i++) {
          const tag = new EventHashTag()
          tag.hashtag = body.hashTag[i]
          hashTags.push(tag)
        }

        event.hashTags = hashTags
      }

      const address = new EventAddress()
      if (body.address) {
        address.zipCode = body.address.zipCode
        address.detail1 = body.address.detail1
        address.detail2 = body.address.detail2
        address.latitude = body.address.latitude
        address.longitude = body.address.longitude

        event.address = address
      }

      const image = new Image()
      image.filename = upload.filename
      image.size = upload.size
      image.uploadPath = upload.destination
      event.image = image

      const careerCategories: CareerCategory[] = []
      if (body.careerCategoryIds) {
        for (let i = 0; i < body.careerCategoryIds.length; i++) {
          const item = await CareerCategoryService.getCareerCategoryById(
            body.careerCategoryIds[i],
          )
          careerCategories.push(item)
        }

        event.careerCategories = careerCategories
      }

      const applies: EventApply[] = []
      const apply = new EventApply()
      apply.user = user
      apply.event = event
      apply.answer = ''
      apply.flag = EVENT_APPLY_FLAG.LEADER
      apply.appliedAt = currentDate
      apply.approvedAt = currentDate
      apply.status = EVENT_APPLY_STATUS.APPROVED
      applies.push(apply)
      event.eventApplies = applies

      const response = await AppDataSource.manager.save(event)
      return response
    } catch (err) {
      await s3Delete(upload.filename)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, '모임 등록 실패')
    }
  }

  async updateEventById(eventId: number, body: EventBodyDTO) {
    const response = await this.eventRepo.update({ id: eventId }, body)

    if (response.affected === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, '모임 정보를 찾을 수 없습니다.')
    }

    return await this.getEventById(eventId)
  }

  async deleteEventById(eventId: number) {
    const event = await this.getEventById(eventId)

    await s3Delete(event.image.filename)
    const response = await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(EventHashTag)
          .where('eventId = :eventId', { eventId })
          .execute()
        const response = await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(Event)
          .where('id = :id', { id: eventId })
          .execute()
        if (event.image) {
          await transactionalEntityManager
            .createQueryBuilder()
            .delete()
            .from(Image)
            .where('id = :id', { id: event.image.id })
            .execute()
        }
        if (event.address) {
          await transactionalEntityManager
            .createQueryBuilder()
            .delete()
            .from(EventAddress)
            .where('id = :id', { id: event.address.id })
            .execute()
        }
        return response
      },
    )

    if (response.affected === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, '모임 정보를 찾을 수 없습니다.')
    }

    return response
  }

  async updateEventLike(eventId: number, body: EventLikeBodyDTO) {
    const event = await this.getEventById(eventId)
    const user = await UserService.findOneById(body.userId)

    if (!user) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        '유저가 존재하지 않음',
      )
    }

    const existingEventLike = await this.eventLikeRepo
      .createQueryBuilder('like')
      .where('like.event = :eventId', { eventId })
      .andWhere('like.user = :userId', { userId: body.userId })
      .getOne()

    let response
    if (existingEventLike) {
      response = await this.eventLikeRepo
        .createQueryBuilder()
        .delete()
        .from(EventLike)
        .where('id = :id', { id: existingEventLike.id })
        .execute()
    } else {
      response = await this.eventLikeRepo
        .createQueryBuilder()
        .insert()
        .into(EventLike)
        .values({
          user,
          event,
          liked: new Date(),
        })
        .execute()
    }

    return response
  }

  async getEventApplies(eventId: number, status?: string) {
    const queryBuilder = await this.getAppliesQueryBuilder().where(
      'eventApply.eventId = :eventId',
      { eventId },
    )

    if (status) {
      queryBuilder.andWhere('eventApply.status = :status', {
        status: Number(status),
      })
    }

    const response = await queryBuilder.getMany()
    return response
  }

  async getEventApply(applyId: number) {
    const response = await this.getAppliesQueryBuilder()
      .where('eventApply.id = :applyId', { applyId })
      .getOne()

    if (!response) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        '데이터가 존재하지 않습니다.',
      )
    }

    return response
  }

  async createEventApply(eventId: number, body: EventApplyBodyDTO) {
    const event = await this.getEventById(eventId)
    const user = await UserService.findOneById(body.userId)

    if (!user) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        '유저가 존재하지 않음',
      )
    }

    const existApply = await this.getAppliesQueryBuilder()
      .where('eventApply.eventId = :eventId', { eventId })
      .andWhere('eventApply.userId = :userId', { userId: user.id })
      .getOne()

    if (existApply) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, '이미 신청했습니다.')
    }

    const apply = new EventApply()
    apply.event = event
    apply.user = user
    apply.answer = body.answer
    apply.flag = EVENT_APPLY_FLAG.MEMBER
    apply.appliedAt = new Date()
    apply.status = EVENT_APPLY_STATUS.APPLY

    const response = await AppDataSource.manager.save(apply)
    return response
  }

  async deleteEventApply(eventId: number, applyId: number) {
    const response = await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        return await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(EventApply)
          .where('id = :id', { id: applyId })
          .andWhere('eventId = :eventId', { eventId })
          .execute()
      },
    )
    if (response.affected === 0) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        '삭제할 데이터가 존재하지 않습니다.',
      )
    }
    return response
  }

  async updateEventApply(
    eventId: number,
    applyId: number,
    dto: EventApplyUpdateBodyDTO,
  ) {
    const { userId, ...data } = dto
    const filteredData = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

    const response = await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        return await transactionalEntityManager
          .createQueryBuilder()
          .update(EventApply)
          .set(filteredData)
          .where('id = :id', { id: applyId })
          .andWhere('eventId = :eventId', { eventId })
          .andWhere('userId = :userId', { userId })
          .execute()
      },
    )

    if (response.affected === 0) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        '수정할 데이터가 존재하지 않습니다.',
      )
    }
    return response
  }
}

export default new EventService()
