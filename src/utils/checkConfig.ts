import { pick } from 'lodash'
export function checkConfig() {
  verifyS3GroupsConfig(getS3GroupsConfig())
}

export interface S3Config {
  s3Name?: string
  s3AccessKeyId: string
  s3SecretAccessKey: string
  s3Bucket: string
  s3Region: string
  s3Path: string[] | string
  s3Endpoint: string
  s3CdnUrl?: string
}

export function getS3GroupsConfig(): S3Config[] {
  const groups: S3Config[] = []

  for (let i = 1; ; i++) {
    const prefix = `GROUP${i}_`
    if (!process.env[`${prefix}S3_BUCKET`]) {
      break
    }
    const group: S3Config = {
      s3Name: process.env[`${prefix}S3_NAME`] as string,
      s3AccessKeyId: process.env[`${prefix}S3_ACCESS_KEY_ID`] as string,
      s3SecretAccessKey: process.env[`${prefix}S3_SECRET_ACCESS_KEY`] as string,
      s3Bucket: process.env[`${prefix}S3_BUCKET`] as string,
      s3Region: process.env[`${prefix}S3_REGION`] as string,
      s3Path: (process.env[`${prefix}S3_PATH`] as string)?.split(','),
      s3Endpoint: process.env[`${prefix}S3_ENDPOINT`] as string,
      s3CdnUrl: process.env[`${prefix}S3_CDN_URL`] as string,
    }
    groups.push(group)
  }
  verifyS3GroupsConfig(groups)
  return groups
}

export function verifyS3GroupsConfig(configs: S3Config[]) {
  configs.forEach((config) => {
    if (
      !config.s3AccessKeyId ||
      !config.s3SecretAccessKey ||
      !config.s3Bucket ||
      !config.s3Region ||
      !config.s3Path ||
      !config.s3Endpoint
    ) {
      throw new Error('⚠️ please set S3 config in .env file or env variables')
    }
  })
}

export function omitConfigsSensitiveInfo(configs: S3Config[]) {
  return configs.map((config) => {
    return pick(config, ['s3Region', 's3Bucket', 's3Name', 's3Region', 's3Path'])
  })
}

export function getGroupConfigByBucket(bucket: string, path: string) {
  const configs = getS3GroupsConfig()
  const config = configs.find((config) => config.s3Bucket === bucket)
  if (!config) {
    throw new Error(`⚠️bucket ${bucket} is not found `)
  }
  if (!config.s3Path.includes(path)) {
    throw new Error(`⚠️path: ${path} is not found `)
  }
  config.s3Path = path
  return config
}
