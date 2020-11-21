import { natsWrapper } from './nats-wrapper';
import { NewUserCreatedListener } from './events/listeners/new-user-created-listener';
import { PasswordResetRequestedListener } from './events/listeners/password-reset-requested-listener';

const start = async () => {
  console.log('Starting email service...');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
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

  new NewUserCreatedListener(natsWrapper.client).listen();
  new PasswordResetRequestedListener(natsWrapper.client).listen();
};

start();
