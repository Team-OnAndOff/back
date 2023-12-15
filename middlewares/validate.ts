import { ClassConstructor } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { catchAsync } from '../utils/catchAsync'

export default function validateMiddleware<T extends object>(
  dto: ClassConstructor<T>,
  name: 'body' | 'params' | 'query' = 'body',
) {
  return catchAsync(async (req, res, next) => {
    try {
      await validateOrReject(new dto(req[name]), { forbidUnknownValues: true })
      next()
    } catch (error) {
      next(error)
    }
  })
}
