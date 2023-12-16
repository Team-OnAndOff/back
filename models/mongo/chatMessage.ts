import { Schema, model } from 'mongoose'
const { nanoid } = require('nanoid')

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
      default: () => nanoid(),
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
