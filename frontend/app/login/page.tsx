'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {api} from '@/lib/api';

type AuthResponse = {
  token: string;
};

export default function Login() {
  const [email, setEmail] = useState('marius@test.com');
  const [displayName, setDisplayName] = useState('Marius');
  const [password, setPassword] = useState('password1');
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit() {
    setError('');

    try {
      const path = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body = mode === 'register' ? {email, displayName, password} : {email, password};
      const res = await api<AuthResponse>(path, {method: 'POST', body: JSON.stringify(body)});
      localStorage.setItem('token', res.token);
      router.push('/matches');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not sign in');
    }
  }

  return (
    <main className="page">
      <section className="hero mb-5">
        <div className="flex items-center gap-4">
          <img className="hero-mark" src="/icon.svg" alt="" width={68} height={68}/>
          <div>
            <p className="eyebrow">Welcome</p>
            <h1 className="text-3xl font-black leading-none">{mode === 'register' ? 'Create account' : 'Login'}</h1>
          </div>
        </div>
      </section>

      <div className="grid gap-3">
        {error && <div className="card text-red-200">{error}</div>}

        {mode === 'register' && (
          <input className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display name"/>
        )}
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>

        <button className="btn" onClick={submit}>{mode === 'register' ? 'Register' : 'Login'}</button>
        <button className="btn btn-secondary" onClick={() => setMode(mode === 'register' ? 'login' : 'register')}>
          {mode === 'register' ? 'I already have an account' : 'Create account'}
        </button>
      </div>
    </main>
  );
}
