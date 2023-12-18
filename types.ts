import { Request, Response, NextFunction } from 'express'
export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void

export type RequestPart = 'body' | 'params' | 'query' | 'file'
