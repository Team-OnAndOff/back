import httpStatus from 'http-status'
import { catchAsync } from '../utils/catchAsync'
import service from '../services/events'
import {
  EventBodyDTO as BodyDTO,
  EventParamsDTO as ParamsDTO,
  EventQueryDTO as QueryDTO,
} from '../models/typeorm/dto/EventDTO'
import { Event } from '../models/typeorm/entity/Event'
import { createResponse } from '../utils/createResponse'
import { ImageDTO } from '../models/typeorm/dto/ImageDTO'
import {
  EventApplyBodyDTO as ApplyBodyDTO,
  EventApplyQueryDTO as ApplyQueryDTO,
  EventApplyUpdateBodyDTO as ApplyUpdateBodyDTO,
} from '../models/typeorm/dto/EventAppliesDTO'
import RequestHandler from './requestHandler'
import { EventApply } from '../models/typeorm/entity/EventApply'

export default class EventController extends RequestHandler {
  static getEvents = catchAsync(async (req, res, next) => {
    const query = this.extractQuery<QueryDTO>(req, QueryDTO)
    const events = await service.getEvents(query)
    res.status(httpStatus.OK).json(createResponse<Event[]>(events))
  })

  static getEvent = catchAsync(async (req, res, next) => {
    const { id } = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const event = await service.getEventById(id)
    res.status(httpStatus.OK).json(createResponse<Event>(event))
  })

  static createEvent = catchAsync(async (req, res, next) => {
    const file = this.extractFile<ImageDTO>(req, ImageDTO)
    const body = this.extractBody<BodyDTO>(req, BodyDTO)
    await service.createEvent(body, file)
    res
      .status(httpStatus.OK)
      .json(createResponse<Event>(undefined, httpStatus.CREATED, '등록 성공'))
  })

  static updateEvent = catchAsync(async (req, res, next) => {
    const { id } = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const body = this.extractBody<BodyDTO>(req, BodyDTO)
    const event = await service.updateEventById(id, body)
    res.status(httpStatus.OK).json(createResponse<Event>(event))
  })

  static deleteEvent = catchAsync(async (req, res, next) => {
    const { id } = this.extractParams<ParamsDTO>(req, ParamsDTO)
    await service.deleteEventById(id)
    res.status(httpStatus.OK).json(createResponse<Event>())
  })

  static updateEventLike = catchAsync(async (req: any, res, next) => {
    const { id } = this.extractParams<ParamsDTO>(req, ParamsDTO)
    await service.updateEventLike(id, req.user.id)
    res.status(httpStatus.OK).json(createResponse<Event>())
  })

  static getEventApplies = catchAsync(async (req: any, res, next) => {
    const { id } = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const { status } = this.extractQuery<ApplyQueryDTO>(req, ApplyQueryDTO)
    const response = await service.getEventApplies(req.user.id, id, status)
    res.status(httpStatus.OK).json(createResponse<EventApply[]>(response))
  })

  static createEventApply = catchAsync(async (req: any, res, next) => {
    const { id } = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const body = this.extractBody<ApplyBodyDTO>(req, ApplyBodyDTO)
    await service.createEventApply(req.user.id, id, body)
    res.status(httpStatus.OK).json(createResponse<EventApply>())
  })

  static getEventApply = catchAsync(async (req, res, next) => {
    const { applyId } = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const response = await service.getEventApply(applyId!)
    res.status(httpStatus.OK).json(createResponse<EventApply>(response))
  })

  static deleteEventApply = catchAsync(async (req, res, next) => {
    const { id, applyId } = this.extractParams<ParamsDTO>(req, ParamsDTO)
    await service.deleteEventApply(id, applyId!)
    res.status(httpStatus.OK).json(createResponse<EventApply>())
  })

  static updateEventApply = catchAsync(async (req, res, next) => {
    const { id, applyId } = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const body = this.extractBody<ApplyUpdateBodyDTO>(req, ApplyUpdateBodyDTO)
    await service.updateEventApply(id, applyId!, body)
    res.status(httpStatus.OK).json(createResponse<EventApply>())
  })
}
