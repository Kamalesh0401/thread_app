const { getNotificationsService, markNotificationsAsReadService } = require('../services/notificationService');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await getNotificationsService(userId);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get notifications', details: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ids } = req.body;

    const result = await markNotificationsAsReadService(userId, ids);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notifications as read', details: error.message });
  }
};
