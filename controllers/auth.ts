import httpStatus from 'http-status'
import { catchAsync } from '../utils/catchAsync'

export default class AuthController {
  static getLogin = catchAsync(async (req, res, next) => {
    res.status(httpStatus.OK).json()
  })
  static getLoginCallback = catchAsync(async (req, res, next) => {
    if (req.isAuthenticated()) {
      res.status(httpStatus.OK).json({ message: '로그인 성공' })
    } else {
      res.status(httpStatus.UNAUTHORIZED).json({ message: '로그인 실패' })
    }
  })
  static getLogout = catchAsync(async (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err)
      }
      req.session.destroy(function (err: any) {
        res.clearCookie('connect.sid')
        res.status(httpStatus.OK).json({ message: '로그아웃 성공' })
      })
    })
  })
  static getWithdraw = catchAsync(async (req, res, next) => {
    res.status(httpStatus.OK).json()
  })
}
