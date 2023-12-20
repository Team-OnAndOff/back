import httpStatus from 'http-status'
import { S3, S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { ImageDTO } from '../models/typeorm/dto/ImageDTO'
import { ApiError } from './error'
import { logger } from '../config/logger'

const s3Client = () => {
  return (
    new S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    }) ||
    new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID! as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    })
  )
}

const s3Params = (key: string, image?: ImageDTO) => {
  return {
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Key: key,
    Body: image?.buffer,
    ContentType: image?.mimetype,
  }
}

const s3FileName = (image: ImageDTO, folderName: string) => {
  return `${folderName}/${Date.now()}-${image.originalname}`
}

const s3Destination = (key: string) => {
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}

const s3Upload = async (image: ImageDTO, folderName: string) => {
  try {
    if (!image.buffer) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Image buffer is required.')
    }

    const filename = s3FileName(image, folderName)
    const client = s3Client()
    const params = s3Params(filename, image)

    const upload = new Upload({ client, params })

    upload.on('httpUploadProgress', (progress) => {
      console.log(progress)
    })

    await upload.done()
    logger.info(`S3 파일 등록 성공: ${filename}`)

    const destination = s3Destination(filename)
    return new ImageDTO({ ...image, filename, destination })
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'S3 파일 업로드 실패')
  }
}

const s3Delete = async (filename: string) => {
  try {
    const client = s3Client()
    const params = s3Params(filename)

    await client.deleteObject(params)
    logger.info(`S3 파일 삭제 성공: ${filename}`)
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'S3 파일 삭제 실패')
  }
}

export { s3Upload, s3Delete }
