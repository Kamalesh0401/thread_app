import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { formatDistanceToNow } from '../../utils/dateFormatter';
import '../../styles/components/notification.css';

const NotificationItem = ({ notification }) => {
  const { type, Sender, createdAt, isRead } = notification;
  const thread = notification.thread || {};

  console.log("NotificationItem : ", notification, type, Sender, thread, createdAt, isRead);
  const getNotificationText = () => {
    switch (type) {
      case 'reply':
        return `replied to your thread`;
      case 'mention':
        return `mentioned you in a thread`;
      case 'like':
        return `liked your thread`;
      default:
        return `interacted with your content`;
    }
  };

  return (
    <div className={`notification-item ${!isRead ? 'notification-unread' : ''}`}>
      <div className="notification-avatar">
        <Link to={`/profile/${Sender.userId}`}>
          <Avatar src={Sender.profilePicture} alt={Sender.username} size="medium" />
        </Link>
      </div>
      <div className="notification-content">
        <div className="notification-text">
          <Link to={`/profile/${Sender.userId}`} className="notification-username">
            {Sender.username}
          </Link>{' '}
          {getNotificationText()}
          {thread && (
            <Link to={`/thread/${thread.id}`} className="notification-thread-link">
              {thread.content.length > 50
                ? `${thread.content.substring(0, 50)}...`
                : thread.content}
            </Link>
          )}
        </div>
        <div className="notification-time">{formatDistanceToNow(createdAt)}</div>
      </div>
    </div>
  );
};

export default NotificationItem;