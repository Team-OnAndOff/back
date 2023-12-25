import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class ImageDTO {
  @IsNotEmpty()
  @IsString()
  readonly originalname: string

  @IsOptional()
  @IsString()
  readonly destination: string

  @IsOptional()
  @IsString()
  readonly filename: string

  @IsNotEmpty()
  @IsNumber()
  readonly size: number

  @IsNotEmpty()
  readonly buffer: Buffer

  @IsNotEmpty()
  @IsString()
  readonly mimetype: string

  constructor(file: Express.Multer.File | ImageDTO) {
    this.originalname = decodeURIComponent(file.originalname)
    this.destination = file.destination
    this.filename = file.filename
    this.size = file.size
    this.buffer = file.buffer
    this.mimetype = file.mimetype
  }
}
