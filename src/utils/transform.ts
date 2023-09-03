import { S3Config } from '@/utils/checkConfig'

export function mineType2format(mineType: string) {
  switch (mineType) {
    case 'image/png':
      return 'png'
    case 'image/jpg':
    case 'image/jpeg':
      return 'jpg'
    case 'image/svg+xml':
    case 'image/svg':
      return 'svg'
    default:
      return 'png'
  }
}

export function generateUrl(fileName: string, s3Config: S3Config) {
  const { s3CdnUrl, s3Path, s3Bucket, s3Endpoint } = s3Config
  const filePath = '/' + s3Path + '/' + fileName
  const regionUrl = 'https://' + s3Bucket + '.' + s3Endpoint

  if (s3CdnUrl) return s3CdnUrl + filePath
  else return regionUrl + filePath
}
