import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Check, Route, Alert, User } from './Icons';

type Mode = 'login' | 'signup';

export function LoginPage() {
  const login = useStore((s) => s.login);
  const signup = useStore((s) => s.signup);

  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError('');
    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signup') await signup(username, password);
      else await login(username, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError('');
    setPassword('');
    setConfirm('');
  }

  return (
    <section className="container" style={{ paddingTop: 60, paddingBottom: 80 }}>
      <div className="auth-wrap">
        <div className="form-card">
          <div className="auth-head">
            <div className="auth-badge"><User /></div>
            <h1 className="auth-title">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
            <p className="auth-sub">
              {mode === 'login'
                ? 'Log in to pick up your roadmap and study progress where you left off.'
                : 'Sign up to save your roadmap and track your daily study progress.'}
            </p>
          </div>

          <div className="auth-tabs">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Log in</button>
            <button className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>Sign up</button>
          </div>

          <div className="field">
            <div className="field__label"><b>Username</b></div>
            <input
              className="text-input"
              placeholder="e.g. srinivas"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              autoFocus
            />
          </div>

          <div className="field">
            <div className="field__label"><b>Password</b></div>
            <input
              className="text-input"
              type="password"
              placeholder="Your password"
              value={password}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </div>

          {mode === 'signup' && (
            <div className="field">
              <div className="field__label"><b>Confirm password</b></div>
              <input
                className="text-input"
                type="password"
                placeholder="Re-enter your password"
                value={confirm}
                autoComplete="new-password"
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
            </div>
          )}

          {error && (
            <div className="form-error" style={{ marginBottom: 18 }}>
              <Alert /> {error}
            </div>
          )}

          <button
            className="btn btn--primary"
            onClick={submit}
            disabled={busy}
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
          >
            {mode === 'login' ? <><Route /> Log in</> : <><Check /> Create account &amp; start</>}
          </button>

          <p className="auth-switch">
            {mode === 'login' ? (
              <>New here? <button onClick={() => switchMode('signup')}>Create an account</button></>
            ) : (
              <>Already have an account? <button onClick={() => switchMode('login')}>Log in</button></>
            )}
          </p>

          <p className="auth-note">
            Accounts and progress are stored privately in this browser on this device.
          </p>
        </div>
      </div>
    </section>
  );
}
