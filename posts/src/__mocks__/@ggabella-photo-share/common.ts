import { Request, Response, NextFunction } from 'express';

const {
  BadRequestError,
  Publisher,
  Subjects,
  ProfilePhotoUpdatedEvent,
} = jest.requireActual('@ggabella-photo-share/common');

export const requireAuth = jest
  .fn()
  .mockImplementation((req: Request, res: Response, next: NextFunction) =>
    next()
  );
export { BadRequestError, Publisher, Subjects, ProfilePhotoUpdatedEvent };
