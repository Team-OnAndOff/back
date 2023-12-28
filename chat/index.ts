import { Server, Socket } from 'socket.io'
import { Router } from 'express'
import ChatService from '../services/chat'
import { CHAT } from '../types'
import httpStatus from 'http-status'
import { ApiError } from '../utils/error'
import { ChatUser } from '../models/mongo/chatUser'
import { ChatRoom } from '../models/mongo/chatRoom'

const router = Router()

router.use('/home', (req, res) => {
  res.render('index')
})

export const WEBSOCKET_PORT = 5000

export const setWebsockets = async (io: Server) => {
  // 유저 정보가 갱신될떄 이름 사진 업데이트
  ChatUser.watch().on('change', async (change) => {
    const operationType = change.operationType
    if (operationType === 'update') {
      const user = await ChatService.getUser(change.documentKey._id.toString())
      io.emit(CHAT.USER_INFO, user)
    }
  })

  // 채팅방 정보가 갱신될떄 이름 사진 업데이트
  ChatRoom.watch().on('change', async (change) => {
    const operationType = change.operationType
    if (operationType === 'update') {
      const room = await ChatService.getRoom(change.documentKey._id.toString())
      io.emit(CHAT.ROOM_INFO, { room })
    }
  })

  io.on(CHAT.CONNECT, async (socket: Socket) => {
    try {
      console.log('connect client by Socket.io: ', socket.id)

      // 메세지 보내기
      socket.on(
        CHAT.SEND_MESSAGE,
        async (
          {
            userId,
            roomId,
            message,
          }: { userId: string; roomId: string; message: string },
          cb,
        ) => {
          try {
            const response = await ChatService.createChatMessage(
              'text',
              message,
              userId,
              roomId,
            )
            const user = await ChatService.getUser(userId)
            io.to(roomId).emit(CHAT.MESSAGE, {
              message: { ...response.toJSON(), user },
            })

            const room = await ChatService.getRoom(roomId)
            io.emit(CHAT.ROOM_INFO, {
              room,
            })
            cb({ code: httpStatus.OK })
          } catch (error) {
            if (error instanceof Error || error instanceof ApiError) {
              cb({
                code: httpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
              })
            }
          }
        },
      )

      // 채팅방에 입장했을떄
      socket.on(CHAT.ROOM_JOIN, async ({ roomId }: { roomId: string }, cb) => {
        try {
          socket.join(roomId)
          const room = await ChatService.getRoom(roomId)
          console.log(`enter the room : ${roomId}`)

          // 메세지 가져오기
          let messages = await ChatService.getChatMessages(roomId)
          socket.emit(CHAT.PREV_MESSAGES, { messages })

          cb({
            code: httpStatus.OK,
            message: `${roomId}번 채팅방에 입장했습니다.`,
          })
        } catch (error) {
          socket.leave(roomId)
          if (error instanceof Error || error instanceof ApiError) {
            cb({
              code: httpStatus.INTERNAL_SERVER_ERROR,
              message: error.message,
            })
          }
        }
      })

      socket.on(CHAT.DISCONNECT, () => {
        console.log('user is disconnected')
      })
    } catch (error) {
      console.error('Error in Socket.io connect event:', error)
    }
  })
}

export const chatRouter = router
