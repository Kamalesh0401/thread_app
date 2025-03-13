const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUserProfile);
router.get('/:id/threads', userController.getUserThreads);

module.exports = router;