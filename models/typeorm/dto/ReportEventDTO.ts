import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  IsNumber,
  IsOptional,
} from 'class-validator'

interface ReportEventRequestBody {
  readonly reporterId: number
  readonly eventId: number
  readonly description: string
}

export interface ReportEventRequestParams {
  readonly eventId: number
  readonly reportId?: number
}

export class ReportEventBodyDTO implements ReportEventRequestBody {
  @IsNotEmpty()
  @IsNumber()
  readonly reporterId: number

  @IsNotEmpty()
  @IsNumber()
  readonly eventId: number

  @IsNotEmpty()
  @IsString()
  readonly description: string

  constructor(body: ReportEventRequestBody) {
    this.reporterId = Number(body.reporterId)
    this.eventId = Number(body.eventId)
    this.description = body.description
  }
}

export class ReportEventParamsDTO implements ReportEventRequestParams {
  @IsNotEmpty()
  @IsNumberString()
  readonly eventId: number

  @IsOptional()
  @IsNumberString()
  readonly reportId?: number

  constructor(params: ReportEventRequestParams) {
    this.eventId = params.eventId
    this.reportId = params.reportId
  }
}
