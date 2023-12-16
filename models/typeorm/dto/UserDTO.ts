import { IsString, IsNotEmpty, IsNumberString } from 'class-validator'
import { OAuthEnum } from '../../../routes/api/auth'

interface CareerCategoryRequestBody {
  name: string
}

export class createUserDTO {
  @IsNotEmpty()
  @IsString()
  socialId: string
  @IsNotEmpty()
  @IsString()
  provider: string
  constructor(socialId: string, provider: OAuthEnum) {
    this.socialId = socialId
    this.provider = provider.toString()
  }
}
