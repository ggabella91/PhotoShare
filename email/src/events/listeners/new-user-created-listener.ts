import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  NewUserCreatedEvent,
} from '@ggabella-photo-share/common';
import { queueGroupName } from './queue-group-name';
import { Email } from '../../utils/email';

export class NewUserCreatedListener extends Listener<NewUserCreatedEvent> {
  readonly subject = Subjects.NewUserCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: NewUserCreatedEvent['data'], msg: Message) {
    const newUser = {
      name: data.name,
      email: data.email,
      username: data.username,
    };

    console.log(data);

    let url;

    if (process.env.NODE_ENV === 'development') {
      url = 'https://photo-share.dev/me';
    } else {
      url = 'www.photo-share.us/me';
    }

    try {
      await new Email(newUser, url).sendWelcome();
    } catch (err) {
      console.log(err);
    }

    msg.ack();
  }
}
