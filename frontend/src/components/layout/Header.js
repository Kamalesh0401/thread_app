import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import NotificationContext from '../../context/NotificationContext';
import Avatar from '../common/Avatar';
import '../../styles/components/layout.css';

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="logo">
          ThreadApp
        </Link>

        {currentUser && (
          <div className="header-actions">
            <Link to="/notifications" className="notification-link">
              <span className="notification-icon">
                <i className="fas fa-bell"></i>
              </span>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </Link>

            <div className="user-menu" ref={dropdownRef}>
              <div className="user-avatar" onClick={toggleDropdown}>
                <Avatar src={currentUser.profilePicture} alt={currentUser.username} size="medium" />
              </div>

              {isDropdownOpen && (
                <div className="user-dropdown">
                  <Link to={`/profile/${currentUser.id}`} className="dropdown-item">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout-button">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
