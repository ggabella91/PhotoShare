import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { MessagesAppModule } from './messages-app.module';
import { NatsWrapper } from './nats-wrapper';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  console.log('Starting up messages service...');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
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

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MessagesAppModule,
    {
      strategy: new NatsWrapper(),
    }
  );

  // app.useStaticAssets(join(__dirname, '..', 'static'));
  // app.enableCors();
  await app.listen();
}
bootstrap();
