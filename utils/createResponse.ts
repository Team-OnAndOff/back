import httpStatus from 'http-status'
import { ResponseDTO } from '../models/typeorm/dto/ResponseDTO'

export const createResponse = <T>(
  data?: T,
  statusCode?: number,
  message?: string,
): ResponseDTO<T> => {
  return new ResponseDTO(
    statusCode ?? httpStatus.OK,
    message ?? 'success',
    data,
  )
}
