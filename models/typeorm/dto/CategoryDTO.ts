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

  constructor(body: CategoryRequestBody) {
    this.name = body.name
    this.flag = body.flag
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
