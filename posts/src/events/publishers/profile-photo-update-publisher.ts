import {
  Publisher,
  Subjects,
  ProfilePhotoUpdatedEvent,
} from '@ggabella-photo-share/common';

export class ProfilePhotoUpdatedPublisher extends Publisher<ProfilePhotoUpdatedEvent> {
  readonly subject = Subjects.ProfilePhotoUpdated;
}
