import httpStatus from 'http-status'
import { ChatMessage } from '../models/mongo/chatMessage'
import { User } from '../models/typeorm/entity/User'
import { ChatUser, IUser } from '../models/mongo/chatUser'
import { ApiError } from '../utils/error'
import { ChatRoom } from '../models/mongo/chatRoom'
import { ObjectId } from 'mongoose'
import { Event } from '../models/typeorm/entity/Event'
import CategoryService from './categories'

class ChatService {
  constructor() {}

  // 채팅방 생성
  async createChatRoom(event: Event, categoryId: number, user: IUser) {
    const category = await CategoryService.getCategoryByCategoryId(categoryId)
    return await ChatRoom.create({
      room: event.id,
      name: event.title,
      image: event.image.uploadPath,
      category: category.name,
      users: [user],
    })
  }

  async getRoom(id: string) {
    return await ChatRoom.findById({ _id: id })
      .populate({
        path: 'users',
        model: ChatUser,
        select: '_id username image',
      })
      .exec()
  }

  // 채팅방 조회
  async getChatRoomByRoomId(room: number) {
    return await ChatRoom.findOne({ room })
      .populate({
        path: 'users',
        model: ChatUser,
        select: '_id username image',
      })
      .exec()
  }

  // 채팅방 수정
  async updateChatRoom(event: Event, categoryId: number) {
    const category = await CategoryService.getCategoryByCategoryId(categoryId)
    return await ChatRoom.findOneAndUpdate(
      { room: event.id },
      {
        $set: {
          name: event.title,
          image: event.image.uploadPath,
          category: category.name,
        },
      },
    )
  }

  // 채팅방 삭제
  async deleteChatRoom(room: number) {
    const chatRoom = await ChatRoom.findOne({ room })
    await ChatMessage.deleteMany({ room: chatRoom?._id })
    return await ChatRoom.findOneAndDelete({ room })
  }

  // 채팅방 유저 조회
  async getChatUserByUserId(userId: number) {
    return await ChatUser.findOne({ userId }).exec()
  }

  // 채팅방 유저 생성
  async createChatUser(user: User) {
    const existUser = await this.getChatUserByUserId(user.id)
    if (existUser) {
      return existUser
    }

    return await ChatUser.create({
      userId: user.id,
      username: user.username,
      image: user.image.uploadPath,
      online: true,
    })
  }

  async joinRoomUser(roomId: number, userId: string) {
    return await ChatRoom.updateOne(
      {
        room: roomId,
      },
      {
        $push: { users: userId },
      },
      { new: true },
    )
  }

  // 채팅방 메세지 등록
  async createChatMessage(
    type: 'text' | 'image' | 'link' | 'system',
    message: string,
    user: string,
    room: string,
  ) {
    if (type === 'text') {
      await ChatRoom.findOneAndUpdate({ _id: room }, { lastMessage: message })
    }
    return await ChatMessage.create({
      type,
      user,
      room,
      message,
    })
  }

  // 유저 등록
  async createUser(userId: number) {
    return await ChatUser.create({
      userId: userId,
      online: true,
    })
  }

  // 방에 들어감
  async createRoomUser(roomId: number, userId: ObjectId) {
    let room = await ChatRoom.findOne({
      room: roomId,
    })

    if (!room) {
      room = await ChatRoom.create({
        room: roomId,
        users: [userId],
      })
    } else {
      const user = room.users.find(
        (user) => user.toString() === userId.toString(),
      )
      if (!user) {
        await ChatRoom.updateOne(
          {
            room: roomId,
          },
          {
            $push: { users: userId },
          },
          { new: true },
        )
      }
    }
    return room
  }

  // 방 목록 조회
  async getRooms(userId: number) {
    const user = await this.getChatUserByUserId(userId)
    if (!user) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, '유저가 없습니다.')
    }

    const chatRooms = await ChatRoom.find({ users: user })
      .populate({
        path: 'users',
        model: ChatUser,
        select: '_id username image',
      })
      .exec()

    return chatRooms
  }

  // 방 조회
  async getRoomByRoomId(roomId: number) {
    return await ChatRoom.findOne({ room: roomId })
      .populate({
        path: 'users',
        model: ChatUser,
        select: '_id username image',
      })
      .exec()
  }

  // 유저 조회
  async getUser(userId: string) {
    return await ChatUser.findOne({ _id: userId })
  }

  // 유저 조회
  async getUserByUserId(userId: number) {
    const user = await ChatUser.findOne({ userId })
    if (!user) {
      return this.createUser(userId)
    }
    return user
  }

  // 메세지 조회
  async getChatMessages(room: string, page?: string) {
    const perPage = 50
    if (page) {
      return await ChatMessage.find({
        room,
      })
        .populate('user')
        .limit(perPage)
        .skip(perPage * Number(page))
        .sort({
          createdAt: -1,
        })
    } else {
      return await ChatMessage.find({ room })
        .populate('user')
        .limit(perPage)
        .sort({
          createdAt: -1,
        })
    }
  }
}

export default new ChatService()
