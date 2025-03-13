import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../api/auth';
import { setToken, getToken, removeToken } from '../utils/tokenManager';
import { setApiUserId } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setApiUserId(currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUserId = localStorage.getItem('currentUserId'); 
      if (storedUserId) {
        const token = getToken(storedUserId);
        if (token) {
          try {
            setCurrentUserId(storedUserId);
            const userData = await getCurrentUser(storedUserId);
            setUsers(prevUsers => ({
              ...prevUsers,
              [userData.id]: userData,
            }));
          } catch (err) {
            console.error('Error fetching user data:', err);
            removeToken(storedUserId);
            setCurrentUserId(null);
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await loginUser({ email, password });
      setToken(user.id, token);
      setUsers(prevUsers => ({
        ...prevUsers,
        [user.id]: user,
      }));
      setCurrentUserId(user.id);
      localStorage.setItem('currentUserId', user.id); 
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await registerUser(userData);
      setToken(user.id, token);
      setUsers(prevUsers => ({
        ...prevUsers,
        [user.id]: user,
      }));
      setCurrentUserId(user.id);
      localStorage.setItem('currentUserId', user.id); 
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken(currentUserId);
    localStorage.removeItem('currentUserId');  
    setUsers(prevUsers => {
      const newUsers = { ...prevUsers };
      delete newUsers[currentUserId];
      return newUsers;
    });
    setCurrentUserId(null);
  };

  const updateUserData = (userData) => {
    setUsers(prevUsers => ({
      ...prevUsers,
      [userData.id]: { ...prevUsers[userData.id], ...userData },
    }));
  };

  const switchUser = (userId) => {
    setCurrentUserId(userId);
    localStorage.setItem('currentUserId', userId); 
  };

  return (
    <AuthContext.Provider value={{
      currentUser: users[currentUserId],
      currentUserId,
      loading,
      error,
      login,
      register,
      logout,
      updateUserData,
      switchUser,
      isAuthenticated: !!currentUserId,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;