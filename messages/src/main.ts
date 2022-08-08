import { NestFactory } from '@nestjs/core';
import { MessagesAppModule } from './messages-app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  console.log('Starting up messages service...');

  if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV must be defined');
  }

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.MONGO_CLUSTER_HOST) {
    throw new Error('MONGO_CLUSTER_HOST must be defined');
  }

  if (!process.env.MONGO_PASSWORD) {
    throw new Error('MONGO_PASSWORD must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('CLUSTER_ID must be defined');
  }

  const app = await NestFactory.create<NestExpressApplication>(
    MessagesAppModule
  );

  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.enableCors({ origin: true });
  await app.listen(3000);
}
bootstrap();
