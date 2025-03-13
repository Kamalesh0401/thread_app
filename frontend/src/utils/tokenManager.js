import jwtDecode from 'jwt-decode';

const TOKEN_PREFIX = 'user_';

export const setToken = (userId, token) => {
  sessionStorage.setItem(`${TOKEN_PREFIX}${userId}`, token);
};

export const getToken = (userId) => {
  return sessionStorage.getItem(`${TOKEN_PREFIX}${userId}`);
};

export const removeToken = (userId) => {
  sessionStorage.removeItem(`${TOKEN_PREFIX}${userId}`);
};

export const isTokenValid = (userId) => {
  const token = getToken(userId);
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      removeToken();
      return false;
    }

    return true;
  } catch (error) {
    removeToken();
    return false;
  }
};

export const getUserIdFromToken = (userId) => {
  const token = getToken(userId);
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};