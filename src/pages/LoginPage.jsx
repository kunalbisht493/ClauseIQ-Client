import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, signIn, signInWithGoogle, register } = useAuth();
  const nav = useNavigate();

  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function go(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'login') {
        await signIn({ email: form.email, password: form.password });
        nav('/');
      } else {
        const r = await register(form);
        setNotice(r.message);
        setMode('login');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    setError('');
    setBusy(true);
    try {
      await signInWithGoogle(credentialResponse.credential);
      nav('/');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  function handleGoogleError() {
    setError('Google sign-in failed. Please try again.');
  }

  return (
    <div className="auth">
      <section className="intro">
        <div className="brand">
          Clause<span>IQ</span>
        </div>
        <h1>Understand every clause before you sign.</h1>
        <p>
          Upload contracts, uncover risks, and get clear answers grounded in
          your document.
        </p>
        <ul>
          <li>AI-powered contract review</li>
          <li>Risk flags with clear reasoning</li>
          <li>Plain-language answers</li>
        </ul>
      </section>

      <section className="authcard">
        <p className="eyebrow">WELCOME</p>
        <h2>{mode === 'login' ? 'Sign in to your workspace' : 'Create your workspace'}</h2>

        {error && <p className="alert error">{error}</p>}
        {notice && <p className="alert success">{notice}</p>}

        <div className="google-auth">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            width="100%"
            text={mode === 'login' ? 'signin_with' : 'signup_with'}
          />
        </div>

        <div className="divider">
          <span >or</span>
        </div>

        <form onSubmit={go}>
          {mode === 'register' && (
            <label>
              Full name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
          )}
          <label>
            Email address
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Password
            <input
              required
              minLength="8"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          <button className="primary wide" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p>
          {mode === 'login' ? 'New to ClauseIQ? ' : 'Already have an account? '}
          <button
            className="link"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </section>
    </div>
  );
}