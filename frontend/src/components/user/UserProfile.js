import React, { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import ThreadList from '../thread/ThreadList';
import { getUserProfile, getUserThreads } from '../../api/users';
import '../../styles/components/profile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState('threads');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile(userId);
        const Threads = await getUserThreads(userId, page);
        setProfile(userData);
        setThreads(Threads?.threads || []);
        document.title = `${userData.username} | Profile`;
      } catch (err) {
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    setThreads([]);
    setPage(1);
    setHasMore(true);
    setError(null);

    fetchUserProfile();
  }, [userId, page]);

  const loadMoreThreads = useCallback(async () => {
    if (!hasMore || loadingThreads) return;

    try {
      setLoadingThreads(true);
      const threadData = await getUserThreads(userId, page);
      console.log("threadData", threadData)
      if (threadData.length === 0) {
        setHasMore(false);
      } else {
        setThreads(prev => [...prev, ...threadData]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (err) {
      setError('Failed to load threads');
    } finally {
      setLoadingThreads(false);
    }
  }, [hasMore, loadingThreads, userId, page, setHasMore, setLoadingThreads, setThreads, setPage, setError]);

  useEffect(() => {
    if (profile) {
      loadMoreThreads();
    }
  }, [userId, profile, loadMoreThreads]);

  console.log('Response from Profile:', threads, profile);

  if (error && !profile) {
    return (
      <div className="error-message">
        <div className="error-icon"><i className="fas fa-triangle-exclamation error-icon"></i></div>
        <div className="error-text">{error}</div>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <ProfileHeader profile={profile} isLoading={loading} />
      <div className="profile-content">
        <div className="profile-tabs mb-3">
          <button
            className={`profile-tab ${activeTab === 'threads' ? 'active' : ''}`}
            onClick={() => setActiveTab('threads')}
          >
            Threads
          </button>
        </div>

        {activeTab === 'threads' && (
          <>
            {threads.length === 0 ? (
              <div className="no-threads-message">
                <div className="empty-state-icon"><i className="fas fa-file-alt empty-state-icon"></i></div>
                <p>No threads yet</p>
                <span className="empty-state-subtitle">When this user posts threads, they'll appear here.</span>
              </div>
            ) : (<ThreadList initialThreads={threads} userId={profile?.id} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;