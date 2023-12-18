import { Router } from 'express'
import validate from '../../middlewares/validate'
import EventController from '../../controllers/events'
import {
  EventBodyDTO,
  EventParamsDTO,
  EventQueryDTO,
} from '../../models/typeorm/dto/EventDTO'
import { ImageDTO } from '../../models/typeorm/dto/ImageDTO'
import { upload } from '../../utils/upload'

const router = Router()

router.get('/', validate(EventQueryDTO, 'query'), EventController.getEvents)

router.get('/:id', validate(EventParamsDTO, 'params'), EventController.getEvent)

router.post(
  '/',
  upload.single('image'),
  validate(EventBodyDTO),
  validate(ImageDTO, 'file'),
  EventController.createEvent,
)

// router.put(
//   '/:id',
//   validate(EventParamsDTO, 'params'),
//   validate(EventBodyDTO),
//   EventController.updateEvent,
// )

router.delete(
  '/:id',
  validate(EventParamsDTO, 'params'),
  EventController.deleteEvent,
)

export default router
