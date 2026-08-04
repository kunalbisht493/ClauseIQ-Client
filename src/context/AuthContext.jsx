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

  const signIn = async (v) => {
    const r = await auth.login(v);
    persistUser(r.user);
    return r;
  };

  const loadCurrentUser = async () => {
    const r = await auth.getCurrentUser();
    persistUser(r.user);
    return r;
  };

  const signOut = async () => {
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