import { Request, Response, NextFunction } from 'express'
import { ControllerType } from '../types'
export const catchAsync =
  (fn: ControllerType) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      // logger.error(err);
      next(err)
    })
  }
