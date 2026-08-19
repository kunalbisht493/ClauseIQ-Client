import { createContext, useContext, useEffect, useState } from 'react';
import * as auth from '../services/auth.service';

const C = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(sessionStorage.getItem('clauseiq-user') || 'null')
  );
  const [checkingSession, setCheckingSession] = useState(true);

  const persistUser = (u) => {
    setUser(u);
    sessionStorage.setItem('clauseiq-user', JSON.stringify(u));
  };

  const clearUser = () => {
    setUser(null);
    sessionStorage.removeItem('clauseiq-user');
  };

  useEffect(() => {
    auth
      .getCurrentUser()
      .then((r) => persistUser(r.user))
      .catch(() => clearUser())
      .finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    function handleUnauthorized(event) {
      const path = event.detail?.path || '';
      const wasLoggedIn = Boolean(sessionStorage.getItem('clauseiq-user'));

      clearUser();

      // Only flag as an "expired session" if it happened on a real
      // authenticated call, not on a fresh guest's /auth/me check or a
      // failed login attempt (both expected to 401 in normal use).
      if (wasLoggedIn && path !== '/auth/login' && path !== '/auth/me') {
        sessionStorage.setItem('clauseiq-session-expired', '1');
      }
    }

    function handleCrossTabEvent(data) {
      if (!data || !data.type) return;

      if (data.type === 'LOGOUT') {
        clearUser();
        if (data.reason === 'password_reset') {
          sessionStorage.setItem(
            'clauseiq-session-notice',
            'Your password was reset from another tab. Please log in with your new password.'
          );
        }
      } else if (data.type === 'LOGIN') {
        auth
          .getCurrentUser()
          .then((r) => persistUser(r.user))
          .catch(() => clearUser());
      }
    }

    // 1. BroadcastChannel listener (instant multi-tab synchronization)
    let channel;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel(auth.AUTH_CHANNEL_NAME);
      channel.onmessage = (event) => handleCrossTabEvent(event.data);
    }

    // 2. Storage event fallback (for storage sync across tabs)
    function handleStorage(e) {
      if (e.key === 'clauseiq:auth_sync' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          handleCrossTabEvent(data);
        } catch (_) {}
      }
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('storage', handleStorage);
      if (channel) channel.close();
    };
  }, []);

  const signIn = async (v) => {
    const r = await auth.login(v);
    persistUser(r.user);
    auth.broadcastAuthEvent({ type: 'LOGIN' });
    return r;
  };

  const loadCurrentUser = async () => {
    const r = await auth.getCurrentUser();
    persistUser(r.user);
    return r;
  };

  const signOut = async () => {
    auth.broadcastAuthEvent({ type: 'LOGOUT', reason: 'manual' });
    await auth.logout();
    clearUser();
  };

  return (
    <C.Provider
      value={{
        user,
        checkingSession,
        signIn,
        signOut,
        loadCurrentUser,
        register: auth.register,
      }}
    >
      {children}
    </C.Provider>
  );
}

export const useAuth = () => useContext(C);