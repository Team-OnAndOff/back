import { Schema, model } from 'mongoose'
const { nanoid } = require('nanoid')

interface IMessageRead {
  _id: string
  userId: number
  roomId: string
  messageId: string
  createdAt: Date
  updatedAt: Date
}

const messageReadSchema = new Schema<IMessageRead>(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    userId: { type: Number, required: true },
    roomId: { type: String, required: true },
    messageId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export const MessageRead = model<IMessageRead>('MessageRead', messageReadSchema)
