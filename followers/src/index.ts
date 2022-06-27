import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  console.log('Starting up followers service....');

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

  let mongoURI = process.env.MONGO_URI.replace(
    '<PASSWORD>',
    process.env.MONGO_PASSWORD
  ).replace('<MONGO_CLUSTER_HOST>', process.env.MONGO_CLUSTER_HOST);

  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB');

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!');
  });
};

start();
