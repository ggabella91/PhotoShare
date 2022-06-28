import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  PasswordResetRequestedEvent,
} from '@ggabella-photo-share/common';
import { queueGroupName } from './queue-group-name';
import { Email } from '../../utils/email';

export class PasswordResetRequestedListener extends Listener<PasswordResetRequestedEvent> {
  readonly subject = Subjects.PasswordResetRequested;

  queueGroupName = queueGroupName;

  async onMessage(data: PasswordResetRequestedEvent['data'], msg: Message) {
    const resetPassUser = {
      name: data.name,
      email: data.email,
      resetToken: data.resetToken,
    };

    console.log(data);

    let url;

    if (process.env.NODE_ENV === 'development') {
      url = `https://photo-share.dev/reset-password/${resetPassUser.resetToken}`;
    } else {
      url = `www.photo-share.us/reset-password/${resetPassUser.resetToken}`;
    }

    await new Email(resetPassUser, url).sendPasswordReset();

    msg.ack();
  }
}
