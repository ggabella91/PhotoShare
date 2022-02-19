import { NestFactory } from '@nestjs/core';
import { MessagesAppModule } from './messages-app.module';

async function bootstrap() {
  const app = await NestFactory.create(MessagesAppModule);
  await app.listen(3000);
}
bootstrap();
