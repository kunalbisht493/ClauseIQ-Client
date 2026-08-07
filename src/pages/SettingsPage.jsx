import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { changePassword, deleteAccount } from '../services/auth.service';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const hasPassword = Boolean(user?.hasPassword);

  const [section, setSection] = useState(null); // null | 'password' | 'delete'

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwNotice, setPwNotice] = useState('');
  const [pwBusy, setPwBusy] = useState(false);

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function submitPassword(e) {
    e.preventDefault();
    setPwError('');
    setPwNotice('');

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New password and confirmation do not match');
      return;
    }

    setPwBusy(true);
    try {
      const r = await changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwNotice(r.message);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
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

  function backToList() {
    setSection(null);
    setConfirmingDelete(false);
    setDeletePassword('');
    setDeleteError('');
    setPwError('');
    setPwNotice('');
  }

  return (
    <>
      <Link className="back" to="/">
        ← Back to overview
      </Link>

      <header>
        <div>
          <p className="eyebrow">SETTINGS</p>
          <h1>Account settings</h1>
          <p>Manage your password and account security.</p>
        </div>
      </header>

      {section === null && (
        <div className="settings-list">
          <button type="button" className="settings-option" onClick={() => setSection('password')}>
            <span>
              <b>{hasPassword ? 'Change password' : 'Set a password'}</b>
              <small>
                {hasPassword
                  ? 'Update the password used to log in'
                  : 'Add a password so you can log in without Google'}
              </small>
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <button type="button" className="settings-option danger" onClick={() => setSection('delete')}>
            <span>
              <b>Delete account</b>
              <small>Permanently delete your account and all documents</small>
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}

      {section === 'password' && (
        <section className="panel" style={{ maxWidth: 480 }}>
          <button type="button" className="link settings-back" onClick={backToList}>
            ← Back to settings
          </button>
          <h2>{hasPassword ? 'Change password' : 'Set a password'}</h2>

          {!hasPassword && (
            <p className="muted" style={{ marginBottom: 16 }}>
              You signed up with Google, so your account doesn't have a
              password yet. Set one below if you'd also like to be able to
              log in with your email and password.
            </p>
          )}

          {pwError && <p className="alert error">{pwError}</p>}
          {pwNotice && <p className="alert success">{pwNotice}</p>}

          <form onSubmit={submitPassword}>
            {hasPassword && (
              <label>
                Current password
                <input
                  type="password"
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                />
              </label>
            )}
            <label>
              New password
              <input
                required
                type="password"
                minLength="8"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              />
            </label>
            <label>
              Confirm new password
              <input
                required
                type="password"
                minLength="8"
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
              />
            </label>
            <button className="primary wide" disabled={pwBusy}>
              {pwBusy
                ? (hasPassword ? 'Updating…' : 'Setting password…')
                : (hasPassword ? 'Update password' : 'Set password')}
            </button>
          </form>
        </section>
      )}

      {section === 'delete' && (
        <section className="panel danger-zone" style={{ maxWidth: 480 }}>
          <button type="button" className="link settings-back" onClick={backToList}>
            ← Back to settings
          </button>
          <h2>Delete account</h2>
          <p className="muted">
            Permanently delete your account, all uploaded documents, and their analyses. This cannot be undone.
          </p>

          {deleteError && <p className="alert error">{deleteError}</p>}

          {!confirmingDelete ? (
            <button
              type="button"
              className="danger"
              onClick={() => setConfirmingDelete(true)}
            >
              Delete my account
            </button>
          ) : (
            <form onSubmit={submitDelete}>
              {hasPassword ? (
                <label>
                  Confirm your password to continue
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                  />
                </label>
              ) : (
                <p className="muted" style={{ marginBottom: 4 }}>
                  You signed in with Google, so no password is needed —
                  click below to permanently delete your account.
                </p>
              )}
              <div className="danger-actions">
                <button type="submit" className="danger" disabled={deleteBusy}>
                  {deleteBusy ? 'Deleting…' : 'Permanently delete account'}
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
    </>
  );
}