import { IsNotEmpty, IsNumber } from 'class-validator'

interface EventLikeRequestBody {
  readonly userId: number
}

export class EventLikeBodyDTO implements EventLikeRequestBody {
  @IsNotEmpty()
  @IsNumber()
  readonly userId: number

  constructor(body: EventLikeRequestBody) {
    this.userId = Number(body.userId)
  }
}
