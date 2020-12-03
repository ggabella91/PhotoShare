import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ProfilePhotoUpdatedEvent,
} from '@ggabella-photo-share/common';
import { queueGroupName } from './queue-group-name';
import { User } from '../../models/user';

export class ProfilePhotoUpdatedListener extends Listener<ProfilePhotoUpdatedEvent> {
  readonly subject = Subjects.ProfilePhotoUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: ProfilePhotoUpdatedEvent['data'], msg: Message) {
    const { userId, s3Key } = data;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.photo = s3Key;
    await user.save();

    msg.ack();
  }
}
