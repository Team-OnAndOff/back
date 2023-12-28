import mongoose, { Schema, model, ObjectId } from 'mongoose'

export interface IChatMessage {
  _id: ObjectId
  type: string
  user: ObjectId
  room: ObjectId
  message: string
  readUsers: ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    type: {
      type: String,
      enum: ['text', 'image', 'link', 'system'],
      default: 'text',
      required: true,
    },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    room: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'ChatRoom',
    },
    message: { type: String, required: true },
    readUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  },
)

export const ChatMessage = model<IChatMessage>('ChatMessage', chatMessageSchema)
