import express, { Request, Response } from 'express';
import { currentUser, requireAuth } from '@ggabella-photo-share/common';

const router = express.Router();

router.get(
  '/api/posts/mapbox/api-access-token',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const mapBoxApiAccessToken = process.env.MAPBOX_GL_ACCESS_TOKEN;

    res.status(200).send(mapBoxApiAccessToken);
  }
);

export { router as getMapBoxApiAccessTokenRouter };
