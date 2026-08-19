import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { changePassword, deleteAccount, forgotPassword } from '../services/auth.service';
import PasswordInput, { validatePasswordStrength } from '../components/common/PasswordInput';

export default function SettingsPage() {
  const { user, signOut, loadCurrentUser } = useAuth();
  const nav = useNavigate();
  const hasPassword = Boolean(user?.hasPassword);

  const [activeTab, setActiveTab] = useState('password'); // 'password' | 'danger'

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwNotice, setPwNotice] = useState('');
  const [pwBusy, setPwBusy] = useState(false);
  const [resetEmailSending, setResetEmailSending] = useState(false);

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  async function handleSendResetEmail() {
    if (!user?.email) return;
    setResetEmailSending(true);
    setPwError('');
    setPwNotice('');
    try {
      const res = await forgotPassword(user.email);
      setPwNotice(res.message || `A password reset link has been sent to ${user.email}. Please check your inbox.`);
    } catch (err) {
      setPwError(err.message);
    } finally {
      setResetEmailSending(false);
    }
  }

  async function submitPassword(e) {
    e.preventDefault();
    setPwError('');
    setPwNotice('');

    const strength = validatePasswordStrength(pwForm.newPassword);
    if (!strength.isValid) {
      setPwError('Please choose a strong password with at least 8 characters, an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New password and confirmation do not match');
      return;
    }

    setPwBusy(true);
    try {
      const r = await changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwNotice(r.message || (hasPassword ? 'Password updated successfully' : 'Password set successfully'));
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      await loadCurrentUser();
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwBusy(false);
    }
  }

  async function submitDelete(e) {
    e.preventDefault();
    setDeleteError('');

    if (!window.confirm('This will permanently delete your account and all your documents. This cannot be undone. Continue?')) {
      return;
    }

    setDeleteBusy(true);
    try {
      await deleteAccount(deletePassword);
      await signOut();
      nav('/login');
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <>
      <Link className="back" to="/">
        ← Back to overview
      </Link>

      <header>
        <div>
          <p className="eyebrow">SETTINGS</p>
          <h1>Account Settings</h1>
          <p>Manage your account profile, credentials, and security preferences.</p>
        </div>
      </header>

      <div className="settings-container">
        {/* User Profile Card */}
        <section className="settings-profile-card">
          <div className="settings-avatar">{userInitial}</div>
          <div className="settings-profile-info">
            <h2>{user?.name || 'User Account'}</h2>
            <p>{user?.email}</p>
            <div className="settings-badges">
              {hasPassword ? (
                <span className="settings-badge password">
                  <span>🔑</span> Email & Password
                </span>
              ) : (
                <span className="settings-badge google">
                  <span>G</span> Google Sign-in
                </span>
              )}
              {user?.emailVerified && (
                <span className="settings-badge verified">
                  <span>✓</span> Verified Email
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="settings-nav-tabs">
          <button
            type="button"
            className={`settings-nav-tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('password');
              setPwError('');
              setPwNotice('');
            }}
          >
            {hasPassword ? 'Change Password' : 'Set Password'}
          </button>
          <button
            type="button"
            className={`settings-nav-tab ${activeTab === 'danger' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('danger');
              setDeleteError('');
            }}
          >
            Danger Zone
          </button>
        </div>

        {/* Password Tab */}
        {activeTab === 'password' && (
          <section className="settings-panel-card">
            <h2>{hasPassword ? 'Change your password' : 'Create an account password'}</h2>

            {!hasPassword ? (
              <div className="settings-banner">
                <b>Google Account:</b> You currently log in via Google. Setting a password allows you to also sign in using your email address and password directly.
              </div>
            ) : (
              <div className="settings-banner">
                Choose a strong password with at least 8 characters. Your new password will be required next time you log in with email.
              </div>
            )}

            {pwError && <p className="alert error">{pwError}</p>}
            {pwNotice && <p className="alert success">{pwNotice}</p>}

            <form onSubmit={submitPassword} style={{ display: 'grid', gap: '16px', maxWidth: '440px' }}>
              {hasPassword && (
                <div>
                  <label>
                    Current password
                    <PasswordInput
                      required
                      placeholder="Enter your existing password"
                      value={pwForm.currentPassword}
                      onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                      autoComplete="current-password"
                    />
                  </label>
                  <div style={{ marginTop: '6px', textAlign: 'right' }}>
                    <button
                      type="button"
                      className="link"
                      style={{ fontSize: '12px', color: '#14796f', fontWeight: 600, textDecoration: 'underline' }}
                      disabled={resetEmailSending}
                      onClick={handleSendResetEmail}
                    >
                      {resetEmailSending ? 'Sending reset link…' : 'Forgot current password? Send reset link'}
                    </button>
                  </div>
                </div>
              )}
              <label>
                New password
                <PasswordInput
                  required
                  placeholder="Choose a strong password"
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  showRequirements={true}
                  autoComplete="new-password"
                />
              </label>
              <label>
                Confirm new password
                <PasswordInput
                  required
                  placeholder="Re-enter your new password"
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                  autoComplete="new-password"
                />
              </label>
              <button className="primary" style={{ justifySelf: 'start', marginTop: '6px' }} disabled={pwBusy}>
                {pwBusy
                  ? (hasPassword ? 'Updating…' : 'Setting password…')
                  : (hasPassword ? 'Update password' : 'Set password')}
              </button>
            </form>
          </section>
        )}

        {/* Danger Zone Tab */}
        {activeTab === 'danger' && (
          <section className="settings-panel-card danger-zone">
            <h2 style={{ color: '#aa392e' }}>Delete Account</h2>
            <div className="settings-banner warning">
              <b>Warning:</b> Deleting your account will permanently delete all uploaded contracts, analysis summaries, vector database embeddings, and personal data. This action is irreversible.
            </div>

            {deleteError && <p className="alert error">{deleteError}</p>}

            {!confirmingDelete ? (
              <button
                type="button"
                className="danger"
                onClick={() => setConfirmingDelete(true)}
              >
                Permanently delete account
              </button>
            ) : (
              <form onSubmit={submitDelete} style={{ display: 'grid', gap: '16px', maxWidth: '440px' }}>
                {hasPassword ? (
                  <label>
                    Enter your password to confirm deletion
                    <PasswordInput
                      required
                      placeholder="Your current password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </label>
                ) : (
                  <p className="muted" style={{ margin: 0 }}>
                    Since you signed in with Google, no password is required. Click below to confirm permanent deletion.
                  </p>
                )}
                <div className="danger-actions">
                  <button type="submit" className="danger" disabled={deleteBusy}>
                    {deleteBusy ? 'Deleting account…' : 'I understand, delete my account'}
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      setConfirmingDelete(false);
                      setDeletePassword('');
                      setDeleteError('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>
        )}
      </div>
    </>
  );
}