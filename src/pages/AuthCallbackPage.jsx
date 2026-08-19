import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallbackPage() {
  const { loadCurrentUser } = useAuth();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    loadCurrentUser()
      .then(() => setStatus('done'))
      .catch(() => setStatus('error'));
  }, []);

  if (status === 'done') return <Navigate to="/" replace />;
  if (status === 'error') return <Navigate to="/login" replace />;

  return (
    <div className="auth">
      <section className="authcard" style={{ margin: '0 auto', alignSelf: 'center' }}>
        <p className="eyebrow">WELCOME</p>
        <h2>Signing you in…</h2>
      </section>
    </div>
  );
}