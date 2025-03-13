const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimiter = require('../middlewares/rateLimiter');

const loginLimiter = rateLimiter(5, 60);
const registerLimiter = rateLimiter(3, 60);

router.post('/register', registerLimiter, authController.register);
router.post('/login', loginLimiter, authController.login);

module.exports = router;