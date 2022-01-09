import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import axios from 'axios';

const router = express.Router();

router.get(
  '/api/posts/locations/:location',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const { location } = req.params;

    const params = {
      access_key: '1869037cc2ffd8a6df4c3e4a620128d4',
      query: location,
    };

    try {
      const { data } = await axios.get(
        'https://api.positionstack.com/v1/forward',
        { params }
      );

      console.log('Locations search results: ', data);
    } catch (err) {
      console.log('Error with request to positionstack API: ', err);
    }
  }
);

export { router as getLocationsSuggestionsRouter };
