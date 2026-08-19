import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await forgotPassword(email);
      setMessage(result.message || 'If an account exists for this email, a password-reset link has been sent.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <section className="intro">
        <div className="brand">
          Clause<span>IQ</span>
        </div>
        <h1>Reset your password</h1>
        <p>
          Enter the email address associated with your account, and we'll send you a secure link to create a new password.
        </p>
        <ul>
          <li>Secure time-limited reset link</li>
          <li>Instant password update</li>
          <li>Full workspace protection</li>
        </ul>
      </section>

      <section className="authcard">
        <p className="eyebrow">ACCOUNT RECOVERY</p>
        <h2>Forgot your password?</h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          Enter your registered email address below. If you registered with Google and have not set a password yet, please sign in with Google directly.
        </p>

        {message && (
          <div className="alert success">
            <p style={{ margin: 0, fontWeight: 600 }}>{message}</p>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#165b53' }}>
              Check Spam folder if not in inbox.
            </p>
          </div>
        )}

        {error && <p className="alert error">{error}</p>}

        <form onSubmit={submit}>
          <label>
            Email address
            <input
              required
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>
          <button className="primary wide" disabled={busy}>
            {busy ? 'Sending reset link…' : 'Send password reset link'}
          </button>
        </form>

        <p>
          Remember your password?{' '}
          <Link className="link" to="/login">
            Back to sign in
          </Link>
        </p>
      </section>
    </div>
  );
}

