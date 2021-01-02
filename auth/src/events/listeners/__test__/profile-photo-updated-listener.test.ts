import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { ProfilePhotoUpdatedEvent } from '@ggabella-photo-share/common';
import { ProfilePhotoUpdatedListener } from '../profile-photo-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { User } from '../../../models/user';

const setup = async () => {
  // Create an instance of the listener
  const listener = new ProfilePhotoUpdatedListener(natsWrapper.client);

  // Create and save a user
  const user = User.build({
    name: 'Test Dude',
    email: 'test@testdude.com',
    password: 'password',
    active: true,
  });
  await user.save();

  // Create fake user created event
  const data: ProfilePhotoUpdatedEvent['data'] = {
    userId: user.id,
    s3Key: `user-${mongoose.Types.ObjectId().toHexString()}-1609473101903.jpeg`,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, user, data, msg };
};

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('updates the users profile photo', async () => {
  const { listener, user, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedUser = await User.findById(user.id);

  expect(updatedUser!.photo).toEqual(data.s3Key);
});
