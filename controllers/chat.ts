import httpStatus from 'http-status'
import ChatService from '../services/chat'
import { IUser } from '../models/mongo/chatUser'
import { createResponse } from '../utils/createResponse'
import { catchAsync } from '../utils/catchAsync'
import { IChatRoom } from '../models/mongo/chatRoom'
import { IChatMessage } from '../models/mongo/chatMessage'

export default class ChatController {
  // 유저 조회
  static getUser = catchAsync(async (req: any, res, next) => {
    const user = await ChatService.getUserByUserId(req.user.id)
    res.status(httpStatus.OK).json(createResponse<IUser>(user))
  })

  // 이전메세지 가져오기
  static getPrevChatMessage = catchAsync(async (req: any, res, next) => {
    const { room, page } = req.query
    const messages = await ChatService.getChatMessages(room, page)
    res.status(httpStatus.OK).json(createResponse<IChatMessage[]>(messages))
  })

  // 방 목록 정보 가져오기
  static getRooms = catchAsync(async (req: any, res, next) => {
    const rooms = await ChatService.getRooms(Number(req.user.id))
    res.status(httpStatus.OK).json(createResponse<IChatRoom[]>(rooms))
  })

  // 방 정보 가져오기
  static getRoom = catchAsync(async (req: any, res, next) => {
    const room = await ChatService.getRoomByRoomId(Number(req.params.roomId))
    res.status(httpStatus.OK).json(createResponse<IChatRoom | null>(room))
  })
}
