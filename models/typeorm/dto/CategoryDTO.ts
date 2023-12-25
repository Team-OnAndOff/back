import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  IsNumber,
  IsOptional,
} from 'class-validator'

export interface CategoryRequestBody {
  name: string
  flag: number
  description: string
}

export interface CategoryRequestParams {
  categoryId: number
  subCategoryId: number
}

export class CategoryBodyDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsNumber()
  flag: number

  @IsNotEmpty()
  @IsString()
  description: string

  constructor(body: CategoryRequestBody) {
    this.name = body.name
    this.flag = body.flag
    this.description = body.description
  }
}

export class CategoryParamsDTO {
  @IsNotEmpty()
  @IsNumberString()
  categoryId: number

  @IsOptional()
  @IsNumberString()
  subCategoryId: number

  constructor(params: CategoryRequestParams) {
    this.categoryId = params.categoryId
    this.subCategoryId = params.subCategoryId
  }
}
