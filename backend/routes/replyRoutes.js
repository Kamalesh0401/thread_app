const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const replyController = require('../controllers/replyController');
const auth = require('../middlewares/auth');
const rateLimiter = require('../middlewares/rateLimiter');

const createLimiter = rateLimiter(10, 60);

router.post('/:id/replies', auth, createLimiter, replyController.createReply);
router.get('/:id/replies', replyController.getThreadReplies);
router.post('/:id/like', auth, likeController.likeReply);

module.exports = router;