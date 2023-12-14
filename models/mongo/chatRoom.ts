import { Schema, model } from 'mongoose'
const { nanoid } = require('nanoid')

interface IChatRoom {
  _id: string
  groupId: string
  userId: number
  createdAt: Date
  updatedAt: Date
}

const chatRoomSchema = new Schema<IChatRoom>(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    groupId: { type: String, required: true },
    userId: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
)

export const ChatRoom = model<IChatRoom>('ChatRoom', chatRoomSchema)
