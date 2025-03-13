import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { formatDistanceToNow } from '../../utils/dateFormatter';
import { likeReply, unlikeReply } from '../../api/replies';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/components/reply.css';

const ReplyCard = ({ reply, threadId }) => {
  console.log("reply Card : ", reply)
  const { currentUserId } = useAuth();
  const [likes, setLikes] = useState(reply.likeCount || 0);
  const [isLiked, setIsLiked] = useState(reply.isLikedByUser || false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const handleLikeToggle = async () => {
    if (!currentUserId || isLikeLoading) return;

    try {
      setIsLikeLoading(true);

      if (isLiked) {
        await unlikeReply(reply.id);
        setLikes(prev => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        await likeReply(reply.id);
        setLikes(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const renderContent = (content) => {
    const mentionRegex = /@(\w+)/g;
    const parts = content.split(mentionRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <Link
            key={index}
            to={`/profile/${part}`}
            className="mention-link"
          >
            @{part}
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <div className="reply-card">
      <div className="reply-avatar">
        <Link to={`/profile/${reply.User.id}`}>
          <Avatar
            src={reply.User.profilePicture}
            alt={reply.User.username}
            size="small"
          />
        </Link>
      </div>

      <div className="reply-content">
        <div className="reply-header">
          <Link to={`/profile/${reply.User.id}`} className="reply-username">
            {reply.User.username}
          </Link>
          <span className="reply-time">
            {formatDistanceToNow(reply.createdAt)}
          </span>
        </div>

        <div className="reply-text">
          {renderContent(reply.content)}
        </div>

        <div className="reply-actions">
          <button
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLikeToggle}
            disabled={isLikeLoading || !currentUserId}
          >
            <i className={`like-icon ${isLiked ? 'liked' : ''}`}></i>
            {likes > 0 && <span className="like-count">{likes}</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyCard;