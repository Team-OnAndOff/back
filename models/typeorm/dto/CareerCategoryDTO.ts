import { IsString, IsNotEmpty, IsNumberString } from 'class-validator'

interface CareerCategoryRequestBody {
  name: string
}

export interface CareerCategoryRequestParams {
  id: number
}

export class CareerCategoryBodyDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  constructor(body: CareerCategoryRequestBody) {
    this.name = body.name
  }
}

export class CareerCategoryParamsDTO {
  @IsNotEmpty()
  @IsNumberString()
  id: number

  constructor(params: CareerCategoryRequestParams) {
    this.id = params.id
  }
}
