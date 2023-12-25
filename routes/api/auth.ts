import { Router } from 'express'
// import validate from '../../middlewares/validate'
import AuthController from '../../controllers/auth'
import { validateRequest } from 'zod-express-middleware'
import { z } from 'zod'
import { ApiError } from '../../utils/error'
import HttpStatus from 'http-status'
import { passport } from '../../config/passport'
import { logger } from '../../config/logger'
const router = Router()

// passport-google-oauth2
// passport-kakao
// passport-facebook
// passport-naver
// export const oauthList = ['google', 'kakao', 'facebook', 'naver'] as const

export enum OAuthEnum {
  GOOGLE = 'google',
  KAKAO = 'kakao',
  FACEBOOK = 'facebook',
  NAVER = 'naver',
  GITHUB = 'github',
}

const socialValidator = {
  params: z
    .object({
      social: z.nativeEnum(OAuthEnum),
    })
    .strict(),
  query: z.object({
    host: z.string().optional(),
    redirectPath: z.string().optional(),
    profilePath: z.string().optional(),
  }),
}
const socialCallbackValidator = {
  params: z
    .object({
      social: z.nativeEnum(OAuthEnum),
    })
    .strict(),
  query: z.object({ code: z.string() }),
}
router.get(
  '/login/:social',
  validateRequest(socialValidator),
  (req, res, next) => {
    logger.info('social Login!', req.user)
    req.session.originUrl = `${req.query.host}${req.query.redirectPath}`
    req.session.profileUrl = `${req.query.host}${req.query.profilePath}`
    console.log(req.sessionID, req.session)

    const socialName = req.params.social
    let nextMiddleware = null
    if (socialName === OAuthEnum.GOOGLE) {
      nextMiddleware = passport.authenticate(socialName, {
        scope: ['profile'],
        prompt: 'select_account',
      })
    } else if (socialName === OAuthEnum.GITHUB) {
      nextMiddleware = passport.authenticate(socialName, {
        prompt: 'login',
      })
    } else {
      nextMiddleware = passport.authenticate(socialName)
    }
    nextMiddleware(req, res, next)
  },
)
router.get(
  '/login/:social/callback',
  validateRequest(socialCallbackValidator),

  (req, res, next) => {
    logger.info('callback으로 돌아옴!')
    passport.authenticate(req.params.social, {
      // successRedirect: req.session.originUrl,
    })(req, res, next)
  },
  (req, res, next) => {
    const reqUser: any = req.user
    if (req.session.originUrl) {
      if (req.session.isNewUser) {
        res.redirect(`${req.session.profileUrl}/${reqUser.id}` || '')
      }
      res.redirect(req.session.originUrl || '')
    }
    next()
  },
  AuthController.getLoginCallback,
)

router.get('/logout', AuthController.getLogout)
router.get('/withdraw', AuthController.getWithdraw)

export default router
