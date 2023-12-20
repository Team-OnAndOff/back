import { NextFunction, Router } from 'express'
// import validate from '../../middlewares/validate'
import UserController from '../../controllers/users'
import { validateRequest } from 'zod-express-middleware'
import { z } from 'zod'
import { ApiError } from '../../utils/error'
import HttpStatus from 'http-status'
import { isLogin, passport } from '../../config/passport'
import { logger } from '../../config/logger'
const router = Router()

const getUserValidator = {
  params: z
    .object({
      user_id: z.string(),
      type: z.enum(['info', 'detail']),
    })
    .strict(),
}
const userIdValidator = {
  params: z
    .object({
      user_id: z.string(),
    })
    .strict(),
}

const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const updateUserValidator = {
  params: z
    .object({
      user_id: z.string(),
    })
    .strict(),
  body: z
    .object({
      username: z.string().optional(),
      email: z.string().email('이메일 형식이 잘못되었습니다.').optional(),
      introduction: z.string().optional(),
      image: z
        .any()
        .refine(
          (files) => files?.length < 2,
          '이미지는 하나 이상 저장할 수 없습니다.',
        )
        .refine(
          (files) => files?.[0]?.size <= MAX_FILE_SIZE,
          `이미지 크기는 5MB 이상은 사용할 수 없습니다..`,
        )
        .refine(
          (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
          '.jpg, .jpeg, .png 만 이용 가능합니다.',
        )
        .optional(),
      careerCategoryId: z.string().optional(),
    })
    .strict(),
}

const postAssessValidator = {
  body: z
    .object({
      eventId: z.number(),
      attendeeId: z.number(),
      score: z.number().min(0).max(5),
      description: z.string().optional(),
    })
    .strict(),
}
const updateAssessValidator = {
  params: z.object({ assess_id: z.string() }).strict(),
  body: z
    .object({
      score: z.number().min(0).max(5),
      description: z.string().optional(),
    })
    .strict(),
}
const deleteAssessValidator = {
  params: z.object({ assess_id: z.string() }).strict(),
}

router.get(
  '/:user_id/assess',
  validateRequest(userIdValidator),
  UserController.getAssessingList,
)
router.get(
  '/:user_id/my-assess',
  isLogin,
  validateRequest(userIdValidator),
  UserController.getAssessedList,
)
router.get(
  '/:user_id/:type',
  validateRequest(getUserValidator),
  UserController.getUser,
)

router.put(
  '/:user_id',
  isLogin,
  validateRequest(updateUserValidator),
  UserController.updateUser,
)
router.post(
  '/assess',
  isLogin,
  validateRequest(postAssessValidator),
  UserController.postAssess,
)

router.put(
  '/assess/:assess_id',
  isLogin,
  validateRequest(updateAssessValidator),
  UserController.updateAssess,
)
router.delete(
  '/assess/:assess_id',
  isLogin,
  validateRequest(deleteAssessValidator),
  UserController.deleteAssess,
)

export default router