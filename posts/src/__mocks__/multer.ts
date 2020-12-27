import { Request, Response, NextFunction } from 'express';

const memoryStorage = jest.fn();

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

module.exports = multer;
module.exports.memoryStorage = memoryStorage;
