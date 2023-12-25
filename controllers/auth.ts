import httpStatus from 'http-status'
import { catchAsync } from '../utils/catchAsync'
import { ResponseDTO } from '../models/typeorm/dto/ResponseDTO'

export default class AuthController {
  static getLoginCallback = catchAsync(async (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.session.originUrl) {
        console.log(req.sessionID, req.session)
        res.redirect(req.session.originUrl)
      }
      res
        .status(httpStatus.OK)
        .json(new ResponseDTO(httpStatus.OK, '로그인 성공'))
    } else {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json(new ResponseDTO(httpStatus.UNAUTHORIZED, '로그인 필요합니다.'))
    }
  })
  static getLogout = catchAsync(async (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err)
      }
      req.session.destroy(function (err: any) {
        // res.clearCookie('connect.sid')
        res.clearCookie('SESSIONID')
        res
          .status(httpStatus.OK)
          .json(new ResponseDTO(httpStatus.OK, '로그아웃 성공'))
      })
    })
  })
  static getWithdraw = catchAsync(async (req, res, next) => {
    res.status(httpStatus.OK).json()
  })
}
