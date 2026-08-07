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

export const verifyEmail = (token) =>
  request(`/auth/verify-email?token=${encodeURIComponent(token)}`);

export const changePassword = (currentPassword, newPassword) =>
  request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });

export const deleteAccount = (currentPassword) =>
  request('/auth/me', {
    method: 'DELETE',
    body: JSON.stringify({ currentPassword }),
  });

export const googleLoginUrl = `${API_URL}/auth/google`;