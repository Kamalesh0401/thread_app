import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/dateFormatter';
import { renderWithMentions } from '../../utils/mentionParser';
import { likeThread, deleteThread } from '../../api/threads';
import Avatar from '../common/Avatar';
import AuthContext from '../../context/AuthContext';
import '../../styles/components/thread.css';

const ThreadCard = ({ thread, onDelete, onLike }) => {
  const { currentUserId } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(thread.isLikedByCurrentUser || false);
  const [likeCount, setLikeCount] = useState(thread.likeCount || 0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const isOwner = currentUserId === thread.UserId;

  console.log("ThreadCard , owner ", isOwner, currentUserId, thread);

  const handleLike = async () => {
    try {
      await likeThread(thread.id);

      if (isLiked) {
        setLikeCount(prev => prev - 1);
      } else {
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);

      if (onLike) {
        onLike(thread.id, !isLiked);
      }
    } catch (error) {
      console.error('Error liking thread:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this thread?')) {
      setIsDeleting(true);
      try {
        await deleteThread(thread.id);
        if (onDelete) {
          onDelete(thread.id);
        }
      } catch (error) {
        console.error('Error deleting thread:', error);
        setIsDeleting(false);
      }
    }
  };

  const toggleOptions = () => {
    setShowOptions(prev => !prev);
  };

  return (
    <div className={`thread-card ${isDeleting ? 'deleting' : ''}`}>
      <div className="thread-avatar">
        <Link to={`/profile/${thread.User.id}`}>
          <Avatar src={thread.User?.profilePicture} alt={thread.User?.username} size="medium" />
        </Link>
      </div>

      <div className="thread-content">
        <div className="thread-header">
          <div className="thread-user-info">
            <Link to={`/profile/${thread.User.id}`} className="thread-username">
              {thread.User?.username}
            </Link>
            <span className="thread-date">{formatRelativeTime(thread.createdAt)}</span>
          </div>

          {isOwner && (
            <div className="thread-options">
              <button
                onClick={toggleOptions}
                className="options-button"
                aria-label="Thread options"
              >
                <i class="fas fa-ellipsis-h"></i>
              </button>

              {showOptions && (
                <div className="thread-options-dropdown">
                  <button
                    onClick={handleDelete}
                    className="thread-delete-button"
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <Link to={`/thread/${thread.id}`} className="thread-body">
          <div
            dangerouslySetInnerHTML={{
              __html: renderWithMentions(thread.content)
            }}
          />
        </Link>

        <div className="thread-actions">
          <button
            onClick={handleLike}
            className={`action-button like-button ${isLiked ? 'liked' : ''}`}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <span className="like-icon"><i className="fas fa-heart like-icon"></i></span>
            <span className="action-count">{likeCount}</span>
          </button>

          <Link to={`/thread/${thread.id}`} className="action-button reply-button">
            <span className="reply-icon"><i className="fas fa-reply reply-icon"></i></span>
            <span className="action-count">{thread.replyCount || 0}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThreadCard;