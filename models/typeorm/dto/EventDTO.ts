import { Type } from 'class-transformer'
import { ParsedQs } from 'qs'
import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  ValidateNested,
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsDefined,
} from 'class-validator'
import { EventAddressDTO } from './EventAddressDTO'

interface EventRequestBody {
  readonly categoryId: number
  readonly subCategoryId: number
  readonly userId: number
  readonly careerCategoryId: string
  readonly hashTag: string
  readonly title: string
  readonly content: string
  readonly recruitment: number
  readonly question: string
  readonly online: number
  readonly challengeStartDate: Date
  readonly challengeEndDate?: Date
  readonly address: string
}

export interface EventRequestParams {
  readonly id: number
}

export interface EventRequestQuery extends ParsedQs {
  readonly categoryId: string
  readonly subCategoryId: string
}

export class EventBodyDTO {
  @IsNotEmpty()
  @IsNumber()
  readonly userId: number

  @IsNotEmpty()
  @IsNumber()
  readonly categoryId: number

  @IsNotEmpty()
  @IsNumber()
  readonly subCategoryId: number

  @IsArray()
  @IsOptional()
  @IsDefined()
  readonly careerCategoryIds?: number[]

  @IsOptional()
  @IsArray()
  readonly hashTag?: string[]

  @IsNotEmpty()
  @IsString()
  readonly title: string

  @IsNotEmpty()
  @IsString()
  readonly content: string

  @IsNotEmpty()
  @IsNumber()
  readonly recruitment: number

  @IsNotEmpty()
  @IsString()
  readonly question: string

  @IsNotEmpty()
  @IsNumber()
  readonly online: number

  @IsDateString()
  @IsNotEmpty()
  readonly challengeStartDate: Date

  @IsDateString()
  @IsOptional()
  @IsDefined()
  readonly challengeEndDate?: Date

  @ValidateNested()
  @Type(() => EventAddressDTO)
  @IsOptional()
  @IsDefined()
  readonly address?: EventAddressDTO

  constructor(body: EventRequestBody) {
    this.userId = Number(body.userId)
    this.categoryId = Number(body.categoryId)
    this.subCategoryId = Number(body.subCategoryId)
    this.title = body.title
    this.content = body.content
    this.recruitment = Number(body.recruitment)
    this.question = body.question
    this.online = Number(body.online)
    this.challengeStartDate = body.challengeStartDate

    if (body.careerCategoryId) {
      this.careerCategoryIds = body.careerCategoryId.split(',').map(Number)
    }
    if (body.challengeEndDate) {
      this.challengeEndDate = body.challengeEndDate
    }
    if (body.hashTag) {
      this.hashTag = body.hashTag.split(',').map(String)
    }
    if (body.address) {
      this.address = new EventAddressDTO(JSON.parse(body.address))
    }
  }
}

export class EventParamsDTO {
  @IsNotEmpty()
  @IsNumberString()
  readonly id: number

  constructor(params: EventRequestParams) {
    this.id = params.id
  }
}

export class EventQueryDTO {
  @IsOptional()
  @IsNumberString()
  readonly categoryId: string

  @IsOptional()
  @IsNumberString()
  readonly subCategoryId: string

  constructor(params: EventRequestQuery) {
    this.categoryId = params.categoryId
    this.subCategoryId = params.subCategoryId
  }
}
