import mongoose, { Schema, model, ObjectId } from 'mongoose'

export interface IChatRoom {
  _id: ObjectId
  room: number
  name: string
  image: string
  category: string
  lastMessage: string
  users: ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const chatRoomSchema = new Schema<IChatRoom>(
  {
    room: { type: Number, required: true },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    lastMessage: {
      type: String,
    },
    users: [{ type: Schema.Types.ObjectId }],
  },
  {
    timestamps: true,
  },
)

export const ChatRoom = model<IChatRoom>('ChatRoom', chatRoomSchema)
