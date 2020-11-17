import {
  Publisher,
  Subjects,
  NewUserCreatedEvent,
} from '@ggabella-photo-share/common';

export class NewUserCreatedPublisher extends Publisher<NewUserCreatedEvent> {
  readonly subject = Subjects.NewUserCreated;
}
