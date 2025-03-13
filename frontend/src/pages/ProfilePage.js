import React from 'react';
import Layout from '../components/layout/Layout';
import UserProfile from '../components/user/UserProfile';
import '../styles/pages/profile.css';

const ProfilePage = () => {
  return (
    <Layout>
      <div className="profile-page">
        <UserProfile />
      </div>
    </Layout>
  );
};

export default ProfilePage;