import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

interface EventAddress {
  readonly zipCode: number
  readonly detail1: string
  readonly detail2: string
  readonly latitude: number
  readonly longitude: number
}

export class EventAddressDTO implements EventAddress {
  @IsNotEmpty()
  @IsNumber()
  readonly zipCode: number

  @IsNotEmpty()
  @IsString()
  readonly detail1: string

  @IsNotEmpty()
  @IsString()
  readonly detail2: string

  @IsNotEmpty()
  @IsNumber()
  readonly latitude: number

  @IsNotEmpty()
  @IsNumber()
  readonly longitude: number

  constructor(body: EventAddress) {
    this.zipCode = body.zipCode
    this.detail1 = body.detail1
    this.detail2 = body.detail2
    this.latitude = body.latitude
    this.longitude = body.longitude
  }
}
