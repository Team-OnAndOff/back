import httpStatus from 'http-status'
import { catchAsync } from '../utils/catchAsync'
import service from '../services/reportEvents'
import {
  ReportEventBodyDTO as BodyDTO,
  ReportEventParamsDTO as ParamsDTO,
} from '../models/typeorm/dto/ReportEventDTO'
import { createResponse } from '../utils/createResponse'
import { EventComplaint } from '../models/typeorm/entity/EventComplaint'
import RequestHandler from './requestHandler'

export default class ReportEventsController extends RequestHandler {
  static getReportEvents = catchAsync(async (req, res, next) => {
    const response = await service.getReportEvents()
    res.status(httpStatus.OK).json(createResponse<EventComplaint[]>(response))
  })

  static getReportEventsByEventId = catchAsync(async (req, res, next) => {
    const params = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const response = await service.getReportEventsByEventId(params.eventId)
    res.status(httpStatus.OK).json(createResponse<EventComplaint[]>(response))
  })

  static getReportEventByReportId = catchAsync(async (req, res, next) => {
    const params = this.extractParams<ParamsDTO>(req, ParamsDTO)
    const response = await service.getReportEventByIdReportId(
      params.eventId,
      params.reportId,
    )
    res.status(httpStatus.OK).json(createResponse<EventComplaint>(response))
  })

  static createReportEvent = catchAsync(async (req, res, next) => {
    const body = this.extractBody<BodyDTO>(req, BodyDTO)
    await service.createReportEvent(body)
    res
      .status(httpStatus.OK)
      .json(
        createResponse<EventComplaint>(
          undefined,
          httpStatus.CREATED,
          '신고 성공',
        ),
      )
  })
}
