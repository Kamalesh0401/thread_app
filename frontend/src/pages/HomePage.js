import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { getThreads, getPopularThreads } from '../api/threads';
import ThreadForm from '../components/thread/ThreadForm';
import ThreadList from '../components/thread/ThreadList';
import '../styles/pages/home.css';

const HomePage = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('latest');
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      setError('');
      try {
        const response = filter === 'popular' ? await getPopularThreads() : await getThreads();
        setThreads(response.threads);
      } catch (err) {
        setError('Failed to load threads.');
      }
      setLoading(false);
    };

    fetchThreads();
  }, [filter]);

  const handleThreadCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Layout>
      <div className="home-container">
        <div className="feed-header">
          <h1>Home</h1>
          <div className="feed-tabs">
            <button
              className={`feed-tab ${filter === 'latest' ? 'active' : ''}`}
              onClick={() => setFilter('latest')}
            >
              Latest
            </button>
            <button
              className={`feed-tab ${filter === 'popular' ? 'active' : ''}`}
              onClick={() => setFilter('popular')}
            >
              Popular
            </button>
          </div>
        </div>

        <ThreadForm onThreadCreated={handleThreadCreated} />

        <div className="feed-divider"></div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : threads?.length < 0 ? (<p>No threads yet</p>) : (
          <ThreadList key={refreshKey} threads={threads} />
        )}
      </div>
    </Layout>

  );
};

export default HomePage;
