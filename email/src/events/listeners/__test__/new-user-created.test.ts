import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { NewUserCreatedEvent } from '@ggabella-photo-share/common';
import { NewUserCreatedListener } from '../new-user-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Email } from '../../../utils/email';

const setup = () => {
  // Create an instance of the listener
  const listener = new NewUserCreatedListener(natsWrapper.client);

  // Create fake user created event
  const data: NewUserCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'Test Dude',
    email: 'testdude@testemail.com',
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
  expect;
});

it('sends the new user an email', async () => {
  const { listener, data, msg } = setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
  expect;

  expect(Email).toHaveBeenCalled();
});
