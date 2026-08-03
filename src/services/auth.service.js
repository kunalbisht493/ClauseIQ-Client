import { request } from './api';

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

export const googleLogin = (credential) =>
  request('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  });