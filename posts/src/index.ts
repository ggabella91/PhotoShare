import mongoose from 'mongoose';
import { createClient, RedisClientType } from 'redis';
import AWS from 'aws-sdk';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

let redisClient: RedisClientType<any, any>;

const start = async () => {
  console.log('Starting up posts service....');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.AWS_ACCESS_KEY_ID) {
    throw new Error('AWS_ACCESS_KEY_ID must be defined');
  }

  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS_SECRET_ACCESS_KEY must be defined');
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

  if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST must be defined');
  }

  if (!process.env.REDIS_CACHE_EXPIRATION) {
    throw new Error('REDIS_CACHE_EXPIRATION must be defined');
  }

  if (!process.env.POSITION_STACK_API_KEY) {
    throw new Error('POSITION_STACK_API_KEY must be defined');
  }

  if (!process.env.MAPBOX_GL_ACCESS_TOKEN) {
    throw new Error('MAPBOX_GL_ACCESS_TOKEN must be defined');
  }

  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL
  );
  natsWrapper.client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });
  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  console.log('Connected to MongoDB');

  redisClient = createClient({
    socket: { host: process.env.REDIS_HOST },
  });

  redisClient.connect();

  AWS.config.update({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: 'us-west-1',
  });

  const server = app.listen(3000, () => {
    console.log('Listening on port 3000!!!!');
  });
  server.keepAliveTimeout = 60 * 1000;
  server.headersTimeout = 75 * 1000;

  server.on('connection', () => {
    console.log('New connection!');
  });

  server.on('listening', () => {
    console.log('Listening for connections!');
  });

  server.on('close', () => {
    console.log('Connection closed!');
  });
};

try {
  start();
} catch (err) {
  console.log(err);
}
export { AWS, redisClient };
