import { Repository } from 'typeorm'
import httpStatus from 'http-status'
import { AppDataSource } from '../models/typeorm/data-source'
import { EventComplaint } from '../models/typeorm/entity/EventComplaint'
import { ReportEventBodyDTO } from '../models/typeorm/dto/ReportEventDTO'
import { ApiError } from '../utils/error'
import UserService from '../services/users'
import EventService from '../services/events'

class ReportEventService {
  private readonly repo: Repository<EventComplaint>

  constructor() {
    this.repo = AppDataSource.getRepository(EventComplaint)
  }

  getQueryBuilder = () => {
    return this.repo
      .createQueryBuilder('eventComplaint')
      .innerJoinAndSelect('eventComplaint.user', 'user')
      .innerJoinAndSelect('eventComplaint.event', 'event')
      .select([
        'eventComplaint.id',
        'eventComplaint.description',
        'user.id',
        'event.id',
        'event.title',
      ])
  }

  async getReportEvents() {
    const response = await this.getQueryBuilder().getMany()
    return response
  }

  async getReportEventsByEventId(eventId: number) {
    const response = await this.getQueryBuilder()
      .where('event.id = :eventId', { eventId })
      .getMany()
    return response
  }

  async getReportEventByIdReportId(eventId: number, reportId?: number) {
    const response = await this.getQueryBuilder()
      .where('eventComplaint.eventId = :eventId', { eventId })
      .andWhere('eventComplaint.userId = :reportId', { reportId })
      .getOne()

    if (!response) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '모임 신고 정보를 찾을 수 없습니다.',
      )
    }

    return response
  }

  async createReportEvent(body: ReportEventBodyDTO) {
    const user = await UserService.findOneById(body.reporterId)
    const event = await EventService.getEventById(body.eventId)
    if (!user) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        '유저가 존재하지 않음',
      )
    }

    const reportEvent = new EventComplaint()
    reportEvent.event = event
    reportEvent.user = user
    reportEvent.description = body.description

    const response = await AppDataSource.manager.save(reportEvent)
    return response
  }
}

export default new ReportEventService()
