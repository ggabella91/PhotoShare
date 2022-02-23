import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { MessagesAppModule } from './messages-app.module';
import { natsWrapper } from './nats-wrapper';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

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

  // await natsWrapper.connect(
  //   process.env.NATS_CLUSTER_ID,
  //   process.env.NATS_CLIENT_ID,
  //   process.env.NATS_URL
  // );
  // natsWrapper.client.on('close', () => {
  //   console.log('NATS connection closed!');
  //   process.exit();
  // });
  // process.on('SIGINT', () => natsWrapper.client.close());
  // process.on('SIGTERM', () => natsWrapper.client.close());

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MessagesAppModule,
    { transport: Transport.NATS }
  );
  // app.useStaticAssets(join(__dirname, '..', 'static'));
  await app.listen();
}
bootstrap();
