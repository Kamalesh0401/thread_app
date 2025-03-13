import { createContext, useEffect, useState, useRef, useContext } from 'react';
import io from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import { getToken } from '../utils/tokenManager';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const { currentUserId } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUserId) return;

    const token = getToken(currentUserId);
    if (!token) return;

    const socketInstance = io(process.env.REACT_APP_API_URL || 'http://localhost:5000/api', {
      auth: { token }
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [currentUserId]);

  const subscribe = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const unsubscribe = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      connected,
      subscribe,
      unsubscribe,
      emit
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
