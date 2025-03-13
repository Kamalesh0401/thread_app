import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getThreadById, getThreadReplies } from '../api/threads';
import Layout from '../components/layout/Layout';
import ThreadCard from '../components/thread/ThreadCard';
import ReplyForm from '../components/reply/ReplyForm';
import ReplyCard from '../components/reply/ReplyCard';
import SocketContext from '../context/SocketContext';
import '../styles/components/thread.css';

const ThreadDetailPage = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { subscribe, unsubscribe } = useContext(SocketContext);

  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchThread = useCallback(async () => {
    try {
      const threadData = await getThreadById(threadId);
      setThread(threadData);
    } catch (err) {
      console.error('Error fetching thread:', err);
      setError('Thread not found or has been deleted.');
      setTimeout(() => navigate('/'), 2000);
    }
  }, [threadId, navigate]);

  const fetchReplies = useCallback(async (pageNum = 1) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getThreadReplies(threadId, pageNum);
      console.log("getThreadReplies : ", response);
      const newReplies = response;
      const currentPage = 1;
      const totalPages = 1;
      console.log("getThreadReplies : ", replies, currentPage, totalPages);

      if (pageNum === 1) {
        setReplies(newReplies);
      } else {
        setReplies(prev => [...prev, ...newReplies]);
      }

      setHasMore(currentPage < totalPages);
      setPage(currentPage);
    } catch (err) {
      console.error('Error fetching replies:', err);
      setError('Failed to load replies.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [threadId, replies]);

  useEffect(() => {
    fetchThread();
    fetchReplies(1);
  }, [fetchThread, fetchReplies]);

  useEffect(() => {
    const handleNewReply = (data) => {
      if (data.threadId === threadId) {
        setReplies(prev => [data.reply, ...prev]);
      }
    };

    subscribe('newReply', handleNewReply);

    return () => {
      unsubscribe('newReply', handleNewReply);
    };
  }, [threadId, subscribe, unsubscribe]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchReplies(page + 1);
    }
  };

  const handleReplyAdded = (newReply) => {
    setReplies(prev => [newReply, ...prev]);
  };

  const handleThreadDeleted = () => {
    navigate('/');
  };

  const handleReplyDeleted = (replyId) => {
    setReplies(prev => prev.filter(reply => reply.id !== replyId));
  };

  if (loading && !thread) {
    return (
      <Layout>
        <div className="loading-container">Loading thread...</div>
      </Layout>
    );
  }

  if (error && !thread) {
    return (
      <Layout>
        <div className="error-container">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="thread-detail-container">
        <div className="thread-detail-header">
          <button
            onClick={() => navigate(-1)}
            className="back-button"
          >
            ← Back
          </button>
          <h1>Thread</h1>
        </div>

        {thread && (
          <ThreadCard
            thread={thread}
            onDelete={handleThreadDeleted}
          />
        )}

        <div className="reply-section">
          <ReplyForm
            threadId={threadId}
            onReplyAdded={handleReplyAdded}
          />

          <div className="replies-header">
            <h2>Replies</h2>
          </div>

          {replies?.length > 0 ? (
            <div className="replies-list">
              {replies.map(reply => (
                <ReplyCard
                  key={reply.id}
                  reply={reply}
                  onDelete={handleReplyDeleted}
                />
              ))}

              {loadingMore && (
                <div className="loading-more">Loading more replies...</div>
              )}

              {hasMore && !loadingMore && (
                <button
                  onClick={handleLoadMore}
                  className="load-more-button"
                >
                  Load More
                </button>
              )}
            </div>
          ) : (
            <div className="no-replies">
              {loading ? 'Loading replies...' : 'No replies yet. Be the first to reply!'}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ThreadDetailPage;