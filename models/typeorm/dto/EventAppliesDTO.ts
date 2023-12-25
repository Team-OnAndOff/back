import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsNumberString,
} from 'class-validator'

interface EventApplyRequestBody {
  readonly answer: string
}

export class EventApplyBodyDTO implements EventApplyRequestBody {
  @IsNotEmpty()
  @IsString()
  readonly answer: string

  constructor(body: EventApplyRequestBody) {
    this.answer = body.answer
  }
}

export interface EventApplyUpdateRequestBody {
  readonly userId: number
  readonly status?: number
  readonly flag?: number
  readonly answer?: string
}

export class EventApplyUpdateBodyDTO implements EventApplyUpdateRequestBody {
  @IsNotEmpty()
  @IsNumber()
  readonly userId: number

  @IsOptional()
  @IsNumber()
  readonly status?: number

  @IsOptional()
  @IsNumber()
  readonly flag?: number

  @IsOptional()
  @IsString()
  readonly answer?: string

  constructor(body: EventApplyUpdateRequestBody) {
    this.userId = body.userId
    this.status = body.status
    this.flag = body.flag
    this.answer = body.answer
  }
}

interface EventApplyRequestQuery {
  readonly status: string
}

export class EventApplyQueryDTO implements EventApplyRequestQuery {
  @IsOptional()
  @IsNumberString()
  readonly status: string

  constructor(query: EventApplyRequestQuery) {
    this.status = query.status
  }
}
