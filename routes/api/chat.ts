import { Router } from 'express'
import ChatController from '../../controllers/chat'
import { isLogin } from '../../config/passport'
import RateLimiterMemory from 'express-rate-limit'

const rateLimiter = RateLimiterMemory({
  windowMs: 60 * 1000,
  max: 1000,
  handler(req, res, next, option) {
    res.status(option.statusCode).json({ errorMsg: '너무 요청이 많습니다.' })
  },
})

const router = Router()

router.get('/rooms', isLogin, ChatController.getRooms)
router.get('/rooms/:roomId', isLogin, ChatController.getRoom)
router.get('/user', isLogin, ChatController.getUser)
router.get(
  '/prevMessages',
  isLogin,
  rateLimiter,
  ChatController.getPrevChatMessage,
)

export default router
