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

export const resendVerification = (email) =>
  request('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const forgotPassword = (email) =>
  request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const resetPassword = (token, newPassword) =>
  request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });

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

export const AUTH_CHANNEL_NAME = 'clauseiq_auth_sync';

export function broadcastAuthEvent(event) {
  try {
    if (typeof window !== 'undefined') {
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
        channel.postMessage(event);
        channel.close();
      }
      localStorage.setItem('clauseiq:auth_sync', JSON.stringify({ ...event, timestamp: Date.now() }));
    }
  } catch (err) {
    // Ignore storage errors in restricted contexts
  }
}

