import { Request } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../utils/catchAsync'
import service from '../services/events'
import {
  EventBodyDTO,
  EventParamsDTO,
  EventQueryDTO,
  EventRequestParams,
  EventRequestQuery,
} from '../models/typeorm/dto/EventDTO'
import { Event } from '../models/typeorm/entity/Event'
import { createResponse } from '../utils/createResponse'
import { ImageDTO } from '../models/typeorm/dto/ImageDTO'

export default class EventController {
  private static extractParams(req: Request): EventParamsDTO {
    const params = req.params as unknown as EventRequestParams
    return new EventParamsDTO(params)
  }

  private static extractBody(req: Request): EventBodyDTO {
    return new EventBodyDTO(req.body)
  }

  private static extractQuery(req: Request): EventQueryDTO {
    return new EventQueryDTO(req.query as EventRequestQuery)
  }

  private static extractFile(req: Request): ImageDTO {
    return new ImageDTO(req.file!)
  }

  static getEvents = catchAsync(async (req, res, next) => {
    const query = this.extractQuery(req)
    const events = await service.getEvents(query)
    res.status(httpStatus.OK).json(createResponse<Event[]>(events))
  })

  static getEvent = catchAsync(async (req, res, next) => {
    const { id } = EventController.extractParams(req)
    const event = await service.getEventById(id)
    res.status(httpStatus.OK).json(createResponse<Event>(event))
  })

  static createEvent = catchAsync(async (req, res, next) => {
    const file = EventController.extractFile(req)
    const body = EventController.extractBody(req)
    await service.createEvent(body, file)
    res
      .status(httpStatus.OK)
      .json(createResponse<Event>(undefined, httpStatus.CREATED, '등록 성공'))
  })

  static updateEvent = catchAsync(async (req, res, next) => {
    const { id } = EventController.extractParams(req)
    const body = EventController.extractBody(req)
    const event = await service.updateEventById(id, body)
    res.status(httpStatus.OK).json(createResponse<Event>(event))
  })

  static deleteEvent = catchAsync(async (req, res, next) => {
    const { id } = EventController.extractParams(req)
    await service.deleteEventById(id)
    res.status(httpStatus.OK).json(createResponse<Event>())
  })

  static updateEventLike = catchAsync(async (req, res, next) => {
    const { id } = EventController.extractParams(req)
    const body = EventController.extractBody(req)
    await service.updateEventLike(id, body)
    res.status(httpStatus.OK).json(createResponse<Event>())
  })
}
