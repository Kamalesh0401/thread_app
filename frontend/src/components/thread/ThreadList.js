import React, { useState, useEffect, useCallback } from 'react';
import { getThreads, getPopularThreads } from '../../api/threads';
import { getUserThreads } from '../../api/users';
import ThreadCard from './ThreadCard';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import '../../styles/components/thread.css';

const ThreadList = ({ filter = 'latest', initialThreads = [], userId = null }) => {
  const [threads, setThreads] = useState(initialThreads);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchThreads = useCallback(async (pageNum = 1) => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError('');

    console.log('Response from ThreadList initialThreads:', initialThreads, userId,);

    try {
      let response;
      if (userId) {
        response = await getUserThreads(userId, pageNum);
        console.log('Response from ThreadList if:', response);
      } else {
        response = filter === 'popular' ? await getPopularThreads(pageNum) : await getThreads(pageNum);
        console.log('Response from ThreadList else:', response);
      }

      if (!response || !response.threads) {
        setHasMore(false);
        return;
      }

      setThreads(prevThreads => {
        const newThreads = pageNum === 1 ? response.threads : [...prevThreads, ...response.threads];
        return JSON.stringify(prevThreads) === JSON.stringify(newThreads) ? prevThreads : newThreads;
      });

      setPage(response.currentPage || pageNum);
      setHasMore(response.currentPage < response.totalPages);
    } catch (err) {
      setError('Failed to load threads. Please try again.');
      console.error('Error fetching threads:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, userId, hasMore, loading, initialThreads]);

  useEffect(() => {
    setThreads([]);
    setPage(1);
    setHasMore(true);
    fetchThreads(1);
  }, [filter, userId, fetchThreads]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchThreads(page + 1);
    }
  }, [loading, hasMore, page, fetchThreads]);

  const [observerTarget] = useInfiniteScroll(loadMore);

  const handleThreadDeleted = useCallback((threadId) => {
    setThreads(prev => prev.filter(thread => thread.id !== threadId));
  }, []);

  const handleThreadLiked = useCallback((threadId, liked) => {
    setThreads(prev =>
      prev.map(thread =>
        thread.id === threadId
          ? {
            ...thread,
            likeCount: liked ? (thread.likeCount || 0) + 1 : (thread.likeCount || 0) - 1,
            isLikedByCurrentUser: liked
          }
          : thread
      )
    );
  }, []);

  return (
    <div className="thread-list">
      {loading && threads.length === 0 && <div className="loading-message">Loading threads...</div>}
      {error && threads.length === 0 && <div className="error-message">{error}</div>}
      {threads.length === 0 && !loading && !error && <div className="empty-message">No threads found.</div>}

      {(threads && threads.length !== 0) && threads.map(thread => (
        <ThreadCard
          key={thread.id}
          thread={thread}
          onDelete={handleThreadDeleted}
          onLike={handleThreadLiked}
        />
      ))}

      {loading && <div className="loading-indicator">Loading more...</div>}
      {error && <div className="error-message">{error}</div>}
      {hasMore && !loading && !error && <div ref={observerTarget} className="load-more-trigger"></div>}
    </div>
  );
};

export default ThreadList;
