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

interface UserRequest extends Request {
  user: User
}

export default class UserController {
  static getUserInfo = catchAsync(async (req, res, next) => {
    const user_id = Number(req.params.user_id)
    const user = await userService.findOneById(user_id)
    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        '해당 아이디를 가진 유저가 존재하지 않습니다.',
      )
    }
    res.status(httpStatus.OK).json(
      new ResponseDTO(httpStatus.OK, '', {
        user_id: user.id,
        username: user.username,
        email: user.email,
        introduction: user.introduction,
        image: user.image,
      }),
    )
  })
  static getUserDetail = catchAsync(async (req, res, next) => {
    const reqUser: any = req.user
    const { socialId, ...rest } = reqUser
    res.status(httpStatus.OK).json(new ResponseDTO(httpStatus.OK, '', rest))
  })
  static updateUser = catchAsync(async (req, res, next) => {
    const dto = new UpdateUserDTO(req.params.user_id, req.body, req.file)
    console.log('-->', dto)
    const result = await userService.updateUser(dto)
    res.status(httpStatus.OK).json(new ResponseDTO(httpStatus.OK, '', result))
  })
  static getAssessingList = catchAsync(async (req, res, next) => {
    const userId = Number(req.params.user_id)
    const eventId = req.params.event_id ? Number(req.params.event_id) : null
    const result = await userService.getAssessingList(userId, eventId)
    res.status(httpStatus.OK).json(new ResponseDTO(httpStatus.OK, '', result))
  })
  static getAssessedList = catchAsync(async (req, res, next) => {
    const userId = Number(req.params.user_id)
    const result = await userService.getAssessedList(userId)
    res.status(httpStatus.OK).json(new ResponseDTO(httpStatus.OK, '', result))
  })
  static postAssess = catchAsync(async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(httpStatus.BAD_REQUEST, '')
    }
    const user = req.user as any
    const user_id = user.id
    const dto = new PostAssessDTO(user_id, req.body)
    const result = await userService.createAssess(dto)
    res.status(httpStatus.OK).json(new ResponseDTO(httpStatus.OK, '', result))
  })
  static updateAssess = catchAsync(
    async (
      req: Request & { user?: any },
      res: Response,
      next: NextFunction,
    ) => {
      const dto = new UpdateAssessDTO(
        req.params.assess_id,
        req.user.id,
        req.body.score,
        req.body.description,
      )
      const result = await userService.updateAssess(dto)

      res
        .status(httpStatus.OK)
        .json(new ResponseDTO(httpStatus.OK, '수정성공', result))
    },
  )
  static deleteAssess = catchAsync(
    async (req: Request & { user?: any }, res, next) => {
      const userId = Number(req.user.id)
      const assessId = Number(req.params.assess_id)

      await userService.checkIfAssessIsMine(assessId, userId)
      const result = await userService.deleteAssess(assessId)
      res
        .status(httpStatus.OK)
        .json(new ResponseDTO(httpStatus.OK, '삭제성공', result))
    },
  )
  static getUserAppliedEvents = catchAsync(
    async (req: Request & { user?: any }, res, next) => {
      const userId = Number(req.params.user_id)
      console.log('--->', userId)
      const result = await userService.getUserAppliedEvents(userId)
      res
        .status(httpStatus.OK)
        .json(new ResponseDTO(httpStatus.OK, '등록된 모임목록', result))
    },
  )
}
