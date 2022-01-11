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

    if (!location) {
      throw new BadRequestError('No location was provided.');
    }

    const params = {
      access_key: process.env.POSITION_STACK_API_KEY,
      query: location,
    };

    try {
      const {
        data: { data: locationsSuggesions },
      } = await axios.get('http://api.positionstack.com/v1/forward', {
        params,
      });

      console.log('Locations search results: ', locationsSuggesions);

      res.status(200).send(locationsSuggesions);
    } catch (err) {
      console.log('Error with request to positionstack API: ', err);
    }
  }
);

export { router as getLocationsSuggestionsRouter };
