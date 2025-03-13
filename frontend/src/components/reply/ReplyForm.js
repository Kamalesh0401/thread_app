import React, { useState, useContext } from 'react';
import { addReplyToThread } from '../../api/threads';
import AuthContext from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext';
import { parseMentions } from '../../utils/mentionParser';
import '../../styles/components/thread.css';

const ReplyForm = ({ threadId, onReplyAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useContext(AuthContext);
  const { emit } = useContext(SocketContext);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Reply cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const mentions = parseMentions(content);
      
      const newReply = await addReplyToThread(threadId, { 
        content, 
        mentions 
      });
      
      emit('newReply', { 
        reply: newReply, 
        threadId 
      });
      
      setContent('');
      
      if (onReplyAdded) {
        onReplyAdded(newReply);
      }
    } catch (err) {
      setError('Failed to post reply. Please try again.');
      console.error('Error posting reply:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e) => {
    setContent(e.target.value);
    if (error) setError('');
  };
  
  return (
    <div className="reply-form-container">
      <div className="reply-form-header">
        <div className="user-avatar">
          <img 
            src={currentUser?.profilePicture || '/default-avatar.png'} 
            alt={currentUser?.username} 
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="reply-form">
        <textarea
          placeholder="Write a reply..."
          value={content}
          onChange={handleChange}
          maxLength={280}
          disabled={isSubmitting}
          className="reply-input"
        />
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="reply-form-footer">
          <div className="character-count">
            {content.length}/280
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting || !content.trim()} 
            className="reply-button"
          >
            {isSubmitting ? 'Replying...' : 'Reply'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;