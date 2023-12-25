import { Schema, model } from 'mongoose'
// const { nanoid } = require('nanoid')
import { v4 } from 'uuid'

interface IChatMessage {
  _id: string
  type: string
  userId: number
  chatRoomId: number
  message: string
  createdAt: Date
  updatedAt: Date
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    _id: {
      type: String,
      default: () => v4(),
    },
    type: { type: String, enum: ['text', 'image', 'link'], required: true },
    userId: { type: Number, required: true },
    chatRoomId: { type: Number, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export const ChatMessage = model<IChatMessage>('ChatMessage', chatMessageSchema)
