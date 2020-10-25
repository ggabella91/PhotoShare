import express from 'express';
import { currentUser } from '@ggabella-photo-share/common';
var router = express.Router();
router.get('/api/users/currentuser', currentUser, function (req, res) {
    res.send({ currentUser: req.currentUser || null });
});
export { router as currentUserRouter };
