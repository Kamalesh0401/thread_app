const { Thread, User, Reply, sequelize } = require('../models');

exports.createThread = async (content, userId) => {
  try {
    const thread = await Thread.create({
      content,
      UserId: userId
    });
    return thread;
  } catch (error) {
    throw new Error('Failed to create thread');
  }
};

exports.getAllThreads = async (page, limit) => {
  const offset = (page - 1) * limit;
  try {
    const threads = await Thread.findAndCountAll({
      include: [{
        model: User,
        attributes: ['id', 'username', 'profilePicture']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return {
      threads: threads.rows,
      totalPages: Math.ceil(threads.count / limit),
      currentPage: page
    };
  } catch (error) {
    throw new Error('Failed to get threads');
  }
};

exports.getThread = async (threadId) => {
  try {
    const thread = await Thread.findByPk(threadId, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'profilePicture']
        },
        {
          model: Reply,
          include: [{
            model: User,
            attributes: ['id', 'username', 'profilePicture']
          }],
          order: [['createdAt', 'ASC']]
        }
      ]
    });
    return thread;
  } catch (error) {
    throw new Error('Failed to get thread');
  }
};

exports.deleteThread = async (threadId, userId) => {
  const t = await sequelize.transaction();

  try {
    const thread = await Thread.findByPk(threadId);

    if (!thread) {
      throw new Error('Thread not found');
    }

    if (thread.UserId !== userId) {
      throw new Error('Not authorized to delete this thread');
    }

    await Thread.destroy({
      where: { id: threadId },
      transaction: t
    });

    await t.commit();
    return { message: 'Thread deleted successfully' };
  } catch (error) {
    await t.rollback();
    throw new Error('Failed to delete thread');
  }
};

exports.getPopularThreads = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  try {
    const threads = await Thread.findAll({
      include: [{
        model: User,
        attributes: ['id', 'username', 'profilePicture']
      }],
      order: [['likeCount', 'DESC']],
      limit,
      offset
    });
    return {
      threads: threads,
      totalPages: Math.ceil(threads.count / limit),
      currentPage: page
    };
  } catch (error) {
    throw new Error('Failed to get popular threads');
  }
};
