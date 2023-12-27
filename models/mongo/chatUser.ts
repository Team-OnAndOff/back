import { Schema, model, ObjectId } from 'mongoose'

export interface IUser {
  _id: ObjectId
  userId: number
  username: string
  image: string
  online: boolean
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    userId: { type: Number, required: true, unique: true },
    username: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    online: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export const ChatUser = model<IUser>('User', userSchema)
