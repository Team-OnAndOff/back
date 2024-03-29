import { IsString, IsNotEmpty, IsNumberString } from 'class-validator'
import { OAuthEnum } from '../../../routes/api/auth'
import { ImageDTO } from './ImageDTO'
import multer from 'multer'
import { Image } from '../entity/Image'
import { uuid } from 'uuidv4'

export class CreateUserDTO {
  username: string
  socialId: string
  provider: string
  email: string
  introduction: string
  constructor(
    username: string,
    socialId: string,
    provider: OAuthEnum,
    email?: string,
    introduction?: string,
  ) {
    this.socialId = socialId
    this.provider = provider.toString()
    this.username = username
    this.email = email ? email : ''
    this.introduction = introduction ? introduction : ''
  }
}

export class UserIdDTO {
  @IsNotEmpty()
  id: number
  constructor(userId: string) {
    this.id = Number(userId)
  }
}

export class GetUserDTO extends UserIdDTO {
  @IsNotEmpty()
  type: string
  constructor(userId: string, type: string) {
    super(userId)
    this.type = type
  }
}

interface UpdateUserBody {
  username?: string
  email?: string
  introduce?: string
  image?: any
}

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
}

export class UpdateUserDTO extends UserIdDTO {
  username?: string
  email?: string
  introduction?: string
  hashtag?: string
  image?: Express.Multer.File
  constructor(
    userId: string,
    body: UpdateUserBody,
    image?: Express.Multer.File,
  ) {
    super(userId)
    this.username = body.username
    if (body) {
      Object.assign(this, body)
    }
    if (image) {
      this.image = image
      const [ext, ..._] = image.originalname.split('.').reverse()
      image.originalname = `${uuid()}.${ext}`
    }
  }
}

interface PostAssessBody {
  eventId: number
  attendeeId: number
  score: number
  description?: string
}

export class PostAssessDTO {
  eventId: number
  reporterId: number
  attendeeId: number
  score: number
  description?: string
  constructor(userId: string, body: PostAssessBody) {
    this.reporterId = Number(userId)
    this.eventId = body.eventId
    this.attendeeId = body.attendeeId
    this.score = body.score
    if (body.description) {
      this.description = body.description
    }
  }
}

export class UpdateAssessDTO {
  assessId: number
  userId: number
  score: number
  description?: string
  constructor(
    assessId: string,
    userId: string,
    score: number,
    description?: string,
  ) {
    this.assessId = Number(assessId)
    this.userId = Number(userId)
    this.score = score
    if (description) {
      this.description = description
    }
  }
}
