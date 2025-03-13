const { Like, Thread, Reply, User, Notification, sequelize } = require('../models');

const likeThreadService = async (userId, threadId) => {
  const t = await sequelize.transaction();
  try {
    const thread = await Thread.findByPk(threadId, { include: User });
    if (!thread) {
      throw new Error('Thread not found');
    }

    const existingLike = await Like.findOne({
      where: {
        UserId: userId,
        type: 'thread',
        itemId: threadId
      }
    });

    if (existingLike) {
      await existingLike.destroy({ transaction: t });
      await thread.decrement('likeCount', { transaction: t });
      await t.commit();
      return { success: true, liked: false, message: 'Thread unliked successfully' };
    }

    await Like.create({
      UserId: userId,
      type: 'thread',
      itemId: threadId
    }, { transaction: t });

    await thread.increment('likeCount', { transaction: t });

    if (thread.User.id !== userId) {
      await Notification.create({
        type: 'like',
        content: `${userId.username} liked your thread`,
        isRead: false,
        sourceId: threadId,
        UserId: thread.User.id
      }, { transaction: t });
    }

    await t.commit();
    return { success: true, liked: true, message: 'Thread liked successfully' };
  } catch (error) {
    await t.rollback();
    throw new Error(error.message);
  }
};

const likeReplyService = async (userId, replyId) => {
  const t = await sequelize.transaction();
  try {
    const reply = await Reply.findByPk(replyId, { include: User });
    if (!reply) {
      throw new Error('Reply not found');
    }

    const existingLike = await Like.findOne({
      where: {
        UserId: userId,
        type: 'reply',
        itemId: replyId
      }
    });

    if (existingLike) {
      await existingLike.destroy({ transaction: t });
      await t.commit();
      return { success: true, liked: false, message: 'Reply unliked successfully' };
    }

    await Like.create({
      UserId: userId,
      type: 'reply',
      itemId: replyId
    }, { transaction: t });

    if (reply.User.id !== userId) {
      await Notification.create({
        type: 'like',
        content: `${userId.username} liked your reply`,
        isRead: false,
        sourceId: replyId,
        UserId: reply.User.id
      }, { transaction: t });
    }

    await t.commit();
    return { success: true, liked: true, message: 'Reply liked successfully' };
  } catch (error) {
    await t.rollback();
    throw new Error(error.message);
  }
};

module.exports = {
  likeThreadService,
  likeReplyService
};
