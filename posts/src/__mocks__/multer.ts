import { Request, Response, NextFunction } from 'express';

export const memoryStorage = jest.fn();

class Multer {
  constructor() {}

  single = () => {
    return jest
      .fn()
      .mockImplementation(
        (fieldName: string) => (
          req: Request,
          res: Response,
          next: NextFunction
        ) => next()
      );
  };
}

const multer = () => {
  return new Multer();
};

export default multer;
