const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController');
const replyController = require('../controllers/replyController');
const likeController = require('../controllers/likeController');
const auth = require('../middlewares/auth');
const rateLimiter = require('../middlewares/rateLimiter');

const createLimiter = rateLimiter(10, 60);

router.post('/', auth, createLimiter, threadController.createThread);
router.get('/', threadController.getAllThreads);
router.get('/popular', threadController.getPopularThreads);
router.get('/:id', threadController.getThread);
router.delete('/:id', auth, threadController.deleteThread);


router.post('/:id/like', auth, likeController.likeThread);

module.exports = router;