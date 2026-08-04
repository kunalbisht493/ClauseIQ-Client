import { request, API_URL } from './api';

export const login = (v) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(v),
  });

export const register = (v) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(v),
  });

export const logout = () =>
  request('/auth/logout', {
    method: 'POST',
  });

export const getCurrentUser = () => request('/auth/me');

export const googleLoginUrl = `${API_URL}/auth/google`;