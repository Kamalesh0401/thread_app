import React, { useState } from 'react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { formatDate } from '../../utils/dateFormatter';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/components/profile.css';

const ProfileHeader = ({ profile, isLoading }) => {

  const { currentUserId } = useAuth();
  const isCurrentUser = profile && currentUserId === profile.id;
  const [isFollowing, setIsFollowing] = useState(false);
  console.log("ProfileHeader profile:", profile);
  console.log("ProfileHeader user:", currentUserId);
  const handleFollowToggle = () => {
    const button = document.querySelector('.follow-button');
    button.classList.add('button-pressed');
    setTimeout(() => button.classList.remove('button-pressed'), 200);

    setIsFollowing(!isFollowing);
  };

  if (isLoading) {
    return (
      <div className="profile-header-skeleton">
        <div className="skeleton-animation"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-header-error">
        <div className="error-icon"><i className="fa-solid fa-magnifying-glass"></i></div>
        <div>Profile not found</div>
      </div>
    );
  }

  return (
    <div className="profile-header">
      <div className="profile-header-cover">
        {profile.coverPicture && (
          <img
            src={profile.coverPicture}
            alt="Cover"
            className="profile-cover-image"
          />
        )}
      </div>

      <div className="profile-header-main">
        <div className="profile-avatar-container">
          <Avatar
            src={profile.profilePicture}
            alt={profile.username}
            size="large"
          />
          <div className="avatar-status-indicator"
            style={{ backgroundColor: profile.isOnline ? '#2ecc71' : '#95a5a6' }}>
          </div>
        </div>

        <div className="profile-header-content">
          <div className="profile-header-info">
            <h1 className="profile-name">
              {profile.username}
            </h1>

            {isCurrentUser ? (
              <Button
                variant="outlined"
                className="edit-profile-button"
                onClick={() => { }}
              >
                <span className="button-icon"><i className="fa-solid fa-pen"></i></span> Edit Profile
              </Button>
            ) : (
              <Button
                variant={isFollowing ? "outlined" : "filled"}
                className={`follow-button ${isFollowing ? 'following' : ''}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>

          <p className="profile-bio">{profile.bio || "No bio yet"}</p>

          <div className="profile-metadata">
            <span className="profile-joined">
              <i className="calendar-icon"></i>
              Joined {formatDate(profile.createdAt)}
            </span>

            <div className="profile-stats">
              <span className="profile-stat">
                <strong>{profile.threadCount || 0}</strong> Threads
              </span>
              <span className="profile-stat profile-stat-interactive" onClick={() => { }}>
                <strong>{profile.followersCount || 0}</strong> Followers
              </span>
              <span className="profile-stat profile-stat-interactive" onClick={() => { }}>
                <strong>{profile.followingCount || 0}</strong> Following
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;