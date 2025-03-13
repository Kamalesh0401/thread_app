import { createContext, useState, useEffect, useContext } from 'react';
import { getNotifications, markNotificationsAsRead } from '../api/notifications';
import AuthContext from './AuthContext';
import SocketContext from './SocketContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const { subscribe, unsubscribe } = useContext(SocketContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const handleNewNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      };

      subscribe('newNotification', handleNewNotification);
      subscribe('newMention', handleNewNotification);

      return () => {
        unsubscribe('newNotification', handleNewNotification);
        unsubscribe('newMention', handleNewNotification);
      };
    }
  }, [isAuthenticated, subscribe, unsubscribe]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(notification => !notification.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds) => {
    try {
      await markNotificationsAsRead(notificationIds);

      setNotifications(prev =>
        prev.map(notification =>
          notificationIds.includes(notification.id)
            ? { ...notification, read: true }
            : notification
        )
      );

      calculateUnreadCount();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(notification => !notification.read)
        .map(notification => notification.id);

      if (unreadIds.length > 0) {
        await markNotificationsAsRead(unreadIds);

        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );

        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const calculateUnreadCount = () => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  };
  const markNotificationsViewed = () => {
    setUnreadCount(0); 
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      markNotificationsViewed
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;