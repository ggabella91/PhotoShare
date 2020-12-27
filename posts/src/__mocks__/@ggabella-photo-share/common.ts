const {
  BadRequestError,
  Publisher,
  Subjects,
  ProfilePhotoUpdatedEvent,
} = jest.requireActual('@ggabella-photo-share/common');

export const requireAuth = jest.fn();
export { BadRequestError, Publisher, Subjects, ProfilePhotoUpdatedEvent };
