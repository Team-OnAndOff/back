import _passport, { Profile } from 'passport'
import { Express, NextFunction } from 'express'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as KakaoStrategy } from 'passport-kakao'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as NaverStrategy } from 'passport-naver'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { ApiError } from '../utils/error'
import httpStatus from 'http-status'
import dotenv from 'dotenv'

import { logger } from './logger'
import UserService from '../services/users'
import { User } from '../models/typeorm/entity/User'
import { createUserDTO } from '../models/typeorm/dto/UserDTO'
import { OAuthEnum } from '../routes/api/auth'

dotenv.config()
export const passport = _passport
export const isLogin = (req: any, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new ApiError(httpStatus.Unauthorized, '로그인 필요')
    // Unauthorized or Unauthenticated
  }
  next()
}

const bringUser = async (profile: Profile, oauthType: OAuthEnum) => {
  logger.info(oauthType, '로그인 시도!')
  let user = await UserService.findOneBySocialId(profile.id)
  if (!user) {
    user = await UserService.createUser(
      new createUserDTO(profile.id, OAuthEnum.KAKAO),
    )
  }
  logger.info(user)
  return user
}

export const setOauthStrategies = (_app: Express) => {
  const app_location = `${process.env.APP_LOCATION}:${process.env.APP_PORT}`
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID!,
        // clientSecret: process.env.KAKAO_CLIENT_SECRET!,
        callbackURL: `${app_location}/${process.env.KAKAO_CALLBACK_PATH!}`,
      },
      async function (accessToken, refreshToken, profile, cb) {
        const user = await bringUser(profile, OAuthEnum.KAKAO)
        cb(null, user)
      },
    ),
  )
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${app_location}/${process.env.GOOGLE_CALLBACK_PATH!}`,
      },
      async function (accessToken, refreshToken, profile, cb) {
        const user = await bringUser(profile, OAuthEnum.GOOGLE)
        cb(null, user)
      },
    ),
  )

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: `${app_location}/${process.env
          .GITHUB_CALLBACK_PATH!}?prompt=login`,
      },
      async function (
        accessToken: any,
        refreshToken: any,
        profile: Profile,
        cb: any,
      ) {
        const user = await bringUser(profile, OAuthEnum.GITHUB)
        cb(null, user)
      },
    ),
  )

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        callbackURL: `${app_location}${process.env.FACEBOOK_CALLBACK_PATH!}`,
      },
      function (accessToken, refreshToken, profile, done) {},
    ),
  )
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID!,
        clientSecret: process.env.NAVER_CLIENT_SECRET!,
        callbackURL: `${app_location}${process.env.NAVER_CALLBACK_PATH!}`,
      },
      function (accessToken, refreshToken, profile, done) {},
    ),
  )

  // login이 최초로 성공했을 때만 호출되는 함수
  // done(null, user.id)로 세션을 초기화 한다.
  passport.serializeUser(function (user: any, done) {
    console.log(user)
    done(null, user.socialId)
  })

  // 사용자가 페이지를 방문할 때마다 호출되는 함수
  // done(null, id)로 사용자의 정보를 각 request의 user 변수에 넣어준다.
  passport.deserializeUser(async function (id: string, done) {
    const user = await UserService.findOneBySocialId(id)
    console.log('deserializeUser', user)
    done(null, user)
  })
}
