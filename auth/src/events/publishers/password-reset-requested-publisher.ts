import {
  Publisher,
  Subjects,
  PasswordResetRequestedEvent,
} from '@ggabella-photo-share/common';

export class PasswordResetRequestedPublisher extends Publisher<
  PasswordResetRequestedEvent
> {
  readonly subject = Subjects.PasswordResetRequested;
}
