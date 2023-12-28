import { Router } from 'express'
import ChatController from '../../controllers/chat'
import { isLogin } from '../../config/passport'

const router = Router()

router.get('/rooms', isLogin, ChatController.getRooms)
router.get('/rooms/:roomId', isLogin, ChatController.getRoom)
router.get('/user', isLogin, ChatController.getUser)
router.get('/prevMessages', isLogin, ChatController.getPrevChatMessage)

export default router
