const { Reply, Thread, User, Notification, sequelize } = require('../models');
const socketEvents = require('../sockets/events');

const createReplyService = async (userId, content, threadId) => {
  const t = await sequelize.transaction();

  try {
    const thread = await Thread.findByPk(threadId, { include: User });
    if (!thread) {
      throw new Error('Thread not found');
    }
    const reply = await Reply.create({
      content,
      UserId: userId,
      ThreadId: threadId
    }, { transaction: t });

    if (thread.User.id !== userId) {
      const notification = await Notification.create({
        type: 'reply',
        content: `${userId} replied to your thread`,
        isRead: false,
        sourceId: reply.id,
        UserId: thread.User.id
      }, { transaction: t });

      socketEvents.emitNewNotification(thread.User.id, notification);
    }

    const mentionRegex = /@(\w+)/g;
    const mentions = content.match(mentionRegex);

    if (mentions) {
      for (const mention of mentions) {
        const username = mention.substring(1);
        const mentionedUser = await User.findOne({ where: { username } });

        if (mentionedUser && mentionedUser.id !== userId) {
          const notification = await Notification.create({
            type: 'mention',
            content: `${userId} mentioned you in a reply`,
            isRead: false,
            sourceId: reply.id,
            UserId: mentionedUser.id
          }, { transaction: t });

          socketEvents.emitNewMention(mentionedUser.id, notification);
        }
      }
    }

    await t.commit();

    const replyWithUser = await Reply.findByPk(reply.id, {
      include: [{
        model: User,
        attributes: ['id', 'username', 'profilePicture']
      }]
    });

    socketEvents.emitNewReply(threadId, replyWithUser);

    return replyWithUser;
  } catch (error) {
    await t.rollback();
    throw new Error('Failed to create reply: ' + error.message);
  }
};

const getThreadRepliesService = async (threadId) => {
  try {
    const replies = await Reply.findAll({
      where: { ThreadId: threadId },
      include: [{
        model: User,
        attributes: ['id', 'username', 'profilePicture']
      }],
      order: [['createdAt', 'ASC']]
    });

    return replies;
  } catch (error) {
    throw new Error('Failed to get replies: ' + error.message);
  }
};

module.exports = {
  createReplyService,
  getThreadRepliesService
};
