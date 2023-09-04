<div align="center">
    <img  src="https://user-images.githubusercontent.com/11229306/265276616-624a18d9-5f56-4ded-ae36-bf70a7d27bef.png" width="50px">
  <h3>Figma Upload</h3>
    <p>一款可以直接在Figma上传图片到云对象存储的插件。</p>
    <p> <a href="./README.md">English</a> ｜ <a href="./README-CN.md">中文</a></p>
</div>

## 简介
一键上传图层到云对象存储的Figma插件-[Figma-Upload](https://www.figma.com/community/plugin/1276564056270447286)。
<img width="1077" alt="image" src="https://github.com/tyaqing/figma-upload-server/assets/11229306/9827e589-c750-4ba5-bc93-82c205bf87a8">

### 特点
- 支持多种云对象存储:AWS S3、腾讯云COS、CloudFlare R2 等。
- 兼容S3的云对象存储
- 支持多Bucket、多路径上传。
- 支持自定义CDN域名。
- 支持mozjpeg、tinypng压缩图片。
- 提供私有化部署，支持Nodejs、Serverless、Docker等多种部署方式。
- 免费开源

### 支持的云对象存储(通过测试)
- AWS S3
- Tencent Cloud COS
- Aliyun OSS
- Cloudflare R2

> 其他对象存储在持续验证中。事实上，只要是兼容S3的云对象存储，都可以使用。

### 支持的图片压缩

- PNG: tinypng 云端压缩，依赖于[TINIFY_KEY](https://tinypng.com/developers)
- JPG: mozjpeg 本地压缩

## 配置

您可以创建一个.env文件，来配置信息。
或者在运行时，通过环境变量来配置信息。

### S3 或兼容S3 配置

| 配置项                         | 说明               | 示例                          |
|-----------------------------|------------------|-----------------------------|
| GROUP1_S3_NAME              | 可选<br/>用于识别业务的名称 | A业务/B业务-香港                  |
| GROUP1_S3_ACCESS_KEY_ID     | 必填               | -                           |
| GROUP1_S3_SECRET_ACCESS_KEY | 必填               | -                           |
| GROUP1_S3_BUCKET            | 必填               | figma-upload                |
| GROUP1_S3_REGION            | 必填               | ap-east-1                   |
| GROUP1_S3_PATH              | 可选<br/>多个路径用逗号分隔 | pathA,public/pathB          |
| GROUP1_S3_ENDPOINT          | 必填               | s3.ap-east-1.amazonaws.com  |
| GROUP1_S3_CDN_URL           | 可选               | https://temp-cdn.abfree.com |

### 多Bucket配置

其格式为`GROUP{NUMBER}_S3_{KEY}`

如果需要配置多个Bucket,可以通过增加GROUP2_S3_NAME、GROUP2_S3_ACCESS_KEY_ID等配置项来实现。

### CDN_URL 配置说明

如果设置,生成的链接为:CDN_URL/path/filename

如果不设置,则为: region/endpoing/path/filename

### TINIFY_KEY 配置

> png压缩效果最好的是[tinypng](https://tinypng.com/developers),但是免费版每个月只有500张的额度

配置后,PNG会交给tinypng压缩,jpg格式会交给mozjpeg压缩

## 部署

### Docker部署 (推荐)

#### 拉取镜像

```shell
$ docker push yakirteng/figma-upload-server:latest
```
#### 创建 docker-compose.yml
environment中的环境变量,请参考上面的配置说明
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
#### 运行
```shell
# 启动
$ docker-compose up -d
# 停止
$ docker-compose down
```
### Nodejs、Serverless部署

```shell
## 运行
$ pnpm install
# development
$ pnpm run start
# watch mode
$ pnpm run start:dev
# production mode
$ pnpm run start:prod
```
你可以使用比较热门的[pm2](https://pm2.keymetrics.io/)作为进程守护工具，或者使用serverless部署。

## 日志

通过环境变量 `WRITE_LOG=true`来控制开启日志。 日志写在`logs/upload.log`目录下。

插件会自动上传Figma 插件的[匿名用户信息](https://www.figma.com/plugin-docs/api/figma/#currentuser)，用于统计、审计等。

日志示例：
```json5
{
    "bucket":"6cue",
    "context":"AppController",
    "figmaUserId":"919979******14761", // figma用户id
    "figmaUserName":"Yakir", // figma用户名
    "level":"info",
    "message":"s3 response",
    "path":"public",
    "requestId":"i44hR1UP********xi44OAiDnuK",
    "s3Res":{  // s3响应
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

### Docker部署时

Docker部署时，可以通过`docker logs`来查看日志。但是日志会随着容器的删除而删除。
您可以选择挂载日志目录到宿主机上，来保存日志。

```yaml
    volumes:
      - /data/logs/figma-upload-server:/usr/src/app/logs
```
### PM2部署时

PM2部署时，PM2会自己写日志，日志会保存在`~/.pm2/logs`目录下(默认情况)。

### Serverless部署时

Serverless可以使用平台提供的日志服务，也可以使用第三方日志服务。

### winston日志配置(建设中🚧)

- 支持自定义日志目录
- 支持日志上传ElasticSearch

## FAQ

### 为何上传成功，但是图片无法访问
需要检查以下几点
- Bucket是否设置为公开读取权限
- Bucket是否设置了CDN域名

这里建议大家都使用CDN域名，防止回源产生高额费用。

### Cloudflare R2 如何配置
R2的几项配置与S3有[差别](https://developers.cloudflare.com/r2/api/s3/api/)，可以参考下面的配置
- REGION为固定的`auto`
- ENDPOINT为`<ACCOUNT_ID>.r2.cloudflarestorage.com`
- CDN_URL为R2 设置中的 Public R2.dev Bucket URL

> 需要注意，R2的Bucket需要设置为公开读取权限


### 如何申请TINIFY_KEY
请参考[tinypng](https://tinypng.com/developers)

## License
[MIT licensed](LICENSE).
