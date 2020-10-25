import express from 'express';
var router = express.Router();
router.post('/api/users/signout', function (req, res) {
    req.session = null;
    res.send({});
});
export { router as signoutRouter };
