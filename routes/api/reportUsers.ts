import { NextFunction, Router } from 'express'
// import validate from '../../middlewares/validate'
import ReportUserController from '../../controllers/reportUsers'
import { validateRequest } from 'zod-express-middleware'
import { z } from 'zod'
import { ApiError } from '../../utils/error'
import HttpStatus from 'http-status'
import { isLogin, passport } from '../../config/passport'
import { logger } from '../../config/logger'

const router = Router()

const postUserReportValidator = {
  body: z
    .object({
      attendeeId: z.number(),
      description: z.string().min(10),
    })
    .strict(),
}
const getUserReportDetailValidator = {
  params: z
    .object({
      report_id: z.string(),
    })
    .strict(),
}

router.get(
  '/:report_id',
  isLogin,
  validateRequest(getUserReportDetailValidator),
  ReportUserController.getUserReportDetail,
)
router.get('/', isLogin, ReportUserController.getUserReports)
router.post(
  '/',
  isLogin,
  validateRequest(postUserReportValidator),
  ReportUserController.postUserReport,
)

export default router
