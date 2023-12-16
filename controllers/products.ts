import { getProductById } from '../services/products'

import httpStatus from 'http-status'
import { ApiError } from '../utils/error'
import { logger } from '../config/logger'
import { catchAsync } from '../utils/catchAsync'

export const getProduct = catchAsync(async (req, res, next) => {
  const product_id = req.params.id

  const product = await getProductById(product_id)
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, '상품을 찾지 못하였습니다.')
  }
  logger.info(`[pid=${product_id}] : ${product}`)
  console.log(req.user)
  res.status(httpStatus.OK).json(product)
})
