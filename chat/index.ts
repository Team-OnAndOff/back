import { createServer } from 'http'
import { Server } from 'socket.io'

import express from 'express'

import { Express, Router } from 'express'
import { Session } from 'inspector'
import { SessionData } from 'express-session'
import userService from '../services/users'
import { ChatMessage } from '../models/mongo/chatMessage'
const router = Router()

router.use('/home', (req, res) => {
  res.render('index')
})

export const WEBSOCKET_PORT = 5000

export const setWebsockets = (io: Server) => {
  io.on('connection', async (socket) => {
    console.log('connect client by Socket.io')

    const creq: any = socket.request
    const ses: SessionData = creq.session
    let roomId = 0
    if (!Object.hasOwn(ses, 'passport')) {
      socket.emit('first', {
        connect: false,
        message: '회원만 사용가능합니다.',
      })
      return
    }

    socket.emit('first', {
      connect: true,
      message: '연결되었습니다. 진행됩니다.',
    })

    const socialId = ses.passport.user
    console.log(socialId)
    let user = await userService.findOneBySocialId(socialId)

    socket.on('message', async (data) => {
      if (roomId === 0) {
        socket.emit('message', {
          message: '채팅방에 입장되어야 이용가능합니다.',
        })
        return
      }
      const date = new Date()
      const item = await ChatMessage.create({
        type: 'text',
        userId: user?.id,
        chatRoomId: roomId,
        message: data.message,
      })
      console.log(item)
      socket.in(String(roomId)).emit('message', {
        user: user,
        date: date,
        message: data.message,
        me: false,
      })
      socket.emit('message', {
        user: user,
        date: date,
        message: data.message,
        me: true,
      })
    })
    socket.on('read', async (data) => {
      console.log(data)
      const { message, roomId } = data
      const { date } = message
      console.log('date@@@@', Date.parse(date))
      let messages = await ChatMessage.find({
        chatRoomId: roomId,
        createdAt: {
          $lt: Date.parse(date),
        },
      })
        .sort({ createdAt: -1 })
        .limit(10)

      const result: any[] = []
      for (const m of messages) {
        const user = await userService.findOneById(m.userId)
        result.push({ message: m.message, date: m.createdAt, user })
      }
      socket.emit('read', {
        roomId: roomId,
        messages: result.reverse(),
      })
    })
    socket.on('room', async (data) => {
      const target = data.roomId
      console.log('last :', roomId)
      console.log('current :', target)
      roomId = target
      if (roomId !== 0) {
        socket.leave(String(roomId))
      }
      socket.join(String(roomId))

      console.log(`enter the room : ${target}`)

      let messages = await ChatMessage.find({ chatRoomId: roomId })
        .sort({ createdAt: -1 })
        .limit(10)

      const result: any[] = []
      for (const m of messages) {
        const user = await userService.findOneById(m.userId)
        result.push({ message: m.message, date: m.createdAt, user })
      }

      socket.emit('entered', {
        roomId: target,
        messages: result.reverse(),
      })
    })
  })
}

export const chatRouter = router
