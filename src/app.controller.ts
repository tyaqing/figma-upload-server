import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { uploadFileAsync } from './utils/upload'
import { handleCompression } from './utils/compression'
import { generateUrl, mineType2format } from './utils/transform'
import {
  getGroupConfigByBucket,
  getS3GroupsConfig,
  omitConfigsSensitiveInfo,
} from '@/utils/checkConfig'
import { UploadDto } from '@/common/dto/upload.dto'
import { randomString } from '@/utils/string'

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async POST(@Body() body: UploadDto, @UploadedFile() file: Express.Multer.File) {
    // check config
    const s3Config = getGroupConfigByBucket(body.bucket, body.path)
    // get file name
    const fileName = `${randomString(22)}-${file.originalname}`
    // handle compression
    const tinified = await handleCompression(file)
    // upload to object storage
    try {
      const s3Res = await uploadFileAsync(tinified.buffer, fileName, file.mimetype, s3Config)
      this.logger.log({
        message: 's3 response',
        s3Res,
        ...body,
      })
      return {
        fileName,
        originSize: file.size,
        size: tinified.length,
        mimeType: mineType2format(file.mimetype),
        url: generateUrl(fileName, s3Config),
      }
    } catch (e) {
      console.error(e)
      throw new BadRequestException(e.message, {
        cause: e,
        description: 'uploadFileAsync error',
      })
    }
  }
  @Get()
  getHello(): any {
    return {
      status: 'ok',
      bucketConfig: omitConfigsSensitiveInfo(getS3GroupsConfig()),
    }
  }
}
