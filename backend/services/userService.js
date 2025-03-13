const { User, Thread } = require('../models');

exports.getUserProfile = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    return user;
  } catch (error) {
    throw new Error('Failed to get user profile');
  }
};

exports.getUserThreads = async (userId, page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const threads = await Thread.findAll({
      where: {
        userId: userId,
      },
      include: [{
        model: User,
        attributes: ['id', 'username', 'profilePicture']
      }],
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      threads: threads,
      totalPages: Math.ceil(threads.count / limit),
      currentPage: page
    };
  } catch (error) {
    throw new Error('Failed to get user threads');
  }
};
