import httpStatus from 'http-status'
import { catchAsync } from '../utils/catchAsync'
import {
  GetUserDTO,
  PostAssessDTO,
  UpdateAssessDTO,
  UpdateUserDTO,
  UserIdDTO,
} from '../models/typeorm/dto/UserDTO'
import userService from '../services/users'
import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/error'
import { User } from '../models/typeorm/entity/User'
import { ResponseDTO } from '../models/typeorm/dto/ResponseDTO'
import { ImageDTO } from '../models/typeorm/dto/ImageDTO'
// import { IUserRequest } from '../config/passport'
import userReportService from '../services/reportUsers'
import { http } from 'winston'
import { CreateUserReportDTO } from '../models/typeorm/dto/ReportUserDTO'

export default class ReportUserController {
  static getUserReports = catchAsync(async (req: any, res, next) => {
    const reports = await userReportService.findUserReports(req.user.id)
    res.status(httpStatus.OK).json(new ResponseDTO(httpStatus.OK, '', reports))
  })
  static postUserReport = catchAsync(async (req: any, res, next) => {
    const reporterId = req.user.id
    const reportedId = req.body.attendeeId
    const description = req.body.description
    const dto = new CreateUserReportDTO(reporterId, reportedId, description)
    const result = await userReportService.createUserReport(dto)
    res.status(httpStatus.OK).json(new ResponseDTO(httpStatus.OK, '', result))
  })
  static getUserReportDetail = catchAsync(async (req, res, next) => {
    const reportId = Number(req.params.report_id)
    const result = await userReportService.findUserReportDetail(reportId)
    res.status(httpStatus.OK).json(new ResponseDTO(httpStatus.OK, '', result))
  })
}
