import { Router } from 'express'
import validate from '../../middlewares/validate'
import EventController from '../../controllers/events'
import {
  EventBodyDTO as BodyDTO,
  EventParamsDTO as ParamsDTO,
  EventQueryDTO as QueryDTO,
} from '../../models/typeorm/dto/EventDTO'
import { ImageDTO } from '../../models/typeorm/dto/ImageDTO'
import { upload } from '../../utils/upload'
import { EventLikeBodyDTO } from '../../models/typeorm/dto/EventLIkeDTO'
import {
  EventApplyBodyDTO as ApplyBodyDTO,
  EventApplyQueryDTO as ApplyQueryDTO,
  EventApplyUpdateBodyDTO as ApplyUpdateBodyDTO,
} from '../../models/typeorm/dto/EventAppliesDTO'

const router = Router()

router.get('/', validate(QueryDTO, 'query'), EventController.getEvents)

router.get('/:id', validate(ParamsDTO, 'params'), EventController.getEvent)

router.post(
  '/',
  upload.single('image'),
  validate(BodyDTO),
  validate(ImageDTO, 'file'),
  EventController.createEvent,
)

// router.put(
//   '/:id',
//   validate(ParamsDTO, 'params'),
//   validate(EventBodyDTO),
//   EventController.updateEvent,
// )

router.delete(
  '/:id',
  validate(ParamsDTO, 'params'),
  EventController.deleteEvent,
)

router.put(
  '/:id/likes',
  validate(ParamsDTO, 'params'),
  validate(EventLikeBodyDTO),
  EventController.updateEventLike,
)

router.get(
  '/:id/applies',
  validate(ParamsDTO, 'params'),
  validate(ApplyQueryDTO, 'query'),
  EventController.getEventApplies,
)

router.post(
  '/:id/applies',
  validate(ParamsDTO, 'params'),
  validate(ApplyBodyDTO),
  EventController.createEventApply,
)

router.delete(
  '/:id/applies/:applyId',
  validate(ParamsDTO, 'params'),
  EventController.deleteEventApply,
)

router.get(
  '/:id/applies/:applyId',
  validate(ParamsDTO, 'params'),
  EventController.getEventApply,
)

router.put(
  '/:id/applies/:applyId/answer',
  validate(ParamsDTO, 'params'),
  validate(ApplyUpdateBodyDTO),
  EventController.updateEventApply,
)

router.put(
  '/:id/applies/:applyId/flag',
  validate(ParamsDTO, 'params'),
  validate(ApplyUpdateBodyDTO),
  EventController.updateEventApply,
)

router.put(
  '/:id/applies/:applyId/status',
  validate(ParamsDTO, 'params'),
  validate(ApplyUpdateBodyDTO),
  EventController.updateEventApply,
)

export default router
