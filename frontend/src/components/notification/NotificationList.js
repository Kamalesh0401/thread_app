import React, { useCallback, useEffect, useState } from 'react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import NotificationItem from './NotificationItem';
import Loader from '../common/Loader';
import { getNotifications, markAllAsRead } from '../../api/notifications';
import '../../styles/components/notification.css';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMoreNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getNotifications(page);
      console.log("getNotifications : ", response);
      if (response.length === 0) {
        setHasMore(false);
      } else {
        setNotifications(response);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [page, setNotifications, setLoading, setHasMore, setPage]);

  const { observerTarget } = useInfiniteScroll(loadMoreNotifications);

  useEffect(() => {
    loadMoreNotifications();
  }, [loadMoreNotifications]);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const hasUnreadNotifications = notifications.some(
    notification => !notification.isRead
  );

  return (
    <div className="notification-list-container">
      <div className="notification-list-header">
        <h2>Notifications</h2>
        {hasUnreadNotifications && (
          <button
            className="mark-read-button"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications?.length === 0 && !loading ? (
        <div className="no-notifications">
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
          {hasMore && (
            <div ref={observerTarget} className="load-more-container">
              {loading && <Loader />}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationList;