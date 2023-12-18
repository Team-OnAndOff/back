import { Router } from 'express'
import validate from '../../middlewares/validate'
import ReportEventsController from '../../controllers/reportEvents'
import {
  ReportEventBodyDTO,
  ReportEventParamsDTO,
} from '../../models/typeorm/dto/ReportEventDTO'

const router = Router()

router.get('/', ReportEventsController.getReportEvents)

router.get(
  '/:eventId',
  validate(ReportEventParamsDTO, 'params'),
  ReportEventsController.getReportEventsByEventId,
)

router.get(
  '/:eventId/:reportId',
  validate(ReportEventParamsDTO, 'params'),
  ReportEventsController.getReportEventByReportId,
)

router.post(
  '/',
  validate(ReportEventBodyDTO),
  ReportEventsController.createReportEvent,
)

export default router
