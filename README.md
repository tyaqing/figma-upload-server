<div align="center">
    <img  src="https://user-images.githubusercontent.com/11229306/265276616-624a18d9-5f56-4ded-ae36-bf70a7d27bef.png" width="50px">
  <h3>Figma Upload</h3>
    <p>A plugin that allows you to directly upload images to cloud object storage from Figma.</p>
    <p>English ｜ <a href="./README-CN.md">中文</a></p>
</div>

## Introduction
A Figma plugin that allows one-click upload of layers to cloud object storage - [Figma-Upload](https://www.figma.com/community/plugin/1276564056270447286).
<img width="1077" alt="image" src="https://github.com/tyaqing/figma-upload-server/assets/11229306/9827e589-c750-4ba5-bc93-82c205bf87a8">

### Features
- Supports multiple cloud object storages: AWS S3, Tencent Cloud COS, CloudFlare R2, etc.
- Compatible with S3 cloud object storage.
- Supports multi-Bucket, multi-path uploads.
- Supports custom CDN domain name.
- Supports mozjpeg, tinypng image compression.
- Offers private deployment, supports Nodejs, Serverless, Docker and other deployment methods.
- Free and open source.

### Supported Cloud Object Storage (Tested)
- AWS S3
- Tencent Cloud COS
- Aliyun OSS
- Cloudflare R2

> Other object storages are continuously being validated. In fact, as long as it is S3 compatible, it can be used.

### Supported image compression

- PNG: cloud compression with tinypng, depends on [TINIFY_KEY](https://tinypng.com/developers)
- JPG: local compression with mozjpeg

## Configuration

You can create a .env file to configure information.
Or, configure the information through environment variables at runtime.

### S3 or S3 compatible configuration

| Configuration Item          | Description                                      | Example                       |
|-----------------------------|--------------------------------------------------|-------------------------------|
| GROUP1_S3_NAME              | Optional<br/>Used to identify the business name  | businessA/businessB-Hong-Kong |
| GROUP1_S3_ACCESS_KEY_ID     | Required                                         | -                             |
| GROUP1_S3_SECRET_ACCESS_KEY | Required                                         | -                             |
| GROUP1_S3_BUCKET            | Required                                         | figma-upload                  |
| GROUP1_S3_REGION            | Required                                         | ap-east-1                     |
| GROUP1_S3_PATH              | Optional<br/>Separate multiple paths with commas | pathA,public/pathB            |
| GROUP1_S3_ENDPOINT          | Required                                         | s3.ap-east-1.amazonaws.com    |
| GROUP1_S3_CDN_URL           | Optional                                         | https://temp-cdn.abfree.com   |

### Multi-Bucket Configuration

The format is `GROUP{NUMBER}_S3_{KEY}`

If you need to configure multiple Buckets, you can do so by adding configuration items such as GROUP2_S3_NAME, GROUP2_S3_ACCESS_KEY_ID, etc.


### CDN_URL Configuration Explanation

If set, the generated link is: `CDN_URL/path/filename`

If not set, it is: `region/endpoint/path/filename`

### TINIFY_KEY Configuration

> The best compression effect for png is [tinypng](https://tinypng.com/developers), but the free version only has an allowance of 500 pictures per month.

After configuring, PNG will be compressed by tinypng, and jpg format will be compressed by mozjpeg.

## Deployment

### Docker Deployment (Recommended)

#### Pull Image

```shell
$ docker push yakirteng/figma-upload-server:latest
```
#### Create docker-compose.yml
For environment variables in the environment, please refer to the configuration instructions above.
```yaml
version: '3.6'
services:
  nodejs:
    image: figma-upload-server:latest
    ports:
      - 9098:9000
    environment:
      - GROUP1_S3_NAME=figma-upload
```
#### Run
```shell
# Start
$ docker-compose up -d
# Stop
$ docker-compose down
```
### Nodejs, Serverless Deployment

```shell
## Run
$ pnpm install
# development
$ pnpm run start
# watch mode
$ pnpm run start:dev
# production mode
$ pnpm run start:prod
```
You can use the more popular [pm2](https://pm2.keymetrics.io/) as a process daemon, or use serverless deployment.

## Logs

Control the opening of logs through the environment variable `WRITE_LOG=true`. Logs are written in the `logs/upload.log` directory.

The plugin will automatically upload [anonymous user information](https://www.figma.com/plugin-docs/api/figma/#currentuser) of Figma plugins for statistics, auditing, etc.

example:
```json5
{
    "bucket":"6cue",
    "context":"AppController",
    "figmaUserId":"919979******14761", // figma user id
    "figmaUserName":"Yakir", // figma user name
    "level":"info",
    "message":"s3 response",
    "path":"public",
    "requestId":"i44hR1UP********xi44OAiDnuK",
    "s3Res":{  // s3 response
        "$metadata":{
            "attempts":1,
            "httpStatusCode":200,
            "requestId":"64F3*******C43133B53FD4",
            "totalRetryDelay":0
        },
        "ETag":"\"E35521CE0*******B63685A5C2BC\""
    },
    "timestamp":"2023-09-02T16:27:43.024Z"
}
```

### During Docker deployment

During Docker deployment, you can view logs through `docker logs`. However, logs will be deleted along with the deletion of the container. You can choose to mount the log directory to the host machine to save logs.

```yaml
    volumes:
      - /data/logs/figma-upload-server:/usr/src/app/logs
```
### During PM2 deployment

During PM2 deployment, PM2 will write its own logs, which will be saved in the `~/.pm2/logs` directory (by default).

### During Serverless deployment

Serverless can use the log service provided by the platform, or a third-party log service.

### Winston log configuration (under construction🚧)

- Support custom log directory
- Support log upload to ElasticSearch

## FAQ

### Why can't I access the image after a successful upload?
You need to check the following points
- Whether the Bucket is set to public read permissions
- Whether the Bucket has set a CDN domain

Here, it is recommended that you use a CDN domain name to prevent high costs caused by back-to-source.

### How to configure Cloudflare R2
R2 has several configurations that are different from S3, which can be referenced below
- REGION is fixed to `auto`
- ENDPOINT is `<ACCOUNT_ID>.r2.cloudflarestorage.com`
- CDN_URL is the Public R2.dev Bucket URL in the R2 settings

> Note that the R2 Bucket needs to be set to public read permissions

### How to apply for TINIFY_KEY
Please refer to [tinypng](https://tinypng.com/developers)

## License
[MIT licensed](LICENSE).
