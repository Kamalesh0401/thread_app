const { Notification, User, Reply, Like, Thread } = require('../models');

const getNotificationsService = async (userId) => {
  try {
    const notifications = await Notification.findAll({
      where: { UserId: userId },
      include: [
        {
          model: Reply,
          as: 'Reply',
          attributes: ['UserId', 'ThreadId'],
          required: false,
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['username', 'profilePicture']
            },
            {
              model: Thread,
              as: 'ReplyThread',
              attributes: ['id', 'content'],
            },
          ],
        },
        {
          model: Like,
          as: 'Like',
          attributes: ['UserId', 'itemId'],
          required: false,
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['username', 'profilePicture']
            },
            {
              model: Thread,
              as: 'LikeThread',
              attributes: ['id', 'content'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    const mappedNotifications = notifications.map((notification) => {
      let Sender = null;
      let Thread = null;

      if ((notification.type === 'reply' || notification.type === 'mention') && notification.Reply && notification.Reply.User) {
        Sender = {
          userId: notification.Reply.UserId,
          username: notification.Reply.User.username,
          profilePicture: notification.Reply.User.profilePicture,
        };
        Thread = {
          id: notification.Reply.ReplyThread.id,
          content: notification.Reply.ReplyThread.content,
        }
        const { Like, Reply, ...result } = notification.toJSON();
        return {
          ...result,
          Sender: Sender,
          thread: Thread
        };
      } else if (notification.type === 'like' && notification.Like && notification.Like.User) {
        Sender = {
          userId: notification.Like.UserId,
          username: notification.Like.User.username,
          profilePicture: notification.Like.User.profilePicture,
        };
        Thread = {
          id: notification.Reply.LikeThread.id,
          content: notification.Reply.LikeThread.content,
        }
        const { Like, Reply, ...result } = notification.toJSON();
        return {
          ...result,
          Sender: Sender,
          thread: Thread
        };
      }
    });

    return mappedNotifications;
  } catch (error) {
    throw new Error('Failed to fetch notifications: ' + error.message);
  }
};

const markNotificationsAsReadService = async (userId, notificationIds = null) => {
  try {
    if (notificationIds && notificationIds.length > 0) {
      await Notification.update(
        { isRead: true },
        { where: { id: notificationIds, UserId: userId } }
      );
    } else {
      await Notification.update(
        { isRead: true },
        { where: { UserId: userId, isRead: false } }
      );
    }

    return { message: 'Notifications marked as read' };
  } catch (error) {
    throw new Error('Failed to mark notifications as read: ' + error.message);
  }
};

module.exports = {
  getNotificationsService,
  markNotificationsAsReadService
};
