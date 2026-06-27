'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Nav from '@/components/Nav';
import {ApiError, api, isLoggedIn} from '@/lib/api';

type Group = {id: string; name: string; inviteCode: string};

export default function JoinGroup() {
  const [inviteCode, setInviteCode] = useState('');
  const [group, setGroup] = useState<Group | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) router.replace('/login');
  }, [router]);

  async function join() {
    const code = inviteCode.trim().toUpperCase();
    if (!code) {
      setError('Enter an invite code.');
      return;
    }

    setError('');
    setGroup(null);

    try {
      setGroup(await api<Group>(`/api/groups/join/${encodeURIComponent(code)}`, {method: 'POST'}));
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        localStorage.removeItem('token');
        router.replace('/login');
        return;
      }
      setError(e instanceof Error ? e.message : 'Could not join group.');
    }
  }

  return (
    <main className="page">
      <Link href="/" className="back-link">← Back</Link>
      <div className="mb-5">
        <p className="eyebrow">Private league</p>
        <h1 className="page-title">Join group</h1>
      </div>

      {error && <div className="card mb-3 text-red-200">{error}</div>}

      <div className="card">
        <label className="block">
          <span className="block text-sm font-bold text-white/60 mb-2">Invite code</span>
          <input
            className="input uppercase tracking-widest"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="XKKPM5FL"
          />
        </label>
        <button className="btn mt-3" onClick={join}>Join group</button>
      </div>

      {group && (
        <div className="card mt-5">
          <p className="eyebrow">Joined</p>
          <h2 className="text-2xl font-black mt-1">{group.name}</h2>
          <Link className="btn mt-4" href="/matches">Go to matches</Link>
        </div>
      )}

      <Nav/>
    </main>
  );
}
