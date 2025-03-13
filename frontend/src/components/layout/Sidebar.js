import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import NotificationContext from '../../context/NotificationContext';
import '../../styles/components/layout.css';

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);

  if (!currentUser) return null;

  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) =>
          isActive ? 'nav-item active' : 'nav-item'
        } end>
          <span className="nav-icon"> <i className="fas fa-home"></i></span>
          <span className="nav-text">Home</span>
        </NavLink>

        <NavLink to="/notifications" className={({ isActive }) =>
          isActive ? 'nav-item active' : 'nav-item'
        }>
          <span className="nav-icon"> <i className="fas fa-bell"></i></span>
          <span className="nav-text">Notifications</span>
          {unreadCount > 0 && (
            <span className="nav-badge">{unreadCount}</span>
          )}
        </NavLink>

        <NavLink to={`/profile/${currentUser.id}`} className={({ isActive }) =>
          isActive ? 'nav-item active' : 'nav-item'
        }>
          <span className="nav-icon"><i className="fas fa-user"></i></span>
          <span className="nav-text">Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;