import { createContext, useContext, useState } from 'react';
import * as auth from '../services/auth.service';

const C = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(sessionStorage.getItem('clauseiq-user') || 'null')
  );

  const signIn = async (v) => {
    const r = await auth.login(v);
    setUser(r.user);
    sessionStorage.setItem('clauseiq-user', JSON.stringify(r.user));
    return r;
  };

  const signInWithGoogle = async (credential) => {
    const r = await auth.googleLogin(credential);
    setUser(r.user);
    sessionStorage.setItem('clauseiq-user', JSON.stringify(r.user));
    return r;
  };

  const signOut = async () => {
    await auth.logout();
    setUser(null);
    sessionStorage.removeItem('clauseiq-user');
  };

  return (
    <C.Provider
      value={{
        user,
        signIn,
        signInWithGoogle,
        signOut,
        register: auth.register,
      }}
    >
      {children}
    </C.Provider>
  );
}

export const useAuth = () => useContext(C);