import { Router } from 'express'
import validate from '../../middlewares/validate'
import ReportEventsController from '../../controllers/reportEvents'
import {
  ReportEventBodyDTO as BodyDTO,
  ReportEventParamsDTO as ParamsDTO,
} from '../../models/typeorm/dto/ReportEventDTO'
import { isLogin } from '../../config/passport'

const router = Router()

router.get('/', ReportEventsController.getReportEvents)

router.get(
  '/:eventId',
  validate(ParamsDTO, 'params'),
  ReportEventsController.getReportEventsByEventId,
)

router.get(
  '/:eventId/:reportId',
  validate(ParamsDTO, 'params'),
  ReportEventsController.getReportEventByReportId,
)

router.post(
  '/',
  isLogin,
  validate(BodyDTO),
  ReportEventsController.createReportEvent,
)

export default router
