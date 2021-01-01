import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { PasswordResetRequestedEvent } from '@ggabella-photo-share/common';
import { PasswordResetRequestedListener } from '../password-reset-requested-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Email } from '../../../utils/email';

const setup = () => {
  // Create an instance of the listener
  const listener = new PasswordResetRequestedListener(natsWrapper.client);

  // Create fake user created event
  const data: PasswordResetRequestedEvent['data'] = {
    name: 'Test Dude',
    email: 'testdude@testemail.com',
    resetToken: mongoose.Types.ObjectId().toHexString(),
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('acks the message', async () => {
  const { listener, data, msg } = setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('sends the user a password reset email', async () => {
  const { listener, data, msg } = setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
  expect;

  expect(Email).toHaveBeenCalled();
});
