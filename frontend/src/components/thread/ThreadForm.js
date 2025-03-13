import React, { useState, useContext } from 'react';
import { createThread } from '../../api/threads';
import AuthContext from '../../context/AuthContext';
import { parseMentions } from '../../utils/mentionParser';
import '../../styles/components/thread.css';

const ThreadForm = ({ onThreadCreated }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Thread cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const mentions = parseMentions(content);

      const newThread = await createThread({
        content,
        mentions
      });

      setContent('');

      if (onThreadCreated) {
        onThreadCreated(newThread);
      }
    } catch (err) {
      setError('Failed to create thread. Please try again.');
      console.error('Error creating thread:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setContent(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="thread-form-container">
      <div className="thread-form-header">
        <div className="user-avatar">
          <img
            src={currentUser?.profilePicture || '/default-avatar.png'}
            alt={currentUser?.username}
          />
        </div>
      </div>

      <form className="thread-form">
        <textarea
          placeholder="What's happening?"
          value={content}
          onChange={handleChange}
          maxLength={280}
          disabled={isSubmitting}
          className="thread-input"
        />

        {error && <div className="error-message">{error}</div>}

        <div className="thread-form-footer">
          <div className="character-count">
            {content.length}/280
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="post-button"
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ThreadForm;