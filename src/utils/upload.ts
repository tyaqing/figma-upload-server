import { PutObjectCommandOutput, S3 } from '@aws-sdk/client-s3'
import { S3Config } from '@/utils/checkConfig'

export const uploadFileAsync = async (
  buffer: ArrayBuffer,
  fileName: string,
  contentType: string,
  config: S3Config,
): Promise<PutObjectCommandOutput> => {
  const s3 = new S3({
    credentials: {
      accessKeyId: config.s3AccessKeyId,
      secretAccessKey: config.s3SecretAccessKey,
    },
    region: config.s3Region,
    endpoint: 'https://' + config.s3Endpoint,
  })
  const res = await s3.putObject({
    Bucket: config.s3Bucket,
    Key: config.s3Path + '/' + fileName,
    Body: Buffer.from(buffer),
    ContentType: contentType,
  })
  return res
}
