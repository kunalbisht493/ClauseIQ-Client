import { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { verifyEmail } from '../services/auth.service';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { loadCurrentUser } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('This verification link is missing a token.');
      return;
    }

    verifyEmail(token)
      .then((res) => {
        if (res?.token) localStorage.setItem('clauseiq-token', res.token);
        return loadCurrentUser();
      })
      .then(() => setStatus('done'))
      .catch((e) => {
        setStatus('error');
        setMessage(e.message);
      });
  }, [token]);

  if (status === 'done') return <Navigate to="/" replace />;

  return (
    <div className="auth">
      <section className="authcard" style={{ margin: '0 auto', alignSelf: 'center' }}>
        <p className="eyebrow">WELCOME</p>

        {status === 'verifying' && <h2>Verifying your email…</h2>}

        {status === 'error' && (
          <>
            <h2>Verification failed</h2>
            <p className="alert error">
              {message || 'This link is invalid or has expired.'}
            </p>
            <Link className="secondary" to="/login">
              Go to login
            </Link>
          </>
        )}
      </section>
    </div>
  );
}