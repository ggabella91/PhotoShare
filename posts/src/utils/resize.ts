import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';

const resizePhoto = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.currentUser!.id}-${Date.now()}.jpeg`;

  req.file.buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();

  next();
};

export { resizePhoto };
