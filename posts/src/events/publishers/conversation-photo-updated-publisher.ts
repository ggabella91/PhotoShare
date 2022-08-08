import {
  Publisher,
  Subjects,
  ConversationPhotoUpdatedEvent,
} from '@ggabella-photo-share/common';

export class ConversationPhotoUpdatedPublisher extends Publisher<ConversationPhotoUpdatedEvent> {
  readonly subject = Subjects.ConversationPhotoUpdated;
}
