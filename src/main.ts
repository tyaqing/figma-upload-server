import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { checkConfig } from './utils/checkConfig'
import { logger } from './common/winstonLogger'
import { rTracerMiddleware } from '@/middleware/tracer.middleware'
import { ValidationPipe } from '@nestjs/common'
const PORT = process.env.PORT || 9000

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger,
  })
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  app.use(rTracerMiddleware)
  await app.listen(9000)
  checkConfig()
}

console.log('server http://localhost:' + PORT)

bootstrap()
