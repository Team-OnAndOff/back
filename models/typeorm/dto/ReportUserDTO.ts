import { IsString, IsNotEmpty, IsNumberString } from 'class-validator'
import { OAuthEnum } from '../../../routes/api/auth'
import { ImageDTO } from './ImageDTO'
import multer from 'multer'
import { Image } from '../entity/Image'
import { uuid } from 'uuidv4'

export class CreateUserReportDTO {
  description: string
  reporterId: number
  attendeeId: number
  constructor(reporterId: number, attendeeId: number, description: string) {
    this.description = description
    this.attendeeId = attendeeId
    this.reporterId = reporterId
  }
}
