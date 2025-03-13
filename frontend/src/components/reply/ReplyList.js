import React, { useEffect, useState } from 'react';
import ReplyCard from './ReplyCard';
import Loader from '../common/Loader';
import { getThreadReplies } from '../api/threads';
import { useSocket } from '../../hooks/useSocket';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import '../../styles/components/reply.css';

const ReplyList = ({ threadId }) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { socket } = useSocket();

  const loadMoreReplies = async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const response = await getThreadReplies(threadId, page);

      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setReplies(prev => [...prev, ...response.data]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setError('Failed to load replies');
    } finally {
      setLoading(false);
    }
  };

  const { observerTarget } = useInfiniteScroll(loadMoreReplies);

  useEffect(() => {
    setReplies([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    setError(null);

    loadMoreReplies();
  }, [threadId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewReply = (newReply) => {
      if (newReply.threadId === threadId) {
        setReplies(prev => [newReply, ...prev]);
      }
    };

    const handleUpdatedReply = (updatedReply) => {
      if (updatedReply.threadId === threadId) {
        setReplies(prev =>
          prev.map(reply =>
            reply.id === updatedReply.id ? updatedReply : reply
          )
        );
      }
    };

    socket.on('newReply', handleNewReply);
    socket.on('replyUpdated', handleUpdatedReply);

    return () => {
      socket.off('newReply', handleNewReply);
      socket.off('replyUpdated', handleUpdatedReply);
    };
  }, [socket, threadId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="reply-list">
      <h3 className="replies-heading">Replies</h3>

      {replies.length === 0 && !loading ? (
        <div className="no-replies">
          <p>No replies yet. Be the first to reply!</p>
        </div>
      ) : (
        <>
          {replies.map(reply => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              threadId={threadId}
            />
          ))}

          {hasMore && (
            <div ref={observerTarget} className="load-more-container">
              {loading && <Loader />}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReplyList;