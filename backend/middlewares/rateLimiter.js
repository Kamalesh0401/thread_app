const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = (points, duration) => {

  const rateLimiter = new RateLimiterMemory({
    keyPrefix: 'ratelimit',
    points: points,
    duration: duration,
  });

  return async (req, res, next) => {
    try {
      const key = req.user ? req.user.id.toString() : req.ip;
      await rateLimiter.consume(key);
      next();
    } catch (error) {
      res.status(429).json({ error: 'Too many requests, please try again later' });
    }
  };
};

module.exports = rateLimiter;