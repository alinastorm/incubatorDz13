import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //отключаем CORS
  app.enableCors();
  await app.listen(9002);
}
bootstrap();
