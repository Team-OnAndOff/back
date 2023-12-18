import { Request } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../utils/catchAsync'
import service from '../services/reportEvents'
import {
  ReportEventBodyDTO,
  ReportEventParamsDTO,
  ReportEventRequestParams,
} from '../models/typeorm/dto/ReportEventDTO'
import { createResponse } from '../utils/createResponse'
import { EventComplaint } from '../models/typeorm/entity/EventComplaint'

export default class ReportEventsController {
  private static extractParams(req: Request): ReportEventParamsDTO {
    const params = req.params as unknown as ReportEventRequestParams
    return new ReportEventParamsDTO(params)
  }

  private static extractBody(req: Request): ReportEventBodyDTO {
    return new ReportEventBodyDTO(req.body)
  }

  static getReportEvents = catchAsync(async (req, res, next) => {
    const response = await service.getReportEvents()
    res.status(httpStatus.OK).json(createResponse<EventComplaint[]>(response))
  })

  static getReportEventsByEventId = catchAsync(async (req, res, next) => {
    const params = ReportEventsController.extractParams(req)
    const response = await service.getReportEventsByEventId(params.eventId)
    res.status(httpStatus.OK).json(createResponse<EventComplaint[]>(response))
  })

  static getReportEventByReportId = catchAsync(async (req, res, next) => {
    const params = ReportEventsController.extractParams(req)
    const response = await service.getReportEventByIdReportId(
      params.eventId,
      params.reportId,
    )
    res.status(httpStatus.OK).json(createResponse<EventComplaint>(response))
  })

  static createReportEvent = catchAsync(async (req, res, next) => {
    const body = ReportEventsController.extractBody(req)
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
