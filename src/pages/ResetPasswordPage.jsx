import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword, broadcastAuthEvent } from '../services/auth.service';
import PasswordInput, { validatePasswordStrength } from '../components/common/PasswordInput';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const token = params.get('token');

  async function submit(event) {
    event.preventDefault();
    setError('');

    const strength = validatePasswordStrength(password);
    if (!strength.isValid) {
      return setError('Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.');
    }

    if (password !== confirmation) {
      return setError('Passwords do not match');
    }

    setBusy(true);
    try {
      await resetPassword(token, password);
      // Immediately notify all other open tabs to log out without requiring manual refresh
      broadcastAuthEvent({ type: 'LOGOUT', reason: 'password_reset' });
      sessionStorage.setItem('clauseiq-session-notice', 'Password reset successfully! Please sign in with your new password.');
      navigate('/login', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <div className="auth">
        <section className="authcard">
          <h2>Invalid reset link</h2>
          <p>
            <Link className="link" to="/forgot-password">
              Request a new link
            </Link>
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="auth">
      <section className="authcard">
        <p className="eyebrow">PASSWORD RESET</p>
        <h2>Set a new password</h2>
        <p className="muted">Enter your new strong password below to regain access to your account.</p>

        {error && <p className="alert error">{error}</p>}

        <form onSubmit={submit}>
          <label>
            New password
            <PasswordInput
              required
              placeholder="Choose a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showRequirements={true}
              autoComplete="new-password"
            />
          </label>
          <label>
            Confirm new password
            <PasswordInput
              required
              placeholder="Re-enter your new password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <button className="primary wide" disabled={busy}>
            {busy ? 'Resetting password…' : 'Reset password'}
          </button>
        </form>

        <p>
          <Link className="link" to="/login">
            ← Back to sign in
          </Link>
        </p>
      </section>
    </div>
  );
}

