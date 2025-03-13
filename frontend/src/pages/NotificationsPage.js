import React, { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import NotificationList from '../components/notification/NotificationList';
import { useNotification } from '../hooks/useNotification';
import '../styles/pages/notifications.css';

const NotificationsPage = () => {
  const { markNotificationsViewed } = useNotification();

  useEffect(() => {
    markNotificationsViewed();
  }, [markNotificationsViewed]);

  return (
    <Layout>
      <div className="notifications-page">
        <h1>Notifications</h1>
        <NotificationList />
      </div>
    </Layout>
  );
};

export default NotificationsPage;